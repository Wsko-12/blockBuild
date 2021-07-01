

import {RENDER} from './modules/render.js';
import {GAME} from './modules/game.js';


let MAIN = {
  init,
  render:RENDER,
  game:GAME,
};
function init(){
  MAIN.render.init();
  MAIN.game.init();
  console.log(MAIN)
};




export {MAIN};
