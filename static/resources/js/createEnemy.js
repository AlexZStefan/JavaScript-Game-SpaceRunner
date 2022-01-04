import { createCube, Coin, Object3D } from "./gameObjects.js"
import Queue from "./functions.js"

let addEnemies,  createEnemyPool, enemySpawner;

class Spawner {
  constructor(scene, player, type) {
    this.player = player;
    this.scene = scene;
    this.type = type;
    this.pool = new Queue();
    this.cloneEnemy = createCube(1, 1, 1, 0x190100);

  }

  // Enemy Queue Pool - also reused for collectables
  createEnemyPool() {    
    if (this.pool.getLength() < 29) {
      for (let i = 0; i < 30; i++) {
        switch (this.type) {
          // enemy pool
          case 0:
            let enemy = this.cloneEnemy.clone();
            enemy.userData = this.cloneEnemy.userData;
            enemy.position.set(5, 0, -5);
            enemy.name = "Enemy";
            this.pool.enqueue(enemy);
            break;
          // coin pool
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
        // add elements to the scene at -50 position so it is not shown on the player screen
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
          
          // set element to random position, ahead of the player
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