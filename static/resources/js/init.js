import {
  DirectionalLight, Scene, WebGLRenderer, PerspectiveCamera, FontLoader, TextGeometry, BoxGeometry, Mesh, MeshBasicMaterial,Fog
}
  from "https://unpkg.com/three@0.127.0/build/three.module.js";

let myWebCanvas;

class GameScreen {
  constructor() {
    this.camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.gameScene = new Scene();
    this.loadingScene = new Scene();
    this.gameCamera = null;
    this.loadingCamera = null;
    this.renderer = null;
    this.init();
  }

  init() {
    this.gameScene.fog = new Fog( 0xCFE7E8,7,20);
    
    this.renderer = new WebGLRenderer();

    this.renderer.setSize(window.innerWidth, window.innerHeight);
    // find the div element
    myWebCanvas = document.getElementById("webgl")
    // assign the renderer to the div element in index.html
    myWebCanvas.appendChild(this.renderer.domElement); 

    /*
    const GRID_HELPER = new GridHelper(10, 10);
    scene.add(GRID_HELPER);
    */

    const onWindowResize = () => {
      this.gameCamera.aspect = window.innerWidth / window.innerHeight;
      this.loadingCamera.aspect = window.innerWidth / window.innerHeight;

      this.gameCamera.updateProjectionMatrix();
      this.loadingCamera.updateProjectionMatrix();

      this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    window.addEventListener("resize", onWindowResize, false);
    this.loadingScreen();
    this.gameScreen();
  }

  gameScreen = () => {
    this.gameCamera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.gameCamera.position.set(0, 1, 0);
    this.gameCamera.rotation.y = Math.PI;
   };

  loadingScreen() {
    this.loadingCamera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    let light = new DirectionalLight(0xfadede, 50);
    light.position.set(0, 10, 5);
    this.loadingCamera.position.set(0, 0, 15);
    let geometry;

    const fontLoader = new FontLoader();
    fontLoader.load("/resources/js/font.json", (font) => {
      geometry = new TextGeometry("Loading", {
        font: font,
        size: 80,
        height: 5,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 10,
        bevelSize: 8,
        bevelOffset: 0,
        bevelSegments: 5
      })
    });

    const mat = new MeshBasicMaterial({ color: 0x00ff00 });

    let boxG = new BoxGeometry(1, 1, 1);
    this. box = new Mesh(boxG, mat);
    this.box.position.set(0, 0, 5);

    const mesh = new Mesh(geometry, mat);

    mesh.position.set(0, 0, 5);

    this.loadingScene.add(mesh);
    this.loadingScene.add(light);
    this.loadingScene.add(this.box);
  }

  loadingScreenUpdate(){
   
    this.box.rotation.x += 0.05;
    this.box.rotation.y += 0.05;
  }
}

export { GameScreen }
