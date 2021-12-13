import {
  DirectionalLight, DirectionalLightHelper, AmbientLight, BoxGeometry, ConeGeometry,
  CylinderGeometry, PlaneGeometry,/* side of geometry*/ DoubleSide, BackSide, FrontSide, Mesh,
  MeshBasicMaterial, MeshStandardMaterial, MeshPhongMaterial, Group, Quaternion, Vector3,
  Euler, Object3D, TextureLoader, UVMapping, RepeatWrapping, AdditiveBlending, CustomBlending,
  AddEquation, OneFactor, ZeroFactor, SubtractEquation
}
  from "https://unpkg.com/three@0.133.1/build/three.module.js"

import { Queue } from "./functions.js"

import { ModelManager } from "./modelLoader.js"

// functions
let skyCube, allMaterials, gameLights, createCube, createCone, createPlane,
  gameObjects, createCylinder;

//variables

// create the game background 
const textureLoader = new TextureLoader();

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


    this.createTerrainPlane = () => {

      for (let i = 0; i < 90; i++) {
        this.thisPlane = new Mesh( this.terrainPlane,  this.terrainMaterial);
        this.thisPlane.name = "TerrainPlane";
        this.thisPlane.position.z = -50;
        this.thisPlane.applyQuaternion(this.quaternion);
        this.queueIn.enqueue(this.thisPlane);
      }
    }

    this.generateTerrain = () => {
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
        if (element.position.z < player.position.z - 5) {
          element.position.z += 30;
        }
      }
      );
    }
  }
}

// create player character 
class Player {
  constructor(scene) {
    this.scene = scene;

    this.myPlayer = new Object3D();
    this.myPlayer.visible = true;
    
    this.playerModel = new ModelManager(this.myPlayer, 0.01, 0.01, 0.01);
    this.playerModel.loadModels("/resources/3dModels/wraith.glb", "Player");
    this.playerModel = null;


    this.speed = 0.8;
    this.lives = 3;
    this.position = { x: 0, y: 0.5, z: 0 };
    this.score = 0;
    this.highscore = 0;

    this.castShadow = true;
    this.visible = true;
    this.isJumping = false;

    this.name = "Player";

    this.addToScene = () => {
      this.scene.add(this.myPlayer);
    }

    this.moveForward = () => {
      this.position.z += this.speed / 5;
      this.myPlayer.position.x = this.position.x;
      this.myPlayer.position.y = this.position.y;
      this.myPlayer.position.z = this.position.z;
    }

    this.jump = () => {
      this.changePos;
      this.downPos;

      // increase the y position    
      if (this.isJumping == false) {
        this.changePos = setInterval(() => {
          if (this.position.y < 2.5) {
            this.position.y += 0.5;
          }
          if (this.position.y > 2.4) {
            this.isJumping = true;
            clearInterval(this.changePos);
          }
        }, 100);

        // decrease the y position
        this.downPos = setInterval(() => {
          //console.log("IS JUMMMPP" + myPlayer.isJumping);
          if (this.isJumping == true) {
            if (this.position.y > 0.5)
              this.position.y -= 0.5;

            if (this.position.y <= 0.6) {

              this.position.y = 0.5;
              this.isJumping = false;

              clearInterval(this.downPos);
            }
          }
        }, 100)
      }
    }
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

export { TerrainGen, createCylinder, gameObjects, createCube, createCone, Player, skyCube, createPlane, allMaterials }