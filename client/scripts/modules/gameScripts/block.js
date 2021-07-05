import {
  MAIN
} from '../../main.js';

import {
  BLOCKS_BASE
} from '../bases/blocks_base.js';
import {
  MESHES_BASE
} from '../bases/meshes_base.js';
import * as THREE from '../../../ThreeJsLib/build/three.module.js';

let renderStarted = false;

function get(name) {
  const self = {
    name,
  }

  self.config = BLOCKS_BASE[name];

  self.mesh = MESHES_BASE.getMesh(name);
  self.shadowsDate = {}

  self.meshAddedToScene = false;
  self.addMeshToScene = function() {
    //если полная геометрия, то сдвиг не нужен
    let positionShift;
    if (this.config.geometry === 0) {
      positionShift = {
        x: 0,
        y: 0,
        z: 0
      };
    } else if(this.config.geometry === 1){
      positionShift = {
        x: 0 + this.config.positionShift[0],
        y: 0 + this.config.positionShift[1],
        z: 0 + this.config.positionShift[2],
      };
    };

    this.mesh.position.x = this.position.x + positionShift.x;
    this.mesh.position.y = this.position.y + positionShift.y;
    this.mesh.position.z = this.position.z + positionShift.z;

    const mouseBoxGeometry = this.mesh.geometry.clone();
    const mouseBoxMaterial = new THREE.MeshBasicMaterial({
      visible: false
    });
    const mouseBox = new THREE.Mesh(mouseBoxGeometry, mouseBoxMaterial);
    mouseBox.position.x = this.position.x + positionShift.x;
    mouseBox.position.y = this.position.y + positionShift.y;
    mouseBox.position.z = this.position.z + positionShift.z;

    this.mouseBox = mouseBox;
    mouseBox.userData.block = this;

    MAIN.render.mouseBoxes.add(mouseBox);
    MAIN.render.blocks.add(this.mesh);
    this.meshAddedToScene = true;
  };


  self.removeMeshFromScene = function() {
    this.meshAddedToScene = false;
    this.mouseBox.parent.remove(this.mouseBox);
    this.mesh.parent.remove(this.mesh);
  };

  self.setPosition = function(position) {
    this.position = position;
  };





  self.drawSideTexture = async function(side, image, lightValue, cornersValues,sidesValue) {

    function draw(){
      const canvas = document.createElement('canvas');
      const textureSize = MAIN.render.config.textureSize;
      canvas.width = textureSize;
      canvas.height = textureSize;
      const ctx = canvas.getContext('2d');
      ctx.imageSmoothingEnabled = false;
      //рисуем полную текстуру
      ctx.drawImage(image, 0, 0, textureSize, textureSize);

      //eсли выключены softShadow, то просто затемняем текстуру
      if (MAIN.render.config.softShadows) {
        let gradient
        if (cornersValues[0] > 0) {
          gradient = ctx.createLinearGradient(0, 0, textureSize, textureSize);
          gradient.addColorStop(0, `rgba(0,0,0,${cornersValues[0]/3.5-0.2})`);
          gradient.addColorStop(0.6, 'rgba(0,0,0,0)');
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, textureSize, textureSize);
        }

        if (cornersValues[1] > 0) {
          gradient = ctx.createLinearGradient(textureSize, 0, 0, textureSize);
          gradient.addColorStop(0, `rgba(0,0,0,${cornersValues[1]/3.5-0.2})`);
          gradient.addColorStop(0.6, 'rgba(0,0,0,0)');
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, textureSize, textureSize);
        }

        if (cornersValues[2] > 0) {
          gradient = ctx.createLinearGradient(textureSize, textureSize, 0, 0);
          gradient.addColorStop(0, `rgba(0,0,0,${cornersValues[2]/3.5-0.2})`);
          gradient.addColorStop(0.6, 'rgba(0,0,0,0)');
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, textureSize, textureSize);
        }

        if (cornersValues[3] > 0) {
          gradient = ctx.createLinearGradient(0, textureSize, textureSize, 0);
          gradient.addColorStop(0, `rgba(0,0,0,${cornersValues[3]/3.5-0.2})`);
          gradient.addColorStop(0.6, 'rgba(0,0,0,0)');
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, textureSize, textureSize);
        }

          // gradient = ctx.createLinearGradient(textureSize/2,0, textureSize/2,textureSize+textureSize/2);
          // gradient.addColorStop(0, `rgba(0,0,0,${(1 - (lightValue - sidesValue[0])/15)})`);
          // gradient.addColorStop(1, `rgba(0,0,0,${(1 - lightValue /15)/4})`);
          // ctx.fillStyle = gradient;
          // ctx.fillRect(0, 0, textureSize, textureSize);
          //
          //
          // gradient = ctx.createLinearGradient(textureSize,textureSize/2, 0-textureSize/2,textureSize/2);
          // gradient.addColorStop(0, `rgba(0,0,0,${(1 - (lightValue - sidesValue[1])/15)})`);
          // gradient.addColorStop(1, `rgba(0,0,0,${(1 - lightValue /15)/4})`);
          // ctx.fillStyle = gradient;
          // ctx.fillRect(0, 0, textureSize, textureSize);
          // //
          // gradient = ctx.createLinearGradient(textureSize/2,textureSize, textureSize/2,0-textureSize/2);
          // gradient.addColorStop(0, `rgba(0,0,0,${(1 - (lightValue - sidesValue[2])/15)})`);
          // gradient.addColorStop(1, `rgba(0,0,0,${(1 - lightValue /15)/4})`);
          // ctx.fillStyle = gradient;
          // ctx.fillRect(0, 0, textureSize, textureSize);
          // //
          // gradient = ctx.createLinearGradient(0,textureSize/2, textureSize + textureSize/2,textureSize/2);
          // gradient.addColorStop(0, `rgba(0,0,0,${(1 - (lightValue - sidesValue[3])/15)})`);
          // gradient.addColorStop(1, `rgba(0,0,0,${(1 - lightValue /15)/4})`);
          // ctx.fillStyle = gradient;
          // ctx.fillRect(0, 0, textureSize, textureSize);
          //
          //
          //
          //
          //




      }
        ctx.fillStyle = `rgba(0,0,0,${1 - lightValue/15})`;
        ctx.fillRect(0, 0, textureSize, textureSize);
      



      side.map = new THREE.CanvasTexture(canvas);
      side.map.magFilter = THREE.NearestFilter;
      return true;
    };
    draw();
  };


  self.updateShadow = async function() {
    //когда эта функция вернет true, перейдет к другому блоку
    const originalMaterial = MESHES_BASE.getMeshMaterial(this.name);


    let sideIndex = -1;
    const that = this;
    const mapCeil = that.mapCeil;
    if(this.config.transparent === 0){
      return checkSide();
    }

    function checkSide() {
      sideIndex++;
      const side = that.mesh.material[sideIndex];
      if (side) {
        const sideImage = originalMaterial[sideIndex].map.image;
        //затемнения углов
        const cornersValues = [0, 0, 0, 0];
        const sidesValue = [0, 0, 0, 0];//top, right, bottom, left

        let sideGlobalLightValue = 0;


        mapCeil.neighborsBySide[sideIndex].forEach((neighbor, neighborIndex) => {
          //если не вышли за пределы карты
          if (neighbor != null) {
            //центр,его не должно быть, но в будущем для прозрачных блоков нужен
            if (neighborIndex === 8) {
              sideGlobalLightValue = neighbor.lightValue;
            };
            if (mapCeil.neighborsBySide[sideIndex][neighborIndex].contant) {
              if(mapCeil.neighborsBySide[sideIndex][neighborIndex].contant.config.transparent === 0){
                //верхний левый
                if (neighborIndex === 7 || neighborIndex === 0 || neighborIndex === 1) {
                  cornersValues[0]++;
                };

                //верхний правый
                if (neighborIndex === 1 || neighborIndex === 2 || neighborIndex === 3) {
                  cornersValues[1]++;
                };

                //нижний правый
                if (neighborIndex === 3 || neighborIndex === 4 || neighborIndex === 5) {
                  cornersValues[2]++;
                };
                //нижний левый
                if (neighborIndex === 5 || neighborIndex === 6 || neighborIndex === 7) {
                  cornersValues[3]++;
                };
              };
            };

            // постепенное затемнение
            // нужно найти с каких сторон блок воздуха темнее
            if(neighbor.lightValue < mapCeil.neighborsBySide[sideIndex][8].lightValue){
              if(neighborIndex === 1){
                sidesValue[0] = 1;
              }
              if(neighborIndex === 3){
                sidesValue[1] = 1;
              }
              if(neighborIndex === 5){
                sidesValue[2] = 1;
              }
              if(neighborIndex === 7){
                sidesValue[3] = 1;
              }
            };






          }else{
            //скраю карты
            sideGlobalLightValue = 2;
          }


        });






        that.drawSideTexture(side, sideImage, sideGlobalLightValue, cornersValues,sidesValue).then(function() {
          return checkSide();
        });

      } else {
        if (sideIndex === 6) {
          return true;
        } else {
          return checkSide();
        };
      };
    };

    // return checkSide();
  };


  self.updateInvisibleFaces = function() {
    this.mesh.material = MESHES_BASE.getMeshMaterial(this.name);
    let allNeighbours = true;
    if (!this.meshAddedToScene) {
      this.addMeshToScene();
    };
    this.mapCeil.crossNeighbors.forEach((neighbor, i) => {
      if (neighbor != null) {
        if (neighbor.contant) {
          //если этот блок не прозрачный
          if(this.config.transparent === 0){
            if(neighbor.contant.config.transparent === 0){
              this.mesh.material[i] = null;
            }else{
              allNeighbours = false;
            }
          }else{
            this.mesh.material[i] = null;
          }
        } else {
          allNeighbours = false;
        }
      } else {
        allNeighbours = false;
      }
    });
    if (allNeighbours) {
      this.removeMeshFromScene();
    };

  };



  self.update = function() {
    this.updateInvisibleFaces();
  };
  return self;

};









const BLOCK = {
  get,
};

export {
  BLOCK
}
