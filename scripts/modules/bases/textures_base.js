const textureFolder = '../../../textures/';
import * as THREE from '../../../ThreeJsLib/build/three.module.js';
const textures = [
  {
    textureName:'east',
    file:'./textures/east.png',
  },
  {
    textureName:'west',
    file:'./textures/west.png',
  },
  {
    textureName:'top',
    file:'./textures/top.png',
  },
  {
    textureName:'bottom',
    file:'./textures/bottom.png',
  },
  {
    textureName:'south',
    file:'./textures/south.png',
  },
  {
    textureName:'north',
    file:'./textures/north.png',
  },






  {
    textureName:'stone',
    file:'./textures/stone.png',
  },
  {
    textureName:'ground',
    file:'./textures/ground.png',
  },
  {
    textureName:'sand',
    file:'./textures/sand.png',
  },
  {
    textureName:'snow',
    file:'./textures/snow.png',
  },
  {
    textureName:'grass_top',
    file:'./textures/grass_top.png',
  },
  {
    textureName:'grass_side',
    file:'./textures/grass_side.png',
  },
  {
    textureName:'water_0',
    file:'./textures/water_0.png',
  },
  {
    textureName:'lava',
    file:'./textures/lava.png',
  },
  {
    textureName:'cobblestone',
    file:'./textures/cobblestone.png',
  },
  {
    textureName:'obsidian',
    file:'./textures/obsidian.png',
  },


  //furnace
  {
    textureName:'furnace_main',
    file:'./textures/furnace_main.png',
  },
  {
    textureName:'furnace_side',
    file:'./textures/furnace_side.png',
  },
  {
    textureName:'furnace_top',
    file:'./textures/furnace_top.png',
  },

    //oak_log
    {
      textureName:'oak_log_top',
      file:'./textures/oak_log_top.png',
    },
    {
      textureName:'oak_log_side',
      file:'./textures/oak_log_side.png',
    },
    {
      textureName:'oak_log_side_rotated',
      file:'./textures/oak_log_side_rotated.png',
    },

    {
      textureName:'oak_leaves',
      file:'./textures/oak_leaves.png',
    },








    {
      textureName:'cactus_top',
      file:'./textures/cactus_top.png',
    },
    {
      textureName:'cactus_side',
      file:'./textures/cactus_side.png',
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
          const link = textures[textureIndex].file;
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
