import { useRef, useEffect } from "react";
import * as THREE from "three";

export default function TheWormHole() {
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
      camera.position.z = 10;

      // Create the renderer
      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(width, height);
      sceneRef.current.appendChild(renderer.domElement);

      // Handle window resize
      const handleResize = () => {
        const newWidth = sceneRef.current?.clientWidth || 0;
        const newHeight = sceneRef.current?.clientHeight || 0;
        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(newWidth, newHeight);
      };
      window.addEventListener("resize", handleResize);

      // rest of the code usually goes here ... ⬇️

      const cube_G = new THREE.BoxGeometry(2, 5, 2);
      const cube_M = new THREE.MeshBasicMaterial({
        color: 0x003aaa,
      });
      const cube_O = new THREE.Mesh(cube_G, cube_M);

      //wire cube
      const cubeWire_M = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        wireframe: true,
      });
      const cubeWire_O = new THREE.Mesh(cube_G, cubeWire_M);
      cubeWire_O.scale.set(1.01, 1.01, 1.01);
      cube_O.add(cubeWire_O);

      scene.add(cube_O);

      //animation loop
      let counter = 0;
      const animate = () => {
        requestAnimationFrame(animate);
        counter += 0.01;
        console.log(counter);
        

        cube_O.rotateX(0.01);
        cube_O.rotateY(0.01);
        cube_O.rotateZ(0.01);

        renderer.render(scene, camera);
      };
      animate();

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
