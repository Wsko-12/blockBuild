import * as THREE from '../../../ThreeJsLib/build/three.module.js';
import {TEXTURES_BASE} from './textures_base.js';
const loader = new THREE.ObjectLoader();



function init(){
  //testBlock
  const standardBlockGeometry = new THREE.BoxBufferGeometry(1,1,1);

  MESHES_BASE.test = {
    G:standardBlockGeometry,
    M:[
      //ewtbsn
      new THREE.MeshBasicMaterial({
        map:TEXTURES_BASE.atlas.east,
      }),
      new THREE.MeshBasicMaterial({
        map:TEXTURES_BASE.atlas.west,
      }),
      new THREE.MeshBasicMaterial({
        map:TEXTURES_BASE.atlas.top,
      }),
      new THREE.MeshBasicMaterial({
        map:TEXTURES_BASE.atlas.bottom,
      }),
      new THREE.MeshBasicMaterial({
        map:TEXTURES_BASE.atlas.south,
      }),
      new THREE.MeshBasicMaterial({
        map:TEXTURES_BASE.atlas.north,
      }),
    ],
  };

  MESHES_BASE.stone = {
    G:standardBlockGeometry,
    M:[
      //ewtbsn
      new THREE.MeshBasicMaterial({
        map:TEXTURES_BASE.atlas.stone,
      }),
      new THREE.MeshBasicMaterial({
        map:TEXTURES_BASE.atlas.stone,
      }),
      new THREE.MeshBasicMaterial({
        map:TEXTURES_BASE.atlas.stone,
      }),
      new THREE.MeshBasicMaterial({
        map:TEXTURES_BASE.atlas.stone,
      }),
      new THREE.MeshBasicMaterial({
        map:TEXTURES_BASE.atlas.stone,
      }),
      new THREE.MeshBasicMaterial({
        map:TEXTURES_BASE.atlas.stone,
      }),
    ],
  };
  MESHES_BASE.ground = {
    G:standardBlockGeometry,
    M:[
      //ewtbsn
      new THREE.MeshBasicMaterial({
        map:TEXTURES_BASE.atlas.ground,
      }),
      new THREE.MeshBasicMaterial({
        map:TEXTURES_BASE.atlas.ground,
      }),
      new THREE.MeshBasicMaterial({
        map:TEXTURES_BASE.atlas.ground,
      }),
      new THREE.MeshBasicMaterial({
        map:TEXTURES_BASE.atlas.ground,
      }),
      new THREE.MeshBasicMaterial({
        map:TEXTURES_BASE.atlas.ground,
      }),
      new THREE.MeshBasicMaterial({
        map:TEXTURES_BASE.atlas.ground,
      }),
    ],
  };

  MESHES_BASE.sand = {
    G:standardBlockGeometry,
    M:[
      //ewtbsn
      new THREE.MeshBasicMaterial({
        map:TEXTURES_BASE.atlas.sand,
      }),
      new THREE.MeshBasicMaterial({
        map:TEXTURES_BASE.atlas.sand,
      }),
      new THREE.MeshBasicMaterial({
        map:TEXTURES_BASE.atlas.sand,
      }),
      new THREE.MeshBasicMaterial({
        map:TEXTURES_BASE.atlas.sand,
      }),
      new THREE.MeshBasicMaterial({
        map:TEXTURES_BASE.atlas.sand,
      }),
      new THREE.MeshBasicMaterial({
        map:TEXTURES_BASE.atlas.sand,
      }),
    ],
  };

  MESHES_BASE.snow = {
    G:standardBlockGeometry,
    M:[
      //ewtbsn
      new THREE.MeshBasicMaterial({
        map:TEXTURES_BASE.atlas.snow,
      }),
      new THREE.MeshBasicMaterial({
        map:TEXTURES_BASE.atlas.snow,
      }),
      new THREE.MeshBasicMaterial({
        map:TEXTURES_BASE.atlas.snow,
      }),
      new THREE.MeshBasicMaterial({
        map:TEXTURES_BASE.atlas.snow,
      }),
      new THREE.MeshBasicMaterial({
        map:TEXTURES_BASE.atlas.snow,
      }),
      new THREE.MeshBasicMaterial({
        map:TEXTURES_BASE.atlas.snow,
      }),
    ],
  };

  //newBlockHere

  MESHES_BASE.grass = {
    G:standardBlockGeometry,
    M:[
      //ewtbsn
      new THREE.MeshBasicMaterial({
        map:TEXTURES_BASE.atlas.grass_side,
      }),
      new THREE.MeshBasicMaterial({
        map:TEXTURES_BASE.atlas.grass_side,
      }),
      new THREE.MeshBasicMaterial({
        map:TEXTURES_BASE.atlas.grass_top,
      }),
      new THREE.MeshBasicMaterial({
        map:TEXTURES_BASE.atlas.ground,
      }),
      new THREE.MeshBasicMaterial({
        map:TEXTURES_BASE.atlas.grass_side,
      }),
      new THREE.MeshBasicMaterial({
        map:TEXTURES_BASE.atlas.grass_side,
      }),
    ],
  };

  MESHES_BASE.water = {
    G:standardBlockGeometry,
    M:[
      //ewtbsn
      new THREE.MeshBasicMaterial({
        map:TEXTURES_BASE.atlas.water_0,
        transparent:true,
        opacity:1,
      }),
      new THREE.MeshBasicMaterial({
        map:TEXTURES_BASE.atlas.water_0,
        transparent:true,
        opacity:1,
      }),
      new THREE.MeshBasicMaterial({
        map:TEXTURES_BASE.atlas.water_0,
        transparent:true,
        opacity:1,
      }),
      new THREE.MeshBasicMaterial({
        map:TEXTURES_BASE.atlas.water_0,
        transparent:true,
        opacity:1,
      }),
      new THREE.MeshBasicMaterial({
        map:TEXTURES_BASE.atlas.water_0,
        transparent:true,
        opacity:1,
      }),
      new THREE.MeshBasicMaterial({
        map:TEXTURES_BASE.atlas.water_0,
        transparent:true,
        opacity:1,
      }),
    ],
  };
  MESHES_BASE.lava = {
    G:standardBlockGeometry,
    M:[
      //ewtbsn
      new THREE.MeshBasicMaterial({
        map:TEXTURES_BASE.atlas.lava,
      }),
      new THREE.MeshBasicMaterial({
        map:TEXTURES_BASE.atlas.lava,
      }),
      new THREE.MeshBasicMaterial({
        map:TEXTURES_BASE.atlas.lava,
      }),
      new THREE.MeshBasicMaterial({
        map:TEXTURES_BASE.atlas.lava,
      }),
      new THREE.MeshBasicMaterial({
        map:TEXTURES_BASE.atlas.lava,
      }),
      new THREE.MeshBasicMaterial({
        map:TEXTURES_BASE.atlas.lava,
      }),
    ],
  };


  MESHES_BASE.lava = {
    G:standardBlockGeometry,
    M:[
      //ewtbsn
      new THREE.MeshBasicMaterial({
        map:TEXTURES_BASE.atlas.lava,
      }),
      new THREE.MeshBasicMaterial({
        map:TEXTURES_BASE.atlas.lava,
      }),
      new THREE.MeshBasicMaterial({
        map:TEXTURES_BASE.atlas.lava,
      }),
      new THREE.MeshBasicMaterial({
        map:TEXTURES_BASE.atlas.lava,
      }),
      new THREE.MeshBasicMaterial({
        map:TEXTURES_BASE.atlas.lava,
      }),
      new THREE.MeshBasicMaterial({
        map:TEXTURES_BASE.atlas.lava,
      }),
    ],
  };


  MESHES_BASE.cobblestone = {
    G:standardBlockGeometry,
    M:[
      //ewtbsn
      new THREE.MeshBasicMaterial({
        map:TEXTURES_BASE.atlas.cobblestone,
      }),
      new THREE.MeshBasicMaterial({
        map:TEXTURES_BASE.atlas.cobblestone,
      }),
      new THREE.MeshBasicMaterial({
        map:TEXTURES_BASE.atlas.cobblestone,
      }),
      new THREE.MeshBasicMaterial({
        map:TEXTURES_BASE.atlas.cobblestone,
      }),
      new THREE.MeshBasicMaterial({
        map:TEXTURES_BASE.atlas.cobblestone,
      }),
      new THREE.MeshBasicMaterial({
        map:TEXTURES_BASE.atlas.cobblestone,
      }),
    ],
  };

  MESHES_BASE.obsidian = {
    G:standardBlockGeometry,
    M:[
      //ewtbsn
      new THREE.MeshBasicMaterial({
        map:TEXTURES_BASE.atlas.obsidian,
      }),
      new THREE.MeshBasicMaterial({
        map:TEXTURES_BASE.atlas.obsidian,
      }),
      new THREE.MeshBasicMaterial({
        map:TEXTURES_BASE.atlas.obsidian,
      }),
      new THREE.MeshBasicMaterial({
        map:TEXTURES_BASE.atlas.obsidian,
      }),
      new THREE.MeshBasicMaterial({
        map:TEXTURES_BASE.atlas.obsidian,
      }),
      new THREE.MeshBasicMaterial({
        map:TEXTURES_BASE.atlas.obsidian,
      }),
    ],
  };

  MESHES_BASE.furnace = {
    G:standardBlockGeometry,
    M:[
      //ewtbsn
      new THREE.MeshBasicMaterial({
        map:TEXTURES_BASE.atlas.furnace_main,
      }),
      new THREE.MeshBasicMaterial({
        map:TEXTURES_BASE.atlas.furnace_side,
      }),
      new THREE.MeshBasicMaterial({
        map:TEXTURES_BASE.atlas.furnace_top,
      }),
      new THREE.MeshBasicMaterial({
        map:TEXTURES_BASE.atlas.furnace_top,
      }),
      new THREE.MeshBasicMaterial({
        map:TEXTURES_BASE.atlas.furnace_side,
      }),
      new THREE.MeshBasicMaterial({
        map:TEXTURES_BASE.atlas.furnace_side,
      }),
    ],
  };

  MESHES_BASE.oak_log = {
    G:standardBlockGeometry,
    M:[
      //ewtbsn
      new THREE.MeshBasicMaterial({
        map:TEXTURES_BASE.atlas.oak_log_side,
      }),
      new THREE.MeshBasicMaterial({
        map:TEXTURES_BASE.atlas.oak_log_side,
      }),
      new THREE.MeshBasicMaterial({
        map:TEXTURES_BASE.atlas.oak_log_top,
      }),
      new THREE.MeshBasicMaterial({
        map:TEXTURES_BASE.atlas.oak_log_top,
      }),
      new THREE.MeshBasicMaterial({
        map:TEXTURES_BASE.atlas.oak_log_side,
      }),
      new THREE.MeshBasicMaterial({
        map:TEXTURES_BASE.atlas.oak_log_side,
      }),
    ],

    M_R_1:[
      new THREE.MeshBasicMaterial({
        map:TEXTURES_BASE.atlas.oak_log_top,
      }),
      new THREE.MeshBasicMaterial({
        map:TEXTURES_BASE.atlas.oak_log_top,
      }),
      new THREE.MeshBasicMaterial({
        map:TEXTURES_BASE.atlas.oak_log_side_rotated,
      }),
      new THREE.MeshBasicMaterial({
        map:TEXTURES_BASE.atlas.oak_log_side_rotated,
      }),
      new THREE.MeshBasicMaterial({
        map:TEXTURES_BASE.atlas.oak_log_side_rotated,
      }),
      new THREE.MeshBasicMaterial({
        map:TEXTURES_BASE.atlas.oak_log_side_rotated,
      }),
    ],
  };


  MESHES_BASE.cobblestone_stairs = {
    G:standardBlockGeometry,
    M:[
      //ewtbsn
      new THREE.MeshBasicMaterial({
        map:TEXTURES_BASE.atlas.cobblestone,
      }),
      new THREE.MeshBasicMaterial({
        map:TEXTURES_BASE.atlas.cobblestone,
      }),
      new THREE.MeshBasicMaterial({
        map:TEXTURES_BASE.atlas.cobblestone,
      }),
      new THREE.MeshBasicMaterial({
        map:TEXTURES_BASE.atlas.cobblestone,
      }),
      new THREE.MeshBasicMaterial({
        map:TEXTURES_BASE.atlas.cobblestone,
        transparent:true,
        alphaMap:TEXTURES_BASE.atlas.stairs_alphaMap_south,
      }),
      new THREE.MeshBasicMaterial({
        map:TEXTURES_BASE.atlas.cobblestone,
        transparent:true,
        alphaMap:TEXTURES_BASE.atlas.stairs_alphaMap_north,
      }),
    ],

    M_R:[
      //ewtbsn
      new THREE.MeshBasicMaterial({
        map:TEXTURES_BASE.atlas.cobblestone,
      }),
      new THREE.MeshBasicMaterial({
        map:TEXTURES_BASE.atlas.cobblestone,
      }),
      new THREE.MeshBasicMaterial({
        map:TEXTURES_BASE.atlas.cobblestone,
      }),
      new THREE.MeshBasicMaterial({
        map:TEXTURES_BASE.atlas.cobblestone,
      }),
      new THREE.MeshBasicMaterial({
        map:TEXTURES_BASE.atlas.cobblestone,
        transparent:true,
        alphaMap:TEXTURES_BASE.atlas.stairs_alphaMap_south_R,
      }),
      new THREE.MeshBasicMaterial({
        map:TEXTURES_BASE.atlas.cobblestone,
        transparent:true,
        alphaMap:TEXTURES_BASE.atlas.stairs_alphaMap_north_R,
      }),
    ],
  };


};






function getMesh(name){
  const geom = MESHES_BASE[name].G.clone();
  let material = MESHES_BASE.getMeshMaterial(name);
  return new THREE.Mesh(geom,material);
};


function getMeshMaterial(name){
  const stockMaterial = MESHES_BASE[name].M;
  const newMaterial = [];
  stockMaterial.forEach((side, i) => {
      newMaterial.push(side.clone())
  });

  return newMaterial;
};

function getMeshMaterial_Rotated_1(name){
  const stockMaterial = MESHES_BASE[name].M_R_1;
  const newMaterial = [];
  stockMaterial.forEach((side, i) => {
      newMaterial.push(side.clone())
  });

  return newMaterial;
};

function getMeshMaterial_Rotated_2(name){
  const stockMaterial = MESHES_BASE[name].M_R;
  const newMaterial = [];
  stockMaterial.forEach((side, i) => {
      newMaterial.push(side.clone())
  });

  return newMaterial;
};


const MESHES_BASE = {
  init,
  getMesh,
  getMeshMaterial,
  getMeshMaterial_Rotated_1,
  getMeshMaterial_Rotated_2,
};








export {MESHES_BASE};
