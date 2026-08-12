import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

interface Model3DViewerProps {
  src: string;
  className?: string;
}

/** Rotatable STL preview — ported from the old site's 3d-viewer-module.js onto three.js's own loader/controls. */
export function Model3DViewer({ src, className }: Model3DViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let disposed = false;
    let animationId = 0;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf5f5f5);

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / Math.max(container.clientHeight, 1),
      0.1,
      2000,
    );
    camera.position.set(0, 0, 150);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const light1 = new THREE.DirectionalLight(0xffffff, 0.8);
    light1.position.set(100, 100, 100);
    scene.add(light1);
    const light2 = new THREE.DirectionalLight(0xffffff, 0.4);
    light2.position.set(-100, -100, -100);
    scene.add(light2);
    const light3 = new THREE.DirectionalLight(0xffffff, 0.3);
    light3.position.set(0, -100, 0);
    scene.add(light3);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1.4;

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

        const material = new THREE.MeshPhongMaterial({
          color: 0x000000,
          specular: 0x111111,
          shininess: 200,
          side: THREE.DoubleSide,
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.scale.setScalar(scale);
        scene.add(mesh);

        const radius = (geometry.boundingSphere?.radius ?? maxDim / 2) * scale;
        const fov = camera.fov * (Math.PI / 180);
        const distance = Math.abs(radius / Math.sin(fov / 2)) * 1.3;
        camera.position.set(0, radius * 0.4, distance);
        controls.target.set(0, 0, 0);
        controls.minDistance = distance * 0.4;
        controls.maxDistance = distance * 2.5;
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
      const { clientWidth, clientHeight } = container;
      if (clientWidth === 0 || clientHeight === 0) return;
      camera.aspect = clientWidth / clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(clientWidth, clientHeight);
    });
    resizeObserver.observe(container);

    return () => {
      disposed = true;
      cancelAnimationFrame(animationId);
      resizeObserver.disconnect();
      controls.dispose();
      renderer.dispose();
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
          const material = obj.material;
          if (Array.isArray(material)) material.forEach((m) => m.dispose());
          else material.dispose();
        }
      });
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [src]);

  return (
    <div className={`relative ${className ?? ""}`}>
      <div ref={containerRef} className="h-full w-full cursor-grab active:cursor-grabbing" />
      {status === "loading" && (
        <div className="text-muted-foreground pointer-events-none absolute inset-0 grid place-items-center text-sm">
          Indlæser 3D model…
        </div>
      )}
      {status === "error" && (
        <div className="text-muted-foreground pointer-events-none absolute inset-0 grid place-items-center px-4 text-center text-sm">
          Kunne ikke indlæse 3D model.
        </div>
      )}
    </div>
  );
}
