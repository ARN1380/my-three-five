import { useRef, useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";

export default function ThreeScene() {
  const sceneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (sceneRef.current) {
      // Create the scene
      const scene = new THREE.Scene();
      // Get container dimensions
      const width = sceneRef.current.clientWidth;
      const height = sceneRef.current.clientHeight;

      // Create the camera
      const camera = new THREE.PerspectiveCamera(
        75, // Field of view
        width / height, // Aspect ratio
        0.1, // Near clipping plane
        100 // Far clipping plane
      );
      camera.position.z = 4;

      // Create the renderer
      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(width, height);
      sceneRef.current.appendChild(renderer.domElement);

      //Orbit controls
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.03;

      // sphere
      const icoGeo = new THREE.IcosahedronGeometry(1.5, 3);
      const material = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        flatShading: true,
      });
      const IcoSphere = new THREE.Mesh(icoGeo, material);
      scene.add(IcoSphere);
      //light
      const hemiLight = new THREE.HemisphereLight(0x0acf21, 0xae27e3);
      scene.add(hemiLight);
      //wireframe sphere
      const IcoWireMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        wireframe: true,
        transparent: true,
        opacity: 0.1,
        alphaTest: 0.1, // Fixes transparency artifacts
      });
      const IcoWireMesh = new THREE.Mesh(icoGeo, IcoWireMat);
      IcoWireMesh.scale.setScalar(1.4);
      IcoSphere.add(IcoWireMesh);

      //vertecies sphere
      const IcoPointsMat = new THREE.PointsMaterial({
        color: 0xffffff,
        sizeAttenuation: true,
        size: 0.004,
      });
      const IcoPointsMesh = new THREE.Points(icoGeo, IcoPointsMat);
      IcoPointsMesh.scale.setScalar(1.2);
      scene.add(IcoPointsMesh);

      // Animation loop
      const animate = () => {
        requestAnimationFrame(animate);
        // console.log(requestAnimationFrame(animate));
        IcoSphere.rotation.x += 0.001;
        IcoSphere.rotation.y += 0.002;
        // IcoWireMesh.rotation.y = Math.sin(IcoSphere.rotation.y) * 1.5;
        IcoPointsMesh.rotation.y = Math.sin(IcoSphere.rotation.y * 2.3);
        IcoPointsMesh.rotation.x = -Math.sin(IcoSphere.rotation.y * 1.3);
        renderer.render(scene, camera);
        controls.update();
      };
      animate();

      // Handle window resize
      const handleResize = () => {
        const newWidth = sceneRef.current?.clientWidth || 0;
        const newHeight = sceneRef.current?.clientHeight || 0;
        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(newWidth, newHeight);
      };
      window.addEventListener("resize", handleResize);

      // Cleanup on component unmount
      const sceneRefCleaner = sceneRef.current;
      return () => {
        renderer.dispose();
        sceneRefCleaner.removeChild(renderer.domElement);
        window.removeEventListener("resize", handleResize);
      };
    }
  }, []);

  return <div ref={sceneRef} className="h-screen w-screen overflow-hidden" />;
}
