import * as THREE from "https://unpkg.com/three@0.127.0/build/three.module.js";

import {GLTFLoader} from "https://unpkg.com/three@0.127.0/examples/jsm/loaders/GLTFLoader.js";
import {OrbitControls} from 'https://cdn.jsdelivr.net/npm/three@0.127/examples/jsm/controls/OrbitControls.js';

// value shader
const VS = `
uniform float pointMultiplier;

attribute float size;
attribute float angle;
attribute vec4 colour;

varying vec4 vColour;
varying vec2 vAngle;

void main() {
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);

  gl_Position = projectionMatrix * mvPosition;
  gl_PointSize = size * pointMultiplier / gl_Position.w;

  vAngle = vec2(cos(angle), sin(angle));
  vColour = colour;
}`;

// fragment shader 
const FS = `

uniform sampler2D diffuseTexture;

varying vec4 vColour;
varying vec2 vAngle;

void main() {
  vec2 coords = (gl_PointCoord - 0.5) * mat2(vAngle.x, vAngle.y, -vAngle.y, vAngle.x) + 0.5;
  gl_FragColor = texture2D(diffuseTexture, coords) * vColour;
}`;


// fades or changes particle color 
class LinearSpline {
  constructor(lerp) {
    this.points = [];
    this.lerp = lerp;
  }

  AddPoint(t, d) {
    this.points.push([t, d]);
  }

  Get(t) {
    let p1 = 0;

    for (let i = 0; i < this.points.length; i++) {
      if (this.points[i][0] >= t) {
        break;
      }
      p1 = i;
    }

    const p2 = Math.min(this.points.length - 1, p1 + 1);

    if (p1 == p2) {
      return this.points[p1][1];
    }

    return this.lerp(
        (t - this.points[p1][0]) / (
            this.points[p2][0] - this.points[p1][0]),
        this.points[p1][1], this.points[p2][1]);
  }
}

