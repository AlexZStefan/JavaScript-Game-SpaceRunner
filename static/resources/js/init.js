import { DirectionalLight, DirectionalLightHelper, BoxGeometry, Mesh, MeshBasicMaterial, 
  GridHelper, Scene, WebGLRenderer, PerspectiveCamera } 
  from "https://unpkg.com/three@0.127.0/build/three.module.js"

let init, myWebCanvas, SRC;

init = () => {
  const scene = new Scene();

  const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

  camera.position.set(0, 1, 0);
  camera.rotation.y = Math.PI;

  const renderer = new WebGLRenderer();

  renderer.setSize(window.innerWidth, window.innerHeight);

  // find the div element
  myWebCanvas = document.getElementById("webgl")
  // assigne the renderer to the div element in index.html
  myWebCanvas.appendChild(renderer.domElement);

  // adds the gameLights into the scene

  /*
  const GRID_HELPER = new GridHelper(10, 10);
  scene.add(GRID_HELPER);
  */
  
  SRC = [scene, renderer, camera]

  const onWindowResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  window.addEventListener("resize", onWindowResize, false);

  // scene renderer camera 
  return SRC;
};

export { init }
