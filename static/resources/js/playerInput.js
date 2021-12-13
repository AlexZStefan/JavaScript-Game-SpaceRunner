import { animationFrame, setGameRunning } from "./main.js"

let playerControlls, animationCancel, animationBool, renderFrame;

renderFrame = true;

// player controlls 
export default playerControlls = (player) => {
  document.addEventListener('keydown', logKey);

  function logKey(e) {
    // console.log(`key=${event.key},code=${event.code}`);
    //all keys at: https://keycode.info

    switch (e.keyCode) {      
      case 27: // Stop animation function  ESCAPE       
        if (player.lives > 0) {
          setGameRunning();
        }
        break;
      case 13:       // ENTER
        break;
      case 87: //w
        player.position.z += 0.1;
        break;
      case 68: //a
        if (player.position.x > -1) { player.position.x -= 1; };
        
        break;
      case 83: //s
        player.position.z -= 0.1;
        
        break;
      case 65: //d 
        if (player.position.x < 1) { player.position.x += 1; }
        
        break;
      case 32: // space
        // clamp the y player position 
        if (player.position.y >= 0.6) {
          player.position.y -= 0.1;
        }        
        break;
      case 17: // ControlLeft
        player.jump();  
        //console.log(e.keyCode);      
        break;
    }
  }
  //keyCodes ShiftLeft, ControlLeft
  //KeyA, KeyB .... 
}

export { renderFrame };