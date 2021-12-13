node.js & express:

__dirDoc{
	app.js,
	index.js,
	static(folder)\
	{
		game.html,
		index.html,
		signUp.html,

		resources(folder)\
			{
			audio(sounds),
			js(scripts),
			textures(img)
			}
	}	
}


GLTFLoader v127 - was used as there was a problem on node cloud which gave an error of "Failed to resolve module specifier "three". 

Because of the above THREE js v133 also caused a problem and had to downgrade to Three v127 as the following error occured 
:"THREE.js TypeError: material.onBeforeRender is not a function"


Library THREE.js v127 - module - imported in game.html 