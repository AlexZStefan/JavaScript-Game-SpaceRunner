import {
  DirectionalLight, DirectionalLightHelper, AmbientLight, BoxGeometry, ConeGeometry,
  CylinderGeometry, PlaneGeometry, DoubleSide, BackSide, FrontSide, Mesh,
  MeshBasicMaterial, MeshStandardMaterial, MeshPhongMaterial, Group, Quaternion, Vector3,
  Euler, Object3D, TextureLoader, UVMapping, RepeatWrapping, AdditiveBlending, CustomBlending,
  AddEquation, OneFactor, ZeroFactor, SubtractEquation, AnimationMixer, Clock, LoopOnce
}
  from "https://unpkg.com/three@0.127.0/build/three.module.js"

import { Queue } from "./functions.js"

import { FBXModelManager } from "./modelLoader.js"
import {playAudio} from "./audioManager.js"

// functions
let skyCube, allMaterials, gameLights, createCube, createCone, createPlane,
  gameObjects, createCylinder;

const textureLoader = new TextureLoader();

// create the game background 
skyCube = (scene) => {
  textureLoader.load("./resources/textures/skyArt.jpg", (texture) => {
    scene.background = texture;
  })
}

allMaterials = {
  basicYellow: new MeshBasicMaterial({ color: 0xffff00, side: DoubleSide }),
  phongMat: new MeshPhongMaterial(),
  basicCoin: new MeshBasicMaterial(0xffffff)
}

//create allLights
export default gameLights = (scene) => {
  let allLights = [];
  let dirLight = new DirectionalLight(0xfadede, 50);
  const helper = new DirectionalLightHelper(dirLight, 5);
  dirLight.position.y = 5;
  dirLight.castShadow = true;
  allLights.push(dirLight);
  allLights.push(helper);
  allLights.forEach(element => scene.add(element));
};

createCube = (widthX, heightY, depthZ, cubeColor) => {
  let cube = new Object3D();
  const geometry = new BoxGeometry(widthX, heightY, depthZ);

  const material = new MeshPhongMaterial({ color: cubeColor });
  cube.attach(new Mesh(geometry, material));
  cube.name = "Cube"
  return cube;
}

createCylinder = (radiusTop, radiusBottom, height, radialSegments, heightSegments) => {
  const cylinder = new Object3D();
  const geometry = new CylinderGeometry(radiusTop, radiusBottom, height, radialSegments, heightSegments);
  ;
  cylinder.attach(new Mesh(geometry, allMaterials.basicCoin));
  cylinder.rotateX(1.62);
  return cylinder;
}

createCone = (radius, height, segments, coneColor, arr) => {
  let cone = new Object3D();
  const geometry = new ConeGeometry(radius, height, segments);

  // green 0x00ff00
  const material = new MeshPhongMaterial({ color: coneColor });

  cone.attach(new Mesh(geometry, material));
  cone.name = "Cone"
  cone.visible = true;
  if (!arr) {
    return cone;
  }
  else
    arr.push(cone);
}

createPlane = (widthX, heightY, color, arr) => {
  const geometry = new PlaneGeometry(widthX, heightY);
  const plane = new Mesh(geometry, allMaterials.basicYellow);

  plane.name = "Plane";
  if (!arr) {
    return plane;
  }
  else
    arr.push(plane);
}

class Coin extends Object3D {
  constructor() {
    super();
    this.texture;
    this.geometry;
    this.mesh;
    //this.position = {x, y,z};
    //this.position = new Position();
    this.material;
  }

  createCylinder(radiusTop, radiusBottom, height, radialSegments, heightSegments) {
    this.geometry = new CylinderGeometry(radiusTop, radiusBottom, height, radialSegments, heightSegments);
    this.material = new MeshPhongMaterial({ map: this.texture });
    this.attach(new Mesh(this.geometry, this.material));
    // rotate the object to face the up position
    this.rotateX(1.62);
    return this;
  }

  loadTexture(path) {
    const loader = new TextureLoader();
    this.texture = loader.load(`${path}`);
    return this;
  }

  addToScene(scene) {
    //this.object.position.set(0,0,15);
    scene.add(this.object);
  }

  update() {
    this.rotation.z += 0.05;
  }
}

