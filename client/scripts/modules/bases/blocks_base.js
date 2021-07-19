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
//1 - измененный блок (вода, ?полублоки)

//light
//bool

//transparent:
// 0 - не прозрачный;
// 1 - прозрачный материалом (вода);
//2 - прозрачный сс отдельной отрисовкой текстуры(листва)



//  rotated - крутиться ли блок,
// rotatedConfig:0 - крутиться только текстура ewsn (печь)
// rotatedConfig:1 - крутиться только текстура ewtbsn парно (дерево)









BLOCKS_BASE.test = {
  meshBase:'test',
  geometry:0,
  transparent:0,
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





BLOCKS_BASE.furnace = {
  meshBase:'furnace',
  geometry:0,
  transparent:0,
  rotated:true,
  rotatedConfig:0,
};





BLOCKS_BASE.oak_log = {
  meshBase:'oak_log',
  geometry:0,
  transparent:0,
  rotated:true,
  rotatedConfig:1,
};

BLOCKS_BASE.oak_leaves = {
  meshBase:'oak_leaves',
  geometry:0,
  transparent:2,
  lightRefraction:1,
};









export {BLOCKS_BASE};
