import {MAIN} from '../main.js';
import {TEXTURES_BASE} from './bases/textures_base.js';
import {MESHES_BASE} from './bases/meshes_base.js';
import {BLOCKS_BASE} from './bases/blocks_base.js';
import {WORLD} from './gameScripts/world.js';
import {USER_ACTIONS} from './gameScripts/userActions.js';

const init = function(){
  TEXTURES_BASE.init().then(result => {
    MESHES_BASE.init();
    BLOCKS_BASE.init();

    WORLD.init();
    // WORLD.generateLandscape(Math.random()*10000);

    //плоский
    WORLD.generateLandscape(7470.8241806446085);

    // WORLD.generateLandscape(5552.875163845905);




    // WORLD.generateLandscape(2291.43157993738);
    // WORLD.generateLandscape(5584.588819541116);
    //7173.807933317389 снег

    WORLD.updateWaterGeometry();
    WORLD.map.updateAllInvisibleFaces();
    WORLD.updateAmbientLight();

    USER_ACTIONS.init();
  });
};



const GAME = {
  init,
  world:WORLD,
};

export {GAME};
