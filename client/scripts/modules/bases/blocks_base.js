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
//1 - измененный блок

//light
//bool

//transparent:
// 0 - не прозрачный;
// 1 - прозрачный материалом (вода);

//rotation:
//0 - не крутится
//1 - крутится текстура







BLOCKS_BASE.test = {
  meshBase:'test',
  geometry:0,
  transparent:0,
  lightBlock:true,
  lightValue:13,
};

BLOCKS_BASE.stone = {
  meshBase:'stone',
  geometry:0,
  transparent:0,
};

BLOCKS_BASE.cobblestone = {
  meshBase:'cobblestone',
  geometry:0,
  transparent:0,
};

BLOCKS_BASE.obsidian = {
  meshBase:'obsidian',
  geometry:0,
  transparent:0,
};

BLOCKS_BASE.ground = {
  meshBase:'ground',
  geometry:0,
  transparent:0,

};
BLOCKS_BASE.sand = {
  meshBase:'sand',
  geometry:0,
  transparent:0,
  gravity:true,
};
BLOCKS_BASE.snow = {
  meshBase:'sand',
  geometry:0,
  transparent:0,
};
BLOCKS_BASE.grass = {
  meshBase:'grass',
  geometry:0,
  transparent:0,
};
BLOCKS_BASE.water = {
  meshBase:'water',
  geometry:1,
  transparent:1,
  lightRefraction:2,
  liquid:true,
  liquidType:'water',
};
BLOCKS_BASE.lava = {
  meshBase:'lava',
  geometry:1,
  liquid:true,
  transparent:0,
  liquidType:'lava',
  lightBlock:true,
  lightValue:15,
};







export {BLOCKS_BASE};