class ParticleSystem {
  constructor(params, camera) {
    const uniforms = {
        diffuseTexture: {
            value: new THREE.TextureLoader().load('./resources/textures/fire.png')
        },
        pointMultiplier: {
            value: window.innerHeight / (2.0 * Math.tan(0.5 * 60.0 * Math.PI / 180.0))
        }
    };

    // shader material
    this.material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: VS,
        fragmentShader: FS,
        blending: THREE.AdditiveBlending,
        depthTest: true,
        depthWrite: false,
        transparent: true,
        vertexColors: true
    });

    this.camera = camera;
    this.particles = [];

    this.geometry = new THREE.BufferGeometry();
    this.geometry.setAttribute('position', new THREE.Float32BufferAttribute([], 3));
    this.geometry.setAttribute('size', new THREE.Float32BufferAttribute([], 1));
    this.geometry.setAttribute('colour', new THREE.Float32BufferAttribute([], 4));
    this.geometry.setAttribute('angle', new THREE.Float32BufferAttribute([], 1));

    this.points = new THREE.Points(this.geometry, this.material);

    params.add(this.points);

    this.alphaSpline = new LinearSpline((t, a, b) => {
      return a + t * (b - a);
    });
    this.alphaSpline.AddPoint(0.0, 0.0);
    this.alphaSpline.AddPoint(0.1, 1.0);
    this.alphaSpline.AddPoint(0.6, 1.0);
    this.alphaSpline.AddPoint(1.0, 0.0);

    this.colourSpline = new LinearSpline((t, a, b) => {
      const c = a.clone();
      return c.lerp(b, t);
    });

    this.colourSpline.AddPoint(0.0, new THREE.Color(0xFFFF80));
    this.colourSpline.AddPoint(1.0, new THREE.Color(0xFF8080));

    // animate the size of the particle
    this.sizeSpline = new LinearSpline((t, a, b) => {
      return a + t * (b - a);
    });
    this.sizeSpline.AddPoint(0.0, 1.0);
    this.sizeSpline.AddPoint(0.5, 5.0);
    this.sizeSpline.AddPoint(1.0, 1.0);
  
    this.UpdateGeometry();
  }

  AddParticles(timeElapsed) {
    if (!this.time) {
      this.time = 0.0;
    }
    this.time += timeElapsed;
    const n = Math.floor(this.time * 75.0);
    this.time -= n / 75.0;


    // particle randomizer 
      for (let i = 0; i < n; i++) {
          // particle lifetime
      const life = (Math.random() * 0.75 + 0.25) * 10.0;
      this.particles.push({
          position: new THREE.Vector3(
              (Math.random() * 2 - 1) * 1.0,
              (Math.random() * 2 - 1) * 1.0,
              (Math.random() * 2 - 1) * 1.0),
          size: (Math.random() * 0.5 + 0.5) * 4.0,
          colour: new THREE.Color(),
          alpha: 1.0,
          life: life,
          maxLife: life,
          rotation: Math.random() * 2.0 * Math.PI,
          velocity: new THREE.Vector3(0, -15, 0),
      });
    }
  }


  UpdateGeometry() {
    const positions = [];
    const sizes = [];
    const colours = [];
    const angles = [];

    for (let p of this.particles) {
      positions.push(p.position.x, p.position.y, p.position.z);
      colours.push(p.colour.r, p.colour.g, p.colour.b, p.alpha);
      sizes.push(p.currentSize);
      angles.push(p.rotation);
    }

    // passes values into shader
    this.geometry.setAttribute(
        'position', new THREE.Float32BufferAttribute(positions, 3));
    this.geometry.setAttribute(
        'size', new THREE.Float32BufferAttribute(sizes, 1));
    this.geometry.setAttribute(
        'colour', new THREE.Float32BufferAttribute(colours, 4));
    this.geometry.setAttribute(
        'angle', new THREE.Float32BufferAttribute(angles, 1));
  
    this.geometry.attributes.position.needsUpdate = true;
    this.geometry.attributes.size.needsUpdate = true;
    this.geometry.attributes.colour.needsUpdate = true;
    this.geometry.attributes.angle.needsUpdate = true;
  }

   
  UpdateParticles(timeElapsed) {
    for (let p of this.particles) {
      p.life -= timeElapsed;
    }

    this.particles = this.particles.filter(p => {
      return p.life > 0.0;
    });

    for (let p of this.particles) {
      const t = 1.0 - p.life / p.maxLife;

      p.rotation += timeElapsed * 0.5;
      p.alpha = this.alphaSpline.Get(t);
      p.currentSize = p.size * this.sizeSpline.Get(t);
      p.colour.copy(this.colourSpline.Get(t));

      p.position.add(p.velocity.clone().multiplyScalar(timeElapsed));

      // update position of particle 
      // drag slows particle down
      const drag = p.velocity.clone();
      drag.multiplyScalar(timeElapsed * 0.1);
      drag.x = Math.sign(p.velocity.x) * Math.min(Math.abs(drag.x), Math.abs(p.velocity.x));
      drag.y = Math.sign(p.velocity.y) * Math.min(Math.abs(drag.y), Math.abs(p.velocity.y));
      drag.z = Math.sign(p.velocity.z) * Math.min(Math.abs(drag.z), Math.abs(p.velocity.z));
      p.velocity.sub(drag);
    }

     // sort particle from further to the camera to the nearest 
    this.particles.sort((a, b) => {
      const d1 = this.camera.position.distanceTo(a.position);
      const d2 = this.camera.position.distanceTo(b.position);

      if (d1 > d2) {
        return -1;
      }

      if (d1 < d2) {
        return 1;
      }

      return 0;
    });
  }


  Step(timeElapsed) {
    this.AddParticles(timeElapsed);
    this.UpdateParticles(timeElapsed);
    this.UpdateGeometry();
  }
}

export {ParticleSystem }