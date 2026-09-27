/**
 * The three.js part of the 3D preview. Kept in its own module so it is only
 * downloaded (≈140 KB gzip) when a viewer actually comes near the screen —
 * see Model3DViewer.tsx.
 */
import * as THREE from "three";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

export interface SceneHandle {
  /** Stop rendering while the viewer is off screen. */
  setPaused: (paused: boolean) => void;
  dispose: () => void;
}

export function mountScene(
  host: HTMLElement,
  {
    src,
    rotation,
    onStatus,
    onInteract,
  }: {
    src: string;
    rotation: [number, number, number];
    onStatus: (status: "loading" | "ready" | "error") => void;
    onInteract: () => void;
  },
): SceneHandle {
  let disposed = false;
  let paused = false;
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
  // PCFSoftShadowMap is deprecated in three r185 and falls back to this anyway.
  renderer.shadowMap.type = THREE.PCFShadowMap;
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
  controls.addEventListener("start", onInteract);

  onStatus("loading");
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

      onStatus("ready");
    },
    undefined,
    () => {
      if (!disposed) onStatus("error");
    },
  );

  const animate = () => {
    if (paused || disposed) return;
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

  return {
    setPaused(next) {
      if (next === paused) return;
      paused = next;
      if (paused) cancelAnimationFrame(animationId);
      else animate();
    },
    dispose() {
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
    },
  };
}
