import { MeshBasicMaterial, Mesh, LoadingManager} from "https://unpkg.com/three@0.127.0/build/three.module.js"

import {GLTFLoader} from "https://unpkg.com/three@0.127.0/examples/jsm/loaders/GLTFLoader.js";


// variables
let  modelLoader;

// functions 

//definitions
const manager = new LoadingManager();

manager.onStart = (url, itemsLoaded, itemsTotal) => {
  console.log('Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.');
};

manager.onLoad = () => {
  //playerMesh = scene.getObjectByName('Player');
  console.log('3dModel loading complete!'); 
};

manager.onProgress = (url, itemsLoaded, itemsTotal) => {
  console.log('Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.');
};

manager.onError = (url) => {
  console.log('There was an error loading ' + url);
};

modelLoader =  new GLTFLoader(manager);

  class ModelManager {
  constructor(object, scaleX, scaleY,scaleZ ){   
    this.object= object;
    this.scaleX = scaleX;
    this.scaleY = scaleY;
    this.scaleZ = scaleZ;
    this.model;
  };

  loadModels = (path, name) => {
    // load the model and add it in an array
    modelLoader.load(`${path}`, (glb) => {
          
      this.model = glb.scene; 
      this.model.scale.set(this.scaleX,this.scaleY, this.scaleZ);
   
      this.model.name = `${name}`;    

      this.object.attach(glb.scene);
    });    
    return this; 
  };

};

// let loadThis = (scene)=>{
//     modelLoader.load("/resources/3dModels/wraith.glb", (glb)=>{
//         let model = glb.scene;
//          model.scale.set(0.05,0.05,0.05);
//          model.position.set(0,0,15);
//        // model.material = new MeshBasicMaterial({ color: 0xffff00 });
//         console.log(glb + "ASDASDSA DAS");
//         scene.add(model);
//     })
// }

export {  ModelManager};
