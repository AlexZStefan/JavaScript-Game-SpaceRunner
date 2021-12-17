import * as THREE from "https://unpkg.com/three@0.127.0/build/three.module.js";

import {GLTFLoader} from "https://unpkg.com/three@0.127.0/examples/jsm/loaders/GLTFLoader.js";

// https://aerotwist.com/tutorials/creating-particles-with-three-js/
//https://github.com/mrdoob/three.js/blob/master/examples/webgl_points_sprites.html

let loader = new THREE.TextureLoader();

class ParticleSystem{
    constructor(scene) {
    this.scene = scene;
    this.texture = loader.load("/resources/textures/coin.png");
    this.particleCount = 10;
    this.particles = new THREE.BufferGeometry();
    this.pMaterial = new THREE.PointsMaterial({
      color: 0x554419,
      size: 20,
      map:  this.texture,
      blending: THREE.AdditiveBlending, 
      transparent:true
    });

    this.init();
    }

    init(){
        let positions = [];
        let colors = [];
        let sizes = [];

        const color = new THREE.Color();

        for (var p = 0; p < this.particleCount; p++) {

            // create a particle with random
            // position values, -5 -> 5
              
            
               const x = Math.random() *2 - 5;
               const y = Math.random() *2 - 5;
               const z = Math.random() *2 - 5;      
               
               positions.push(x, y, z);
               console.log(positions[p])
            // add it to the geometry            
          }      
          
          
          this.particles.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    }

    createPS(){
            this.particleSys = new THREE.Points(
            this.particles,
            this.pMaterial);
            this.particleSys.sortParticles = true;
           this.particleSys.position.set(0,0,50)
            this.scene.add(this.particleSys);
    }

}

export {ParticleSystem}