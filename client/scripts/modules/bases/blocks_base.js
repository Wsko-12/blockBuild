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
//1 - измененный блок (вода, ?полублоки,кактус)

//light
//bool

//transparent:
// 0 - не прозрачный;
// 1 - прозрачный материалом (вода);
//2 - прозрачный сс отдельной отрисовкой текстуры(листва)



//  rotated - крутиться ли блок,
// rotatedConfig:0 - крутиться только текстура ewsn (печь)
// rotatedConfig:1 - крутиться только текстура ewtbsn парно (дерево)







BLOCKS_BASE.camera = {
};

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

BLOCKS_BASE.bucket = {
};

BLOCKS_BASE.water = {
  meshBase:'water',
  geometry:1,
  transparent:1,
  lightRefraction:2,
  liquid:true,
  liquidType:'water',
  disableDeathParticles:true,

};
BLOCKS_BASE.lava = {
  meshBase:'lava',
  geometry:1,
  liquid:true,
  transparent:0,
  liquidType:'lava',
  lightBlock:true,
  lightValue:15,
  disableDeathParticles:true,
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





BLOCKS_BASE.cactus = {
  meshBase:'cactus',
  geometry:1,
  transparent:2,
  lightRefraction:1,
  //как этот блок добавляется;
  uniqueAdd:true,
  uniqueAddFunction:function(block,config){
    if(config.faceIndex === 2){
      if(config.checkedBlock.name === 'sand' || config.checkedBlock.name === 'cactus'){
        let thisMapCeil = config.checkedBlock.mapCeil.crossNeighbors[config.faceIndex];
        if(thisMapCeil.contant){
          //это при строительстве по жидкостью
          return false;
        };
        for(let i=0;i<thisMapCeil.crossNeighbors.length;i++){
          if(i!= 2 && i!= 3){
            const neighbour = thisMapCeil.crossNeighbors[i];
            if(neighbour){
              if(neighbour.contant){
                if(!neighbour.contant.config.liquid){
                  return false;
                };
              };
            };
          };
        };

        return true;
      }else{
        return false;
      };
    }else{
      return false;
    }
  },

  //когда добавляют к этому блоку
  uniqueAttachment: true,
  uniqueAttachmentFunction:function(config){
    if(config.faceIndex === 2 ||config.faceIndex === 3 ){
      return true;
    }else{
      return false;
    };
  },


  uniqueUpdate:true,
  uniqueUpdateFunction:function(block){
    for(let i = 0;i<block.mapCeil.crossNeighbors.length;i++){
      const neighbour = block.mapCeil.crossNeighbors[i];
      if(i!= 2 && i!= 3){
          if(neighbour){
            if(neighbour.contant){
              if(!neighbour.contant.config.liquid){
                MAIN.game.world.map.removeBlock(block);
                return;
              };
            };
          };
      }else if(i === 3){
        if(neighbour){
          if(neighbour.contant){
            if(neighbour.contant.config.liquid){
              MAIN.game.world.map.removeBlock(block);
              return;
            };
          }else{
            MAIN.game.world.map.removeBlock(block);
            return;
          };
        }else{
          MAIN.game.world.map.removeBlock(block);
          return;
        };
      };
    };
  },
};









export {BLOCKS_BASE};
