// modify the player input before releasing final vers

// fix when player pauses the spawn enemy

import { init } from "./init.js";

import playerControlls from "./playerInput.js";

import gameLights, { TerrainGen, Player, createCube, gameObjects, skyCube } from "./gameObjects.js";

import { addEnemies, createEnemyPool, Spawner } from "./createEnemy.js";
import { Queue, onCollision } from "./functions.js";

import { addListener } from "./audioManager.js";

import { Clock } from "https://unpkg.com/three@0.127.0/build/three.module.js"

import {ParticleSystem} from "./particles.js"



// declare variables 
let gameScene, gameCamera, gameRenderer, myPlayer, myEvent,
  setGameOver, alertMe, allEnemies, score, playerScore, enemyPool,
  enemy, playerLives, playerHighScore, gameOver, menu, highscore,
  gameRunning, startButton, gameTerrain, clock, gameLoaded, enemySpawner, coinSpawner;

// declare functions
let initializer, animate, animationFrame, gameLoading;

// BOOLS 
gameRunning = false;
gameOver = false;
gameLoaded = false;

// initialize the game and stores camera, scene and renderer
initializer = init();
gameScene = initializer[0];
gameRenderer = initializer[1];
gameCamera = initializer[2];

// CREATE PLAYER
myPlayer = new Player(gameScene);
myPlayer.init();
myPlayer.addToScene();

// HANDLES PLAYER INPUT
playerControlls(myPlayer);

// called when models are loaded. find in modelLoader.js
gameLoading = () => {
  gameLoaded = true;
}

let PS = new ParticleSystem(gameScene);
PS.createPS();


enemySpawner = new Spawner(gameScene, myPlayer, 0);
enemySpawner.createEnemyPool().SpawnEnemy();
coinSpawner = new Spawner(gameScene, myPlayer, 1);
coinSpawner.createEnemyPool().SpawnEnemy();

// ADD OBJECTS TO SCENE
// scene background 
skyCube(gameScene);

const importedGameObjects = gameObjects(gameScene);
const lights = gameLights(gameScene);

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

gameTerrain = new TerrainGen(gameScene, myPlayer);
gameTerrain.createTerrainPlane();

// trigger event when dom is loaded and set the splash screen opacity to 0 and starts the game 
document.addEventListener('DOMContentLoaded', (e) => {

  // remove the splash screen
  document.getElementById("splash").style.opacity = 0;

  (animate = () => {
    // set the framerate
    if (gameLoaded == true) {
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

     
        // set UI player score
        playerScore.innerHTML = "Score :" + myPlayer.score;

        gameCamera.position.z = myPlayer.position.z - 4;
        gameCamera.position.y = myPlayer.position.y + 2;

        // create terrain chunk function in gameObjects
        gameTerrain.generateTerrain();
        //generateTerrain(gameScene, myPlayer, terrainPlanesQueue, terrainPlanesQueueOut);

        // Collision detection on each enemy       
        enemySpawner.pool.allElements().forEach(enemy =>
          onCollision(myPlayer, enemy));

        coinSpawner.update();
        coinSpawner.pool.allElements().forEach(coin => onCollision(myPlayer, coin));

        myPlayer.update();

        gameRenderer.render(gameScene, gameCamera);
      }
    }
    setTimeout(() => {
      animationFrame = requestAnimationFrame(animate);
    }
      , 1000 / 60); // frame limit 
  })(); 
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


export { animationFrame, setGameRunning, gameLoading };
