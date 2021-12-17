import { createCube, Coin, createCylinder } from "./gameObjects.js"
import { Group, Vector3, Object3D, InstancedMesh, MeshBasicMaterial } from "https://unpkg.com/three@0.127.0/build/three.module.js"

import Queue, { getDistance } from "./functions.js"

let addEnemies, instantiateEnemies, createEnemyPool, enemySpawner, allEnemies;

// create enemy at player position
// depends on addEnemies input
// function will be deleted 
export default instantiateEnemies = (player, array) => {
  let enemy = createCube(1, 1, 1, 0xfe1100);
  array.push(enemy);
}

let coinInstance = new Coin(0, 0, -50).loadTexture("./resources/textures/coin.png").createCylinder(0.5, 0.5, 0.1, 9, 1);

class Spawner {
  constructor(scene, player, type) {
    this.player = player;
    this.scene = scene;
    this.type = type;
    this.pool = new Queue();
  }

  // Enemy Queue Pool - however can be used for collectables
  createEnemyPool() {    
    if (this.pool.getLength() < 29) {
      for (let i = 0; i < 30; i++) {
        switch (this.type) {
          case 0:
            let enemy = createCube(1, 1, 1, 0x190100);
            enemy.position.set(5, 0, -5);
            enemy.name = "Enemy";
            this.pool.enqueue(enemy);
            break;
          case 1:
            this.pool.name = "CoinSpawner";
            let coin = new Coin();
   
            coin.position.set(0,0,0);
            coin.loadTexture("./resources/textures/coin.png");
            coin.createCylinder(0.5, 0.5, 0.1, 9, 1);

            coin.name = "Coin";
            
            this.pool.enqueue(coin);
            break;
        }
      }
    }
    return this;
  }

  update(){
    if(this.pool.name === "CoinSpawner"){
      this.pool.allElements().forEach((element) => {
        if(element.visible == true)
        element.update();
      })
    }
  }

  SpawnEnemy = () => {
    let spawn = true;
    let firstEnemy;

      if (spawn) {
        // pool is defined in "main.js" 
        if (!this.pool.isEmpty()) {
          if(this.pool.allElements().forEach((element) =>{
            if(element.parent != this.scene) 
            {
              element.position.z = -50;
              this.scene.add(element);
            }
          }));
      
          let xPos =  this.player.position.x;
          let randomX = (Math.floor(Math.random() * 3) - 1) * xPos;

          firstEnemy = this.pool.dequeue(); 
          firstEnemy.position.set(randomX, 0.5,  this.player.position.z + 15 + Math.floor(Math.random() * 3));    
          firstEnemy.visible = true;      
          this.pool.enqueue(firstEnemy);    
          
          setTimeout(()=>{
            if(firstEnemy.position.z < this.player.position.z)
            {             
              firstEnemy.visible = false;
            }           
          },5000);             
        }
      }
      // recusrivly call the function again
      // LOWER CALL BACK WILL INCREASE DIFFICULTY !!!!
      setTimeout(() => {
        this.SpawnEnemy();
      }, 750);      
  }
}


export { addEnemies, enemySpawner, createEnemyPool, Spawner };