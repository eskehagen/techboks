import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

interface Model3DViewerProps {
  src: string;
  className?: string;
  rotation?: [number, number, number];
}

const defaultRotation: [number, number, number] = [0, 0, 0];

/**
 * Rotatable STL preview, presented as a lit studio shot: light satin model on a
 * dark stage, environment-mapped reflections, a soft contact shadow, and a mint
 * rim light picking out the silhouette.
 */
export function Model3DViewer({ src, className, rotation = defaultRotation }: Model3DViewerProps) {
  const canvasHostRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    const host = canvasHostRef.current;
    if (!host) return;

    let disposed = false;
    let animationId = 0;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      42,
      host.clientWidth / Math.max(host.clientHeight, 1),
      0.1,
      3000,
    );
    camera.position.set(0, 40, 200);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(host.clientWidth, host.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.78;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    host.appendChild(renderer.domElement);

    // Studio reflections — gives the satin finish something to catch.
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envRT = pmrem.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = envRT.texture;

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.1);
    keyLight.position.set(60, 120, 90);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(1024, 1024);
    keyLight.shadow.radius = 4;
    keyLight.shadow.bias = -0.0005;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 0.25);
    fillLight.position.set(-90, 20, 60);
    scene.add(fillLight);

    // Mint rim light — ties the viewer to the brand accent.
    const rimLight = new THREE.DirectionalLight(0x5ee0b0, 1.5);
    rimLight.position.set(-40, 30, -120);
    scene.add(rimLight);

    scene.add(new THREE.AmbientLight(0xffffff, 0.12));

    const shadowPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(1200, 1200),
      new THREE.ShadowMaterial({ opacity: 0.35 }),
    );
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.receiveShadow = true;
    scene.add(shadowPlane);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.enablePan = false;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1.1;
    controls.addEventListener("start", () => setHasInteracted(true));

    setStatus("loading");
    const loader = new STLLoader();
    loader.load(
      src,
      (geometry) => {
        if (disposed) return;

        geometry.computeBoundingBox();
        const box = geometry.boundingBox!;
        const center = new THREE.Vector3();
        box.getCenter(center);
        geometry.translate(-center.x, -center.y, -center.z);
        geometry.computeBoundingBox();
        geometry.computeBoundingSphere();
        geometry.computeVertexNormals();

        const size = new THREE.Vector3();
        box.getSize(size);
        const maxDim = Math.max(size.x, size.y, size.z) || 1;
        const scale = 100 / maxDim;

        const material = new THREE.MeshStandardMaterial({
          color: 0x7f8a99,
          metalness: 0.25,
          roughness: 0.45,
          envMapIntensity: 0.32,
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.rotation.set(...rotation);
        mesh.scale.setScalar(scale);
        mesh.castShadow = true;
        scene.add(mesh);

        // Drop the shadow catcher just under the model's lowest point.
        const scaledBox = new THREE.Box3().setFromObject(mesh);
        shadowPlane.position.y = scaledBox.min.y - 2;

        const radius = (geometry.boundingSphere?.radius ?? maxDim / 2) * scale;
        const fov = camera.fov * (Math.PI / 180);
        const distance = Math.abs(radius / Math.sin(fov / 2)) * 1.25;

        camera.position.set(distance * 0.35, radius * 0.5, distance * 0.9);
        controls.target.set(0, 0, 0);
        controls.minDistance = distance * 0.45;
        controls.maxDistance = distance * 2.2;
        // Keep the camera above the shadow plane so the model never looks like it's floating.
        controls.maxPolarAngle = Math.PI * 0.52;
        controls.update();

        setStatus("ready");
      },
      undefined,
      () => {
        if (!disposed) setStatus("error");
      },
    );

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const resizeObserver = new ResizeObserver(() => {
      const { clientWidth, clientHeight } = host;
      if (clientWidth === 0 || clientHeight === 0) return;
      camera.aspect = clientWidth / clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(clientWidth, clientHeight);
    });
    resizeObserver.observe(host);

    return () => {
      disposed = true;
      cancelAnimationFrame(animationId);
      resizeObserver.disconnect();
      controls.dispose();
      envRT.texture.dispose();
      pmrem.dispose();
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
          const material = obj.material;
          if (Array.isArray(material)) material.forEach((m) => m.dispose());
          else material.dispose();
        }
      });
      renderer.dispose();
      if (renderer.domElement.parentNode === host) {
        host.removeChild(renderer.domElement);
      }
    };
  }, [rotation, src]);

  return (
    <div className={`rounded-blob-lg bg-ink relative overflow-hidden ${className ?? ""}`}>
      {/* Stage lighting */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_90%_at_75%_5%,rgba(94,224,176,0.16),transparent_55%),radial-gradient(90%_70%_at_20%_100%,rgba(255,255,255,0.07),transparent_60%)]"
      />
      <div
        aria-hidden
        className="ring-canvas/10 pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-inset"
      />

      <div ref={canvasHostRef} className="h-full w-full cursor-grab active:cursor-grabbing" />

      {/* Badge */}
      <span className="bg-canvas/10 text-canvas/70 ring-canvas/10 pointer-events-none absolute top-4 left-4 rounded-full px-3 py-1.5 text-[10px] font-semibold tracking-[0.18em] uppercase ring-1 backdrop-blur-sm">
        3D model
      </span>

      {/* Interaction hint — fades once the user grabs the model */}
      {status === "ready" && (
        <div
          className={`pointer-events-none absolute inset-x-0 bottom-4 flex justify-center transition-opacity duration-700 ${
            hasInteracted ? "opacity-0" : "opacity-100"
          }`}
        >
          <span className="bg-ink/60 text-canvas/70 ring-canvas/10 rounded-full px-4 py-2 text-xs ring-1 backdrop-blur-sm">
            Træk for at rotere · scroll for at zoome
          </span>
        </div>
      )}

      {status === "loading" && (
        <div className="pointer-events-none absolute inset-0 grid place-items-center">
          <div className="flex flex-col items-center gap-3">
            <span className="border-canvas/15 border-t-accent-mint h-8 w-8 animate-spin rounded-full border-2" />
            <span className="text-canvas/50 text-xs tracking-wide">Indlæser 3D model…</span>
          </div>
        </div>
      )}

      {status === "error" && (
        <div className="pointer-events-none absolute inset-0 grid place-items-center px-6">
          <span className="text-canvas/50 text-center text-sm">
            Kunne ikke indlæse 3D modellen.
          </span>
        </div>
      )}
    </div>
  );
}
