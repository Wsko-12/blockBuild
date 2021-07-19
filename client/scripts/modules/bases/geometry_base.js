import * as THREE from '../../../ThreeJsLib/build/three.module.js';
import {MAIN} from '../../main.js';
import {MESHES_BASE} from './meshes_base.js';


function gameBlock(){
  const self = {};
  return self;
}

function init(){
  GEOMETRY_BASE.cactus = new THREE.BoxGeometry(1,1,1);
  console.log(GEOMETRY_BASE);








};



const GEOMETRY_BASE = {
  init,
};






export {GEOMETRY_BASE};
