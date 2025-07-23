import * as THREE from "three";
import { useEffect, useRef } from "react";
import { OrbitControls } from "three/examples/jsm/Addons.js";

export default function TheEarth() {
  const sceneRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (sceneRef.current) {
      // 01_creating scene
      const scene = new THREE.Scene();
      const w = sceneRef.current.clientWidth;
      const h = sceneRef.current.clientHeight;

      //02_creating camera
      const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 100);
      camera.position.z = 4;

      //03_creating WebGL renderer for rendering
      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(w, h);
      sceneRef.current.appendChild(renderer.domElement);

      //04_creating the object and adding it to the scene
      const icoGeo = new THREE.IcosahedronGeometry(1,12);
      const icoMat = new THREE.MeshStandardMaterial({ color: 0xffff00 });
      const icoMesh = new THREE.Mesh(icoGeo, icoMat);
      scene.add(icoMesh);

      //05_rendering (for rendering a frame)
      // renderer.render(scene, camera);

      //06_Adding light
      const light = new THREE.HemisphereLight(0xffffff,0x000000);
      scene.add(light);

      //07_Orbit control
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.03;

      //Render the animation
      const animate = () => {
        requestAnimationFrame(animate);
        cubeMesh.rotation.x += 0.001;
        cubeMesh.rotation.y += 0.001;
        cubeMesh.rotation.z += 0.001;

        renderer.render(scene, camera);
        controls.update();
      };
      animate();

      // At the END Cleanup on component unmount
      const sceneRefCleaner = sceneRef.current;
      return () => {
        renderer.dispose();
        sceneRefCleaner.removeChild(renderer.domElement);
      };
    }
  }, []);

  return <div ref={sceneRef} className="h-screen w-screen overflow-hidden" />;
}
