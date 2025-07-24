import * as THREE from "three";
import { useEffect, useRef } from "react";
import { OrbitControls } from "three/examples/jsm/Addons.js";

import earthDiffuse from "../../public/assets/textures/Earth/00_earthmap1k.jpg";
import earthBump from "../../public/assets/textures/Earth/01_earthbump1k.jpg";
import earthSpec from "../../public/assets/textures/Earth/02_earthspec1k.jpg";
import earthLights from "../../public/assets/textures/Earth/03_earthlights1k.jpg";
import earthCloud from "../../public/assets/textures/Earth/04_earthcloudmap.jpg";
import earthCloudTransparent from "../../public/assets/textures/Earth/05_earthcloudmaptrans.jpg";

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
      camera.position.z = 3;

      //03_creating WebGL renderer for rendering
      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(w, h);
      sceneRef.current.appendChild(renderer.domElement);

      //04_creating the object and adding it to the scene
      const earthGroup = new THREE.Group();

      const icoGeo = new THREE.IcosahedronGeometry(1, 12);
      const loader = new THREE.TextureLoader();
      const icoMat = new THREE.MeshStandardMaterial({
        map: loader.load(earthDiffuse.src),
      });
      const earthMesh = new THREE.Mesh(icoGeo, icoMat);
      earthGroup.add(earthMesh);
      scene.add(earthGroup);

      const earthLightsMat = new THREE.MeshBasicMaterial({
        color: 0x809000,
        map: loader.load(earthLights.src),
        blending: THREE.AdditiveBlending,
        transparent: true,
        opacity: 0.2,
      });
      const earthLightsMesh = new THREE.Mesh(icoGeo, earthLightsMat);
      earthGroup.add(earthLightsMesh);

      // const cloudsMat = new THREE.MeshStandardMaterial({
      //   map: loader.load(earth.src),
      //   blending: THREE.AdditiveBlending,        
      // });
      // const cloudsMesh = new THREE.Mesh(icoGeo, cloudsMat);
      // earthGroup.add(cloudsMesh);

      //05_rendering (for rendering a frame)
      // renderer.render(scene, camera);

      //06_Adding light
      const dirLight = new THREE.DirectionalLight(0xffffff);
      const dirLightHelper = new THREE.DirectionalLightHelper(dirLight);
      dirLight.position.set(2, 2, 2);

      scene.add(dirLight);
      scene.add(dirLightHelper);  

      //07_Orbit control
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.03;

      //Render the animation
      const animate = () => {
        requestAnimationFrame(animate);

        earthGroup.rotation.y += 0.001;
        earthGroup.rotation.x += 0.0004;

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
