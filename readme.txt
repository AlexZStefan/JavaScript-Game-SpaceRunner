GLTFLoader v127 - was used as there was a problem on node cloud which gave an error of "Failed to resolve module specifier "three". 

Because of the above THREE js v133 was causing further errors, the entire project was downgraded to Three v127; 
The error occured : "THREE.js TypeError: material.onBeforeRender is not a function".
 
User can use: username - "asd" and password - "asd" to log-in, or can create a new one, once the database is running.

SR4{
	-/database(folder) - contains the database file to use when opening the project. 
	
	-/app.js, - contains Node.js server-side implementation
	-/404.html, - contains the HTML for the 404 page
	-/static(folder)/
	{
		---/game.html, - contains the HTML for the game WebPage
		---/index.html, - contains the HTML for the main WebPage
		---/signUp.html, - contains the HTML for the Sign-up WebPage
		---/aboutUs.html - - contains the HTML for the introduction WebPage

		---/resources(folder)/
			{
			-----/3dModels - - contains the player model and animations
			-----/audio(sounds), - contains all the audio sounds
			-----/js(scripts), - contains all the javascript scripts
				-------/audioManager.js - contains all audio implementation
				-------/createEnemy.js - contains the pooling system - game object spawner 
				-------/functions.js - contains the collision and Queue class
				-------/gameObjects.js - contains the lighting, terrain, coin and player class 
 				-------/init.js - contains the gameScreen class that is responsible for loading, game screen and renderer responsivness to different sizes.
				-------/main.js - contains the game loop implementation and handles the renderer and most of the game events 
				-------/modelLoader.js - contains FBX model loader - used for loading the 3D meshes
				-------/particles.js - contains the particle system
				-------/playerInput.js - handles the user input
			-----/textures(img) - contains all the environment / game objects textures 
			}
	}	
}

