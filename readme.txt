GLTFLoader v127 - was used as there was a problem on node cloud which gave an error of "Failed to resolve module specifier "three". 

Because of the above THREE js v133 was causing further errors, the entire project was downgraded to Three v127; 
The error occured : "THREE.js TypeError: material.onBeforeRender is not a function".
 

SR4{
	database(folder) - contains the database file to use when opening the project. 
	User can use username "asd" and password "asd" to log-in.

	app.js, - contains Node.js server-side implementation
	404.html, - contains the HTML for the 404 page
	static(folder)\
	{
		game.html, - contains the HTML for the game WebPage
		index.html, - contains the HTML for the main WebPage
		signUp.html, - contains the HTML for the Sign-up WebPage
		aboutUs.html - - contains the HTML for the introduction WebPage

		resources(folder)\ 
			{
			3dModels - - contains the player model and animations
			audio(sounds), - contains all the audio sounds
			js(scripts), - contains all the javascript scripts
			textures(img) - contains all the environment / game objects textures 
			}
	}	
}

