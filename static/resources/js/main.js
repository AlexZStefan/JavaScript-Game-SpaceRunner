// modify the player input before releasing final vers

// fix when player pauses the spawn enemy

import { init } from "./init.js";
/*{animationBool}*/
import playerControlls, { renderFrame } from "./playerInput.js";

import gameLights, { Player, createCube, gameObjects, skyCube, createTerrainPlane, generateTerrain } from "./gameObjects.js";

import { addEnemies, enemySpawner, createEnemyPool } from "./createEnemy.js";
import { Queue, /*generateTerrain*/ onCollision } from "./functions.js";
import { Group } from "https://unpkg.com/three@0.133.1/build/three.module.js";

import { addListener } from "./audioManager.js";

//import signIn from "./logging.js";

// declare variables 
let gameScene, gameCamera, gameRenderer, myPlayer, myEvent,
  setGameOver, alertMe, allEnemies, score, playerScore, enemyPool,
  enemy, playerLives, playerHighScore, gameOver, menu, highscore,
  gameRunning, startButton, worldMap;

// declare functions
let initializer, animate, animationFrame;

// BOOLS 
gameRunning = false;
gameOver = false;

// initialize the game and stores camera, scene and renderer
initializer = init();
gameScene = initializer[0];
gameRenderer = initializer[1];
gameCamera = initializer[2];

let terrainQueue = new Queue();

// CREATE PLAYER
myPlayer = Player(1, 1, 1, 0x002600);
myPlayer.score = 0;
myPlayer.highscore = 0;
// HANDLES PLAYER INPUT
playerControlls(myPlayer);

// Enemy instatiation 
enemyPool = createEnemyPool(0);
// used on collision
let enemiesTest = enemyPool.allElements();
// ENEMY SPAWNER - calles recursevly  
enemy = enemySpawner(enemyPool, myPlayer, gameScene, gameRunning);

// Collectable instantiation
let coins = createEnemyPool(1);
let coinPool = coins.allElements();
let coin = enemySpawner(coins, myPlayer, gameScene);

let cube1 = createCube(1, 1, 1, 0xfe1100);
let cube2 = createCube(1, 1, 1, 0xfe1100);
cube1.position.set(2, 1, 5);
cube2.position.set(-2, 1, 5);
gameScene.add(cube1);
gameScene.add(cube2);

// ADD OBJECTS TO SCENE
// scene background 
skyCube(gameScene);

const importedGameObjects = gameObjects(gameScene);
const lights = gameLights(gameScene);

gameScene.add(myPlayer);

let test = addEnemies(gameScene, gameCamera);

addListener(gameScene);

// set the game to pause or unpaused
let setGameRunning = () => {

  if (gameRunning == true) gameRunning = false;
  else gameRunning = true;
  if (!gameOver) {

    setTimeout(() => {
      startButton.innerHTML = "Resume";
    }, 500);
  }
  
}

// Terrain generation 
let terrainPlanesQueue = new Queue();
let terrainPlanesQueueOut = new Queue();
createTerrainPlane(gameScene, myPlayer, terrainPlanesQueue);



// trigger event when dom is loaded and set the splash screen opacity to 0 and starts the game 
document.addEventListener('DOMContentLoaded', (e) => {

  // remove the splash screen
  document.getElementById("splash").style.opacity = 0;

  (animate = () => {
    // set the framerate
    setTimeout(() => {
      // SHOW MENU IF PAUSED
      if (!gameRunning && !gameOver) {
        if (myPlayer.lives <= 0) {
          gameOver = true;
        }
        menu.style.opacity = 1;
      }
      // Once player lost all lives - trigger GameOver Event.
      if (!gameRunning && gameOver) {
        menu.children[0].innerHTML = "GameOver";
        document.dispatchEvent(setGameOver);
      }

      // stops the renderer if gameRunning = false
      // MAIN LOOP STARTS HERE 
      if (gameRunning) {
        // hide the menu 
        menu.style.opacity = 0;

        // set the player score 

        //myPlayer.score++;



        // set UI player score
        playerScore.innerHTML = "Score :" + myPlayer.score;

        // increase speed overtime 
        if (myPlayer.score < 1200) myPlayer.speed += 0.001;
        console.log("myPlayer" + myPlayer.speed);

        // pushes player forward 
        myPlayer.position.z += myPlayer.speed / 5;

        //gravity

        // set camera position so that it matches the player 

        gameCamera.position.z = myPlayer.position.z - 4;
        gameCamera.position.y = myPlayer.position.y + 2;

        // create terrain chunk function in gameObjects
        generateTerrain(gameScene, myPlayer, terrainPlanesQueue, terrainPlanesQueueOut);

        cube2.rotateX(5);
        cube1.rotateX(-5);

        // Collision detection on each enemy
        enemiesTest.forEach(enemy =>
          // dificulty can be increased in the CreateEnemy callbackF
          onCollision(myPlayer, enemy));

        coinPool.forEach(coin => onCollision(myPlayer, coin));


        gameRenderer.render(gameScene, gameCamera);
      }

      animationFrame = requestAnimationFrame(animate);
    }
      , 1000 / 60); // frame limit 

    console.log(myPlayer.position.z);
  })(); // animate func 

  // renders the game after everything was loaded 
});

// EVENTS
setGameOver = new Event('gameOver');
document.addEventListener('gameOver', alertMe = () => {
  startButton.innerHTML = "Restart";
  location.reload();
});

// HTML DOC
menu = document.getElementById("Menu");
playerScore = document.getElementById("score");
playerHighScore = document.getElementById("highscore");
playerLives = document.getElementById("playerLives");

// Set UI stats
playerLives.innerHTML = "Lives :" + myPlayer.lives;
playerScore.innerHTML = "Score :" + myPlayer.score;
playerHighScore.innerHTML = "Highscore :" + highscore;

startButton = document.getElementById("start");
startButton.addEventListener("click", setGameRunning);


export { animationFrame, setGameRunning };
