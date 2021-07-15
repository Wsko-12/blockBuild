const textureFolder = '../../../textures/';
import * as THREE from '../../../ThreeJsLib/build/three.module.js';
const textures = [
  {
    textureName:'test',
    file:'test.png',
  },
  {
    textureName:'stone',
    file:'stone.png',
  },
  {
    textureName:'ground',
    file:'ground.png',
  },
  {
    textureName:'sand',
    file:'sand.png',
  },
  {
    textureName:'snow',
    file:'snow.png',
  },
  {
    textureName:'grass_top',
    file:'grass_top.png',
  },
  {
    textureName:'grass_side',
    file:'grass_side.png',
  },
  {
    textureName:'water_0',
    file:'water_0.png',
  },
  {
    textureName:'lava',
    file:'lava.png',
  },
  {
    textureName:'cobblestone',
    file:'cobblestone.png',
  },
  {
    textureName:'obsidian',
    file:'obsidian.png',
  },
];

const atlas = {};





const textureLoader = new THREE.TextureLoader();
async function init(){
  let textureIndex = -1;
  let promise = new Promise((resolve, reject) => {
      function loading(){
        textureIndex++;
        if(textureIndex < textures.length){
          const link = textureFolder+textures[textureIndex].file;
          textureLoader.load(link,function(texture){
            texture.magFilter = THREE.NearestFilter;
            atlas[textures[textureIndex].textureName] = texture;
            loading();
          });
        }else{
          resolve('all textures loaded');
        };
      };
      loading();
  });

   let result = await promise;
   return result;
};















const TEXTURES_BASE = {
  init,
  atlas,
};


export {TEXTURES_BASE};