class TerrainGen {
  constructor(scene, player) {
    this.scene = scene;
    this.player = player;
    this.queueIn = new Queue();
    this.queueOut = new Queue();
    this.texture = textureLoader.load("/resources/textures/space_floor.jpg");

    this.quaternion = new Quaternion();
    this.quaternion.setFromAxisAngle(new Vector3(1, 0, 0), Math.PI / 2);

    this.terrainPlane = new PlaneGeometry(1, 1);
    this.terrainMaterial = new MeshBasicMaterial({
      map: this.texture,
      side: BackSide,
      blending: CustomBlending,
      blendEquaction: AddEquation,
      blendSrc: OneFactor,
      blendDst: OneFactor
 
    });
  }

  createTerrainPlane = () => {
    for (let i = 0; i < 90; i++) {
      this.thisPlane = new Mesh(this.terrainPlane, this.terrainMaterial);
      this.thisPlane.name = "TerrainPlane";
      this.thisPlane.position.z = -50;
      this.thisPlane.applyQuaternion(this.quaternion);
      this.queueIn.enqueue(this.thisPlane);
    }
  }

  generateTerrain = () => {
    // loop to set up the initial terrain tiles     
    for (let i = 0; i < this.player.position.z + 30; i++) {
      if (!this.queueIn.isEmpty()) {
        // loop : sets the x position of tile
        for (let j = 0; j < 3; j++) {
          this.thisPlane = this.queueIn.dequeue();
          this.thisPlane.position.set(j - 1, 0, i);
          this.scene.add(this.thisPlane);
          this.queueOut.enqueue(this.thisPlane);
        }
      }
    }

    // second queue : will update position for each tile
    this.queueOut.allElements().forEach((element) => {
      if (element.position.z < this.player.position.z - 5) {
        element.position.z += 30;
      }
    }
    );
  }
}

// create player character 
class Player extends Object3D {
  constructor(scene) {
    super();
    this.scene = scene;

    this.speed = 0.8;
    this.lives = 3;

    this.score = 0;
    this.highscore = 0;

    this.castShadow = true;
    this.visible = true;
    this.isJumping = false;

    this.name = "Player";
    this.c = 0;
    this.mixer = null;
  }

  init() {
     
    this.position.set(0, 0, 0);

    // weight pain limit 4 / vert
    this.assetLoader = new FBXModelManager(this, 0.005);

    this.assetLoader.loadModels("/resources/3dModels/try2.fbx");

    this.assetLoader.loadAnimation("/resources/3dModels/animations/run.fbx");
    this.assetLoader.loadAnimation("/resources/3dModels/animations/jump.fbx");

    setInterval(() => {
      this.c--;
    }, 100)
  }

  playAnimation() {
    //console.log(this.isJumping);
    if (this.mixer == null) {
      this.mixer = new AnimationMixer(this.children[0]);
    }

    if (!this.isJumping) {
      const run = this.mixer.clipAction(this.animations[0]);
      this.mixer.stopAllAction();
      run.play();
    }
    else {

      const run = this.mixer.clipAction(this.animations[1]);
      this.mixer.stopAllAction();
      run.play();
    
    }
  }

  addToScene = () => {
    this.scene.add(this);
  }

  jump = () => {
    this.changePos;
    this.downPos;
    playAudio("jump");
    // increase the y position    
    if (this.isJumping == false) {
      this.isJumping = true;
      this.changePos = setInterval(() => {
        if (this.position.y < 2.5) {
          this.position.y += 0.25;
        }
        if (this.position.y >= 2.5) {
          clearInterval(this.changePos);

          this.downPos = setInterval(() => {
            //console.log("IS JUMMMPP" + myPlayer.isJumping);
            if (this.isJumping == true) {

              this.position.y -= 0.25;

              if (this.position.y <= 0.6) {

                this.position.y = 0;
                this.isJumping = false;

                clearInterval(this.downPos);
              }
            }
          }, 30)
        }
      }, 30);

      // decrease the y position
    }  
  }

  update = () => {
    this.score++;
    // increase speed overtime         
    if (this.score < 10000) this.speed += 0.00005;
    this.position.z += this.speed / 5;

    // play and update animations
    this.playAnimation();
    this.mixer.update(this.c);
  }
}

// adds all objects in the array in the scene. 
gameObjects = (scene) => {
  let allObjects = [];

  // add all the objects in the array to the scene 
  allObjects.forEach(element => {
    scene.add(element);
  });

  return allObjects;
}

export { TerrainGen, Coin, createCylinder, gameObjects, createCube, createCone, Player, skyCube, createPlane, allMaterials }