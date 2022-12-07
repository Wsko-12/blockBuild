

import {RENDER} from './modules/render.js';
import {GAME} from './modules/game.js';
import {GAME_INTERFACE} from './modules/interfaceScripts/gameInterface.js';


let MAIN = {
  init,
  render:RENDER,
  game:GAME,
  interface:GAME_INTERFACE,
};
function init(){
  MAIN.interface.init();
  MAIN.render.init();
  MAIN.game.init();
  console.log(MAIN);

};




export {MAIN};
