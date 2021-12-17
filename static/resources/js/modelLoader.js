import { Clock, MeshBasicMaterial, Mesh, AnimationMixer, AnimationClip, LoadingManager, Object3D } from "https://unpkg.com/three@0.127.0/build/three.module.js"

import { FBXLoader } from "https://unpkg.com/three@0.127.0/examples/jsm/loaders/FBXLoader.js";

import {gameLoading} from "./main.js"

// variables
let modelLoader, fbxLoader;

// functions 

//definitions
const manager = new LoadingManager();

manager.onStart = (url, itemsLoaded, itemsTotal) => {
  console.log('Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.');
};

manager.onLoad = () => {
  //playerMesh = scene.getObjectByName('Player');
  console.log('3dModel loading complete!');
  gameLoading();
};

manager.onProgress = (url, itemsLoaded, itemsTotal) => {
  console.log('Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.');
};

manager.onError = (url) => {
  console.log('There was an error loading ' + url);
};

fbxLoader = new FBXLoader(manager);

class FBXModelManager{  
  constructor(object , scale){    
    this.scalar = scale;
    this.object = object;
  }

     loadAnimation (path) {
      const anim = new FBXLoader(manager);
      anim.load(`${path}`, (anim) => {
        this.object.animations.push(anim.animations[0]);
      })   
    }

     loadModels (path) {
      // load the model and add it in an array
      fbxLoader.load(`${path}`, (fbx) => {
        fbx.scale.multiplyScalar(this.scalar);      
        this.object.add(fbx);  
      });     
    }   
};

export { FBXModelManager };
