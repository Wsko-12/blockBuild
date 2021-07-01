import {
  BLOCKS_BASE
} from './scripts/modules/bases/blocks_base.js';
import {
  MESHES_BASE
} from './scripts/modules/bases/meshes_base.js';
import {
  MAIN
} from './scripts/main.js';
import * as THREE from './ThreeJsLib/build/three.module.js';

function getBlock(name) {
  const self = {
    name,
  }

  self.config = BLOCKS_BASE[name];

  self.mesh = MESHES_BASE.getMesh(name);
  self.shadowsDate = {}


  self.addMeshToScene = function() {
    //если полная геометрия, то сдвиг не нужен
    let positionShift;
    if (this.config.geometry === 0) {
      positionShift = {x:0,y:0,z:0};
    }else{

    };

    this.mesh.position.x = this.position.x + positionShift.x;
    this.mesh.position.y = this.position.y + positionShift.y;
    this.mesh.position.z = this.position.z + positionShift.z;

    MAIN.render.scene.add(this.mesh);
  };

  self.setPosition = function(position) {
    this.position = position;
  };

  self.updateTexture = function(side,image,lightValue,cornersValues,lastBlock,map){
    const canvas = document.createElement('canvas');
    const textureSize = MAIN.render.config.textureSize;
    canvas.width = textureSize;
    canvas.height = textureSize;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    //рисуем полную текстуру
    ctx.drawImage(image, 0, 0, textureSize, textureSize);

    //eсли выключены softShadow, то просто затемняем текстуру
    if(MAIN.render.config.softShadows){
      let gradient
      if(cornersValues[0] > 0){
        gradient = ctx.createLinearGradient(0,0, textureSize,textureSize);
        gradient.addColorStop(0, `rgba(0,0,0,${cornersValues[0]/3.5-0.2})`);
        gradient.addColorStop(0.6, 'rgba(0,0,0,0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, textureSize, textureSize);
      }

      if(cornersValues[1] > 0){
        gradient = ctx.createLinearGradient(textureSize,0, 0,textureSize);
        gradient.addColorStop(0, `rgba(0,0,0,${cornersValues[1]/3.5-0.2})`);
        gradient.addColorStop(0.6, 'rgba(0,0,0,0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, textureSize, textureSize);
      }

      if(cornersValues[2] > 0){
        gradient = ctx.createLinearGradient(textureSize,textureSize, 0,0);
        gradient.addColorStop(0, `rgba(0,0,0,${cornersValues[2]/3.5-0.2})`);
        gradient.addColorStop(0.6, 'rgba(0,0,0,0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, textureSize, textureSize);
      }

      if(cornersValues[3] > 0){
        gradient = ctx.createLinearGradient(0,textureSize, textureSize,0);
        gradient.addColorStop(0, `rgba(0,0,0,${cornersValues[3]/3.5-0.2})`);
        gradient.addColorStop(0.6, 'rgba(0,0,0,0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, textureSize, textureSize);
      }



       // gradient=ctx.createRadialGradient(textureSize/2,textureSize/2,textureSize,textureSize,textureSize,textureSize);
       // gradient = ctx.createRadialGradient(textureSize/2,textureSize/2,textureSize,textureSize/2,textureSize/2,textureSize/20);
       // gradient.addColorStop(0,"rgba(0,0,0,0)");
       // gradient.addColorStop(1, `rgba(0,0,0,${1 - (lightValue)/15})`);
       // // gradient.addColorStop(0.45, 'rgba(0,0,0,0)');
       // ctx.fillStyle = gradient;
       // ctx.fillRect(0, 0, textureSize, textureSize);

      //side
      // if(cornersValues[0]>0 && cornersValues[1]>0){
      //   gradient = ctx.createLinearGradient(textureSize/2,0, textureSize/2,textureSize);
      //   gradient.addColorStop(0, `rgba(0,0,0,${1 - (lightValue-1)/15 - (cornersValues[0]+cornersValues[1])/6})`);
      //   gradient.addColorStop(0.2, 'rgba(0,0,0,0)');
      //   ctx.fillStyle = gradient;
      //   ctx.fillRect(0, 0, textureSize, textureSize);
      // }
      // if(cornersValues[1]>0 && cornersValues[2]>0){
      //   gradient = ctx.createLinearGradient(textureSize,textureSize/2, 0,textureSize/2);
      //   gradient.addColorStop(0, `rgba(0,0,0,${1 - (lightValue-1)/15 - (cornersValues[1]+cornersValues[2])/6})`);
      //   gradient.addColorStop(0.2, 'rgba(0,0,0,0)');
      //   ctx.fillStyle = gradient;
      //   ctx.fillRect(0, 0, textureSize, textureSize);
      // }
      // if(cornersValues[2]>0 && cornersValues[3]>0){
      //   gradient = ctx.createLinearGradient(textureSize/2,textureSize, textureSize/2,0);
      //   gradient.addColorStop(0, `rgba(0,0,0,${1 - (lightValue-1)/15 - (cornersValues[2]+cornersValues[3])/6})`);
      //   gradient.addColorStop(0.2, 'rgba(0,0,0,0)');
      //   ctx.fillStyle = gradient;
      //   ctx.fillRect(0, 0, textureSize, textureSize);
      // }
      // if(cornersValues[2]>0 && cornersValues[3]>0){
      //   gradient = ctx.createLinearGradient(0,textureSize/2, textureSize,textureSize/2);
      //   gradient.addColorStop(0, `rgba(0,0,0,${1 - (lightValue-1)/15 - (cornersValues[2]+cornersValues[3])/6})`);
      //   gradient.addColorStop(0.2, 'rgba(0,0,0,0)');
      //   ctx.fillStyle = gradient;
      //   ctx.fillRect(0, 0, textureSize, textureSize);
      // }
    };
    if(lightValue === 0){
      lightValue = 2;
    }
    ctx.fillStyle = `rgba(0,0,0,${1 - lightValue/15})`;
    ctx.fillRect(0,0,textureSize,textureSize);




    side.map = new THREE.CanvasTexture(canvas);
    side.map.magFilter = THREE.NearestFilter;
    if(lastBlock){
      console.log('updated')
      map.onUpdateAmbientLight = false;
    };
  };





  self.updateShadow = function(lastBlock,map){
    const that = this;
    setTimeout(function(){
      const mapCeil = that.mapCeil;
      if(that.config.geometry === 0){
        const originalMaterial = MESHES_BASE.getMeshMaterial(that.name);

        that.mesh.material.forEach((side, sideIndex) => {
          //если сторона есть
          if(side != null){

            // console.log(sideImage);
            //затемнения углов
            const cornersValues = [0,0,0,0];
            let sideGlobalLightValue = 2;
            //проходимся по соседям по часовой
            mapCeil.neighborsBySide[sideIndex].forEach((neighbor, neighborIndex) => {
              //если не вышли за пределы карты
              if(neighbor != null){
                //центр,его не должно быть, но в будущем для прозрачных блоков нужен
                if(neighborIndex === 8){
                  sideGlobalLightValue = neighbor.lightValue;
                };
                //верхний левый
                if(neighborIndex === 7 || neighborIndex === 0 || neighborIndex === 1){
                  if(mapCeil.neighborsBySide[sideIndex][neighborIndex].contant){
                    cornersValues[0]++;
                  }
                };
                //верхний правый
                if(neighborIndex === 1 || neighborIndex === 2 || neighborIndex === 3){
                  if(mapCeil.neighborsBySide[sideIndex][neighborIndex].contant){
                    cornersValues[1]++;
                  }
                };
                //нижний правый
                if(neighborIndex === 3 || neighborIndex === 4 || neighborIndex === 5){
                  if(mapCeil.neighborsBySide[sideIndex][neighborIndex].contant){
                    cornersValues[2]++;
                  }
                };
                //нижний левый
                if(neighborIndex === 5 || neighborIndex === 6 || neighborIndex === 7){
                  if(mapCeil.neighborsBySide[sideIndex][neighborIndex].contant){
                    cornersValues[3]++;
                  }
                };
              };
            });
            if(!mapCeil.shadowsDate[sideIndex]){
              mapCeil.shadowsDate[sideIndex] ={
                gLV:sideGlobalLightValue,
                cV:cornersValues,
              }

              const sideImage = originalMaterial[sideIndex].map.image;
              that.updateTexture(side,sideImage,sideGlobalLightValue,cornersValues,lastBlock,map);

            }else{
              if(mapCeil.shadowsDate[sideIndex].gLV != sideGlobalLightValue ||
                mapCeil.shadowsDate[sideIndex].cV[0] != cornersValues[0] ||
                mapCeil.shadowsDate[sideIndex].cV[1] != cornersValues[1]||
                mapCeil.shadowsDate[sideIndex].cV[2] != cornersValues[2]||
                mapCeil.shadowsDate[sideIndex].cV[3] != cornersValues[3]
              ){
                console.log('reupdate');
              }else{
                if(lastBlock){
                  console.log('updated')
                  map.onUpdateAmbientLight = false;
                };
              };
            }
          };
        });
      };
    });
  };

  self.updateInvisibleFaces = function() {
    this.mesh.material = MESHES_BASE.getMeshMaterial(this.name);
    this.mapCeil.crossNeighbors.forEach((neighbor, i) => {
      if(neighbor != null){
        if(neighbor.contant){
          this.mesh.material[i] = null;
        }
      }
    });


  };



  return self;
};









const BLOCKS_MODULE = {
  getBlock
};

export {
  BLOCKS_MODULE
}
