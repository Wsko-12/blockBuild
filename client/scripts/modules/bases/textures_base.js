const textureFolder = '../../../textures/';
import * as THREE from '../../../ThreeJsLib/build/three.module.js';
const textures = [

  {
    textureName:'test',
    file:'test.png',
  },
  {
    textureName:'east',
    file:'east.png',
  },
  {
    textureName:'west',
    file:'west.png',
  },
  {
    textureName:'top',
    file:'top.png',
  },
  {
    textureName:'bottom',
    file:'bottom.png',
  },
  {
    textureName:'south',
    file:'south.png',
  },
  {
    textureName:'north',
    file:'north.png',
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


  //furnace
  {
    textureName:'furnace_main',
    file:'furnace_main.png',
  },
  {
    textureName:'furnace_side',
    file:'furnace_side.png',
  },
  {
    textureName:'furnace_top',
    file:'furnace_top.png',
  },

    //oak_log
    {
      textureName:'oak_log_top',
      file:'oak_log_top.png',
    },
    {
      textureName:'oak_log_side',
      file:'oak_log_side.png',
    },
    {
      textureName:'oak_log_side_rotated',
      file:'oak_log_side_rotated.png',
    },

    {
      textureName:'oak_leaves',
      file:'oak_leaves.png',
    },








    {
      textureName:'cactus_top',
      file:'cactus_top.png',
    },
    {
      textureName:'cactus_side',
      file:'cactus_side.png',
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
