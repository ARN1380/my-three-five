import { useRef, useEffect } from "react";
import * as THREE from "three";

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

      // Add a cube to the scene
      const geometry = new THREE.IcosahedronGeometry(1.5, 3);
      const material = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        flatShading: true,
      });
      const IcoSphere = new THREE.Mesh(geometry, material);
      scene.add(IcoSphere);

      const hemiLight = new THREE.HemisphereLight(0xffffff, 0x000000);
      scene.add(hemiLight);

      const IcoWireMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        wireframe: true,
      });
      const IcoWireMesh = new THREE.Mesh(geometry, IcoWireMat);
      IcoWireMesh.scale.setScalar(1.5);
      IcoSphere.add(IcoWireMesh);
      // Animation loop
      const animate = () => {
        requestAnimationFrame(animate);
        // console.log(requestAnimationFrame(animate));
        IcoSphere.rotation.x += 0.0;
        IcoSphere.rotation.y += 0.004;
        IcoWireMesh.rotation.y = Math.sin(-IcoSphere.rotation.y * 2 );

        renderer.render(scene, camera);
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
      return () => {
        renderer.dispose();
        sceneRef.current?.removeChild(renderer.domElement);
        window.removeEventListener("resize", handleResize);
      };
    }
  }, []);

  return <div ref={sceneRef} className="h-screen w-screen overflow-hidden" />;
}
