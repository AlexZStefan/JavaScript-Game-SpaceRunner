import { DirectionalLight, DirectionalLightHelper, AmbientLight, BoxGeometry, ConeGeometry, CylinderGeometry, PlaneGeometry,/* side of geometry*/ DoubleSide, BackSide, FrontSide, Mesh, MeshBasicMaterial, MeshStandardMaterial, MeshPhongMaterial, Group, Quaternion, Vector3, Euler, Object3D, TextureLoader, UVMapping, RepeatWrapping, AdditiveBlending, CustomBlending, AddEquation, OneFactor, ZeroFactor, SubtractEquation } from "https://unpkg.com/three@0.133.1/build/three.module.js"

import { Queue } from "./functions.js"

// variables
let Player, skyCube, allMaterials, gameLights, loader, createCube, createCone, createPlane, gameObjects, terrainQueue;

//functions
let jump, createCylinder;

// create the game background 
loader = new TextureLoader();

skyCube = (scene) => {
  loader.load("./resources/textures/skyArt.jpg", (texture) => {
    scene.background = texture;
  })
}

// not used yet
allMaterials = {
  basicYellow: new MeshBasicMaterial({ color: 0xffff00, side: DoubleSide }),
  phongMat: new MeshPhongMaterial(),
  basicCoin: new MeshBasicMaterial(0xffffff)  
}

//create allLights
export default gameLights = (scene) => {
  let allLights = [];
  let dirLight = new DirectionalLight(0xfadede, 50);
  dirLight.position.y = 5;
  dirLight.castShadow = true;
  allLights.push(dirLight);
  allLights.forEach(element => scene.add(element));
};

createCube = (widthX, heightY, depthZ, cubeColor) => {
  let cube = new Object3D();

  const geometry = new BoxGeometry(widthX, heightY, depthZ);

  // green 0x00ff00
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
  cylinder.applyQuaternion(quaternion);
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

const textureLoader = new TextureLoader();

let tTexture = textureLoader.load("/resources/textures/space_floor.jpg");

// terrain generation starts from here
const terrainPlane = new PlaneGeometry(1, 1);
const terrainMaterial = new MeshBasicMaterial({
  map: tTexture,
  side: BackSide,
  blending: CustomBlending,
  blendEquaction: AddEquation,
  blendSrc: OneFactor,
  blendDst: OneFactor
});

const quaternion = new Quaternion();
quaternion.setFromAxisAngle(new Vector3(1, 0, 0), Math.PI / 2);
let newChunk = false;

let createTerrainPlane = (scene, player, queue) => {
  for (let i = 0; i < 90; i++) {
    let thisPlane = new Mesh(terrainPlane, terrainMaterial);
    thisPlane.name = "TerrainPlane";
    thisPlane.position.z = -50;
    thisPlane.applyQuaternion(quaternion);
    queue.enqueue(thisPlane);
  }
}

let generateTerrain = (scene, player, queueIn, queueOut) => {
  // loop to set up the initial terrain tiles     
  for (let i = 0; i < player.position.z + 30; i++) {
    if (!queueIn.isEmpty()) {
      // loop : sets the x position of tile
      for (let j = 0; j < 3; j++) {
        let thisPlane = queueIn.dequeue();
        thisPlane.position.set(j - 1, 0, i);
        scene.add(thisPlane);
        queueOut.enqueue(thisPlane);
      }
    }
  }

  // second queue : will update position for each tile
  queueOut.allElements().forEach((element) => {
    if (element.position.z < player.position.z - 5) {
      element.position.z += 30;
      console.log("q i " + element.position.z);
    }
  }
  );
}

// create player character 
Player = (widthX, heightY, depthZ, playerColor) => {
  let myPlayer = new Object3D();

  const geometry = new BoxGeometry(widthX, heightY, depthZ);

  // green 0x00ff00
  const material = new MeshPhongMaterial({
    color: playerColor,
    shininess: 40,
    specular: 0x111111,
    emissive: 0x0,
  });

  myPlayer.speed = 0.8;
  myPlayer.lives = 3;
  myPlayer.castShadow = true;
  myPlayer.attach(new Mesh(geometry, material));
  myPlayer.name = "Player";
  myPlayer.visible = true;
  myPlayer.position.y = 0.5;
  myPlayer.isJumping = false;
  myPlayer.score = 0; 
  myPlayer.highscore;

  myPlayer.jump = () => {
    let changePos;
    let downPos;

    // increase the y position    
    if (myPlayer.isJumping == false) {
      changePos = setInterval(() => {
        if (myPlayer.position.y < 2.5) {
          myPlayer.position.y += 0.5;
        }
        if (myPlayer.position.y > 2.4) {
          myPlayer.isJumping = true;
          clearInterval(changePos);
        }
      }, 100);

      // decrease the y position
      downPos = setInterval(() => {
        //console.log("IS JUMMMPP" + myPlayer.isJumping);
        if (myPlayer.isJumping == true) {
          if (myPlayer.position.y > 0.5)
            myPlayer.position.y -= 0.5;

          if (myPlayer.position.y <= 0.6) {

            myPlayer.position.y = 0.5;
            myPlayer.isJumping = false;

            clearInterval(downPos);
          }
        }
      }, 100)
    }
  }
  return myPlayer;
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

export {createCylinder, gameObjects, createCube, createCone, Player, skyCube, createPlane, allMaterials, createTerrainPlane, generateTerrain }