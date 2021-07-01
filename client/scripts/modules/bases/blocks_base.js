import * as THREE from '../../../ThreeJsLib/build/three.module.js';
import {MAIN} from '../../main.js';
import {MESHES_BASE} from './meshes_base.js';


function gameBlock(){
  const self = {};
  return self;
}

function init(){

};



const BLOCKS_BASE = {
  init,
};
//geometry:
// 0 - полный блок;

//transparent:
// 0 - не прозрачный;







BLOCKS_BASE.test = {
  meshBase:'test',
  geometry:0,
  transparent:0,

};

export {BLOCKS_BASE};
