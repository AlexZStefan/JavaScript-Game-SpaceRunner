import { createCube , createCylinder} from "./gameObjects.js"
import { Group, Vector3, Object3D } from "https://unpkg.com/three@0.133.1/build/three.module.js";

import Queue, { getDistance } from "./functions.js"

let addEnemies, instantiateEnemies, createEnemyPool, enemySpawner, allEnemies;

// create enemy at player position
// depends on addEnemies input
// function will be deleted 
export default instantiateEnemies = (player, array) => {
  let enemy = createCube(1, 1, 1, 0xfe1100);
  console.log(enemy)
  array.push(enemy);
}

// function will be deleted 
addEnemies = (player, scene) => {
  allEnemies = [];
  //instantiateEnemies(player, allEnemies);
  allEnemies.forEach(element => {
    scene.add(element);
  });
  return allEnemies;
}

// Enemy Queue Pool - however can be used for collectables
createEnemyPool = (type) => {
  let pool = new Queue();
  if (pool.getLength() < 29) {
    for (let i = 0; i < 30; i++) {
      switch(type){
        case 0:
         let enemy = createCube(1, 1, 1, 0x190100);
          enemy.position.set(5, 0, -5);
          enemy.name = "Enemy";
      pool.enqueue(enemy);
         break;
      case 1:
        let coin = createCylinder(0.5,0.5,0.2,9,1);
        coin.name = "Coin";
        pool.enqueue(coin);
        break;
      }
     
      // set position so that it does not colide with player when instantiated
      
    }  
  }
  return pool;
}

// Enemy spawner 
// easyMode till player.position z < 100; 
// more enemies spawned after player.z > 100;   
enemySpawner = (pool, player, scene) => {

  let spawn = true;
  let newEnemy, nextElement, firstEnemy;

  if (player.position.z < 100) {

    if (spawn) {
      // pool is defined in "main.js" 
      if (!pool.isEmpty()) {

        // set the positions of next enemy X,Y,Z
        let xPos = player.position.x;
        let randomX = (Math.floor(Math.random() * 3) - 1) * xPos;

        firstEnemy = pool.peek();

        firstEnemy.position.set(randomX, 0.5, player.position.z + 10 + Math.floor(Math.random() * 3));

        if (player.position.z < 20) {
          firstEnemy.position.set(randomX, 0.5, player.position.z + 20 + Math.floor(Math.random() * 3));
        }

        newEnemy = pool.dequeue();

        nextElement = pool.peek();
        nextElement.position.set(xPos, 0.5, player.position.z + 15);

        // ensure enemies do no overlap 
        if (firstEnemy.position.x == nextElement.position.x) {
          newEnemy.position.z += 1;
          newEnemy.x = randomX;
        }

        /*
          // set position of next enemy   
        if( getDistance(newEnemy, nextElement) <=1){
          nextElement.position.set((Math.floor(Math.random() * 2)-1),0.5,
          newEnemy.position.z+1+ Math.floor(Math.random() * 3));
        }
       */
        newEnemy.visible = true;

        scene.add(newEnemy);

        // enque the enemy back in the queue and sets it`s visiblity to false so it is not rendererd, after 10s.`
        setTimeout(() => {
          newEnemy.visible = false;
          pool.enqueue(newEnemy);
          spawn = true;
        }, 10000);

        spawn = false;
      }
    }

    // recusrivly call the function again
    // LOWER CALL BACK WILL INCREASE DIFFICULTY !!!!
    setTimeout(() => {
      enemySpawner(pool, player, scene);
    }, 750);
    return newEnemy;
  }

  if (player.position.z > 100) {

    if (spawn) {
      // can be improved
      if (!pool.isEmpty()) {

        let xPos = player.position.x;
        let randomX = (Math.floor(Math.random() * 3) - 1) * xPos;
        // deques enemy 
        firstEnemy = pool.peek();

        firstEnemy.position.set(randomX, 0.5, player.position.z + 10 + Math.floor(Math.random() * 3));

        if (player.position.z < 20) {
          firstEnemy.position.set(randomX, 0.5, player.position.z + 20 + Math.floor(Math.random() * 3));
        }

        newEnemy = pool.dequeue();

        nextElement = pool.peek();
        nextElement.position.set(xPos, 0.5, player.position.z + 15);

        // ensure enemies do no overlap 
        if (firstEnemy.position.x == nextElement.position.x) {
          newEnemy.position.z -= 1;
          newEnemy.x = randomX;
        }
       
        newEnemy.visible = true;

        scene.add(newEnemy);

        // enque the enemy back in the queue and sets it`s visiblity to false so it is not rendererd, after 10s.`
        setTimeout(() => {
          newEnemy.visible = false;
          pool.enqueue(newEnemy);
          spawn = true;
        }, 10000);

        spawn = false;
      }
    }
    // recusrivly call the function again
    // LOWER CALL BACK WILL INCREASE DIFFICULTY !!!!
    setTimeout(() => {
      enemySpawner(pool, player, scene);
    }, 500);
    return newEnemy;
  }
}

export { addEnemies, enemySpawner, createEnemyPool };