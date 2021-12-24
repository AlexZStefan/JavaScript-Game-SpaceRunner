import * as THREE from "https://unpkg.com/three@0.127.0/build/three.module.js";

import { GLTFLoader } from "https://unpkg.com/three@0.127.0/examples/jsm/loaders/GLTFLoader.js";

// https://aerotwist.com/tutorials/creating-particles-with-three-js/
//https://github.com/mrdoob/three.js/blob/master/examples/webgl_points_sprites.html

let loader = new THREE.TextureLoader();

const _VS = `attribute float size;

			varying vec3 vColor;

			void main() {

				vColor = color;

				vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );

				gl_PointSize = size * ( 300.0 / -mvPosition.z );

				gl_Position = projectionMatrix * mvPosition;

			}`

const _FS =
  `
uniform sampler2D pointTexture;

			varying vec3 vColor;

			void main() {

				gl_FragColor = vec4( vColor, 1.0 );

				gl_FragColor = gl_FragColor * texture2D( pointTexture, gl_PointCoord );

			}
`
let c = 0;

setInterval(() => c++, 1000)

class ParticleSystem {
  constructor(scene, player) {
    this.scene = scene;
    this.player = player;
    this.texture = loader.load("/resources/textures/coin.png");
    this.particleCount = 300;
    this.particles = new THREE.BufferGeometry();

    this.init();
    this.sizeUpdate();
  }

  init() {
    this.uniforms = { pointTexture: { value: this.texture } }

    this.shaderMaterial = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: _VS,
      fragmentShader: _FS,

      blending: THREE.AdditiveBlending,
      depthTest: true,
      transparent: true,
      vertexColors: true
    });

    this.positions = [];
    this.colors = [];
    this.sizes = [];

    const color = new THREE.Color();

    for (var p = 0; p < this.particleCount; p++) {

      // create a particle with random position - values, -5 -> 5

      const x = Math.random() *100-50;
      const y = Math.random() *100 - 50;
      const z = Math.random() *50-50;

      this.positions.push(x, y, z);

      color.setHSL(p / this.particleCount, 1.0, 0.8);

      this.colors.push(color.r, color.g, color.b);

      this.sizes.push(1);       
    }

  console.log(this.particles);
    this.particles.setAttribute('position', new THREE.Float32BufferAttribute(this.positions, 3));
   
    this.particles.setAttribute('color', new THREE.Float32BufferAttribute(this.colors, 3));
    this.particles.setAttribute('size', new THREE.Float32BufferAttribute(this.sizes, 1).setUsage(THREE.DynamicDrawUsage));
  }

  createPS(x, y, z) {
    this.particleSys = new THREE.Points(this.particles, this.shaderMaterial);

    this.particleSys.sortParticles = true;
    this.particleSys.position.set(x, y, z);
    this.scene.add(this.particleSys);
  }

  update() {
    let time = Date.now() * 0.5;
    this.particleSys.rotation.z = 0.001 * time;
   // this.particleSys.position.z += 0.05;

    this.particleSys.position.set(0,0, this.player.position.z +60);
    //this.particleSys.rotation.x = 0.001 * time;

    this.sizes = this.particles.attributes.size.array;

    this.particles.attributes.size.needsUpdate = true;
    this.particles.attributes.color.needsUpdate = true;
  }

  sizeUpdate() {

    let time = Date.now() * 0.5;

    setInterval(() => {
      c++;

      for (let i = 0; i < this.particleCount; i+=2) {

        this.sizes[i] =  (1 + Math.sin(0.1 * c + time));
        //this.colors[i].setHSL(i / this.particleCount, 1.0, 1.0);

        i+=1; 
         this.sizes[i] =  (1 - Math.sin(0.1 * c + time));
      }
    }, 10)

  }
}

export { ParticleSystem }
