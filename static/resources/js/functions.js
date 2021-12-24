import { playAudio } from "./audioManager.js"

import { Vector3 } from "https://unpkg.com/three@0.133.1/build/three.module.js"

import { createPlane, allMaterials } from "./gameObjects.js"

import { setGameRunning } from "./main.js"

//variables
let playerLives, playerScore;

// functions
let firstDistance, getDistance, onCollision, gameOver;

playerLives = document.getElementById("playerLives");
playerScore = document.getElementById("score");

// create a Queue function 
export default class Queue {
  constructor() {
    let a = [], b = 0;
    this.getLength = () => { return a.length - b };
    this.isEmpty = () => { return 0 == a.length };
    this.enqueue = (b) => { a.push(b) };
    this.allElements = () => { return a };
    this.dequeue = () => {
      if (0 != a.length) {
        var c = a[b];
        2 * ++b >= a.length && (a = a.slice(b), b = 0);
        return c
      }
    };
    this.peek = () => {
      return 0 < a.length ? a[b] : void 0
    }
  }
};

//collision detection
onCollision = (p1, p2) => {
  if (p2.visible == true && firstDistance(p1, p2) < 1) {
    // calculates the z position of 2 objects 

    // calculate the 3d distance between 2 objects
    let distance = getDistance(p1, p2);

    if (distance < 0.95) {

      // take a life from player on collision
      if (p2.name == "Enemy") {

        if (p1.lives > 0) {
          p1.lives -= 1;
          playAudio("crash");
          document.getElementById("playerLives").innerHTML = "Lives : " + p1.lives;
        }

        //clamp player lives 
        if (p1.lives <= 0) {
          p1.lives = 0;
          setGameRunning();
          playAudio("death");
        }
      }

      if (p2.name == "Coin") {
        p1.score += 100;
        playAudio("collect");
      }

      //p2.children[0].material.color.setHex(0xFFFFFF);
      p2.visible = false;
    }    
  }
};

// first stage of collision detection
firstDistance = (p1, p2) => {
  let zDistance = p2.position.z - p1.position.z;

  return zDistance;
}

// 2nd stage of collision detection
getDistance = (p1, p2) => {

  let xDistance, zDistance, yDistance;
  xDistance = p2.position.x - p1.position.x;
  yDistance = p2.position.y - p1.position.y;
  zDistance = p2.position.z - p1.position.z;

  return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2) + Math.pow(zDistance, 2));
}

gameOver = () => {
  location.reload();
}

export { gameOver, Queue, onCollision, getDistance }
