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
        map:TEXTURES_BASE.atlas.test,
      }),
      new THREE.MeshBasicMaterial({
        map:TEXTURES_BASE.atlas.test,
      }),
      new THREE.MeshBasicMaterial({
        map:TEXTURES_BASE.atlas.test,
      }),
      new THREE.MeshBasicMaterial({
        map:TEXTURES_BASE.atlas.test,
      }),
      new THREE.MeshBasicMaterial({
        map:TEXTURES_BASE.atlas.test,
      }),
      new THREE.MeshBasicMaterial({
        map:TEXTURES_BASE.atlas.test,
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

const MESHES_BASE = {
  init,
  getMesh,
  getMeshMaterial,
};








export {MESHES_BASE};
