import * as THREE from '../../../ThreeJsLib/build/three.module.js';
import {MAIN} from '../../main.js';
import {MESHES_BASE} from './meshes_base.js';


function gameBlock(){
  const self = {};
  return self;
}

function init(){
  GEOMETRY_BASE.cactus = new THREE.BoxGeometry(1,1,1);
  GEOMETRY_BASE.cactus.attributes.position.array = Float32Array.from([
  //east
  0.4375,0.5,0.5,
  0.4375,0.5,-0.5,
  0.4375,-0.5,0.5,
  0.4375,-0.5,-0.5,

  -0.4375,0.5,-0.5,
  -0.4375,0.5,0.5,
  -0.4375,-0.5,-0.5,
  -0.4375,-0.5,0.5,

  -0.5,0.5,-0.5,
  0.5,0.5,-0.5,
  -0.5,0.5,0.5,
  0.5,0.5,0.5,

  -0.5,-0.5,0.5,
  0.5,-0.5,0.5,
  -0.5,-0.5,-0.5,
  0.5,-0.5,-0.5,

  -0.5,0.5,0.4375,
  0.5,0.5,0.4375,
  -0.5,-0.5,0.4375,
  0.5,-0.5,0.4375,

  0.5,0.5,-0.4375,
  -0.5,0.5,-0.4375,
  0.5,-0.5,-0.4375,
  -0.5,-0.5,-0.4375]);








};



const GEOMETRY_BASE = {
  init,
};






export {GEOMETRY_BASE};
