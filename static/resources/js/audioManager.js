import { AudioListener, AudioLoader, Audio } from "https://unpkg.com/three@0.133.1/build/three.module.js"

//functions
let addListener, playAudio, allSounds;

//sounds
let crash, death, jump, gameMusic, collection;

const AUDIOLOADER = new AudioLoader();

const listener = new AudioListener();

crash = new Audio(listener);
death = new Audio(listener);
jump = new Audio(listener);
gameMusic = new Audio(listener);
collection = new Audio(listener);

addListener = (camera) => {
  camera.add(listener);
}

// game music 
AUDIOLOADER.load("resources/audio/aud.wav", (buffer) => {
  gameMusic.setBuffer(buffer);
  gameMusic.setLoop(false);
  gameMusic.setVolume(0.5);
},

  // out when audio loaded 
  (xhr) => {
    console.log((xhr.loaded / xhr.total * 100) + "% loaded");
  },

  // catch error if audio load failed
  (err) => {
    console.log("error happened");
  }
);

// when crashing into enemy 
AUDIOLOADER.load("resources/audio/aud.wav", (buffer) => {
  crash.setBuffer(buffer);
  crash.setLoop(false);
  crash.setVolume(0.5);
},

  // out when audio loaded 
  (xhr) => {
    console.log((xhr.loaded / xhr.total * 100) + "% loaded");
  },

  // catch error if audio load failed
  (err) => {
    console.log("error happened");
  }
);

// jump audio 
AUDIOLOADER.load("resources/audio/aud.wav", (buffer) => {
  jump.setBuffer(buffer);
  jump.setLoop(false);
  jump.setVolume(0.5);
},

  // out when audio loaded 
  (xhr) => {
    console.log((xhr.loaded / xhr.total * 100) + "% loaded");
  },

  // catch error if audio load failed
  (err) => {
    console.log("error happened");
  }
);

// collection audio 
AUDIOLOADER.load("resources/audio/aud.wav", (buffer) => {
  collection.setBuffer(buffer);
  collection.setLoop(false);
  collection.setVolume(0.5);
},

  // out when audio loaded 
  (xhr) => {
    console.log((xhr.loaded / xhr.total * 100) + "% loaded");
  },

  // catch error if audio load failed
  (err) => {
    console.log("error happened");
  }
);

playAudio = (value) => {
  let sounds = [crash, death, jump];

  if (sounds[value].isPlaying) {
    sounds[value].stop();
    sounds[value].play();
  }
  else sounds[value].play();
}

export { addListener, playAudio };
