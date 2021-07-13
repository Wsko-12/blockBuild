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



function updateWaterBlockGeometryByCorners(block, corner0, corner1, corner2, corner3) {
  const geometry = block.mesh.geometry;
  //0
  geometry.attributes.position.array[13] = geometry.attributes.position.array[13] + corner0;
  geometry.attributes.position.array[25] = geometry.attributes.position.array[25] + corner0;
  geometry.attributes.position.array[64] = geometry.attributes.position.array[64] + corner0;


  //1
  geometry.attributes.position.array[4] = geometry.attributes.position.array[4] + corner1;
  geometry.attributes.position.array[28] = geometry.attributes.position.array[28] + corner1;
  geometry.attributes.position.array[61] = geometry.attributes.position.array[61] + corner1;


  //2
  geometry.attributes.position.array[1] = geometry.attributes.position.array[1] + corner2;
  geometry.attributes.position.array[34] = geometry.attributes.position.array[34] + corner2;
  geometry.attributes.position.array[52] = geometry.attributes.position.array[52] + corner2;

  //3
  geometry.attributes.position.array[49] = geometry.attributes.position.array[49] + corner3;
  geometry.attributes.position.array[31] = geometry.attributes.position.array[31] + corner3;
  geometry.attributes.position.array[16] = geometry.attributes.position.array[16] + corner3;



  block.mouseBox.geometry = geometry;


};

function updateWaterBlockBottomGeometry(block, value) {
  const geometry = block.mesh.geometry;
  const standartGeometry = [...geometry.attributes.position.array];



  if (block.mapCeil.crossNeighbors[3].contant) {
    if (block.mapCeil.crossNeighbors[3].contant.config.liquid) {
      if (block.mapCeil.crossNeighbors[3].contant.fluidity === 8) {
        //0
        geometry.attributes.position.array[37] = geometry.attributes.position.array[37] + value;
        geometry.attributes.position.array[55] = geometry.attributes.position.array[55] + value;
        geometry.attributes.position.array[22] = geometry.attributes.position.array[22] + value;

        //1
        geometry.attributes.position.array[40] = geometry.attributes.position.array[40] + value;
        geometry.attributes.position.array[7] = geometry.attributes.position.array[7] + value;
        geometry.attributes.position.array[58] = geometry.attributes.position.array[58] + value;


        //2
        geometry.attributes.position.array[46] = geometry.attributes.position.array[46] + value;
        geometry.attributes.position.array[10] = geometry.attributes.position.array[10] + value;
        geometry.attributes.position.array[67] = geometry.attributes.position.array[67] + value;


        //3
        geometry.attributes.position.array[43] = geometry.attributes.position.array[43] + value;
        geometry.attributes.position.array[19] = geometry.attributes.position.array[19] + value;
        geometry.attributes.position.array[70] = geometry.attributes.position.array[70] + value;

      };
    };
  };
};

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
    if (this.config.geometry === 0 || this.config.geometry === 1) {
      positionShift = {
        x: 0,
        y: 0,
        z: 0
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





  self.drawSideTexture = async function(side, image, lightValue, cornersValues, sidesValue) {

    function draw() {
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
    if (this.config.transparent === 0) {
      return checkSide();
    }

    function checkSide() {
      sideIndex++;
      const side = that.mesh.material[sideIndex];
      if (side) {
        const sideImage = originalMaterial[sideIndex].map.image;
        //затемнения углов
        const cornersValues = [0, 0, 0, 0];
        const sidesValue = [0, 0, 0, 0]; //top, right, bottom, left

        let sideGlobalLightValue = 0;


        mapCeil.neighborsBySide[sideIndex].forEach((neighbor, neighborIndex) => {
          //если не вышли за пределы карты
          if (neighbor != null) {
            //центр,его не должно быть, но в будущем для прозрачных блоков нужен
            if (neighborIndex === 8) {
              sideGlobalLightValue = neighbor.lightValue;
            };
            if (mapCeil.neighborsBySide[sideIndex][neighborIndex].contant) {
              if (mapCeil.neighborsBySide[sideIndex][neighborIndex].contant.config.transparent === 0) {
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
            if (neighbor.lightValue < mapCeil.neighborsBySide[sideIndex][8].lightValue) {
              if (neighborIndex === 1) {
                sidesValue[0] = 1;
              }
              if (neighborIndex === 3) {
                sidesValue[1] = 1;
              }
              if (neighborIndex === 5) {
                sidesValue[2] = 1;
              }
              if (neighborIndex === 7) {
                sidesValue[3] = 1;
              }
            };






          } else {
            //скраю карты
            sideGlobalLightValue = 2;
          }


        });






        that.drawSideTexture(side, sideImage, sideGlobalLightValue, cornersValues, sidesValue).then(function() {
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


          //для стандартных блоков
          if (this.config.geometry === 0) {
            if (this.config.transparent === 0) {
              if (neighbor.contant.config.transparent === 0) {
                this.mesh.material[i] = null;
              } else {
                allNeighbours = false;
              }
            } else {
              this.mesh.material[i] = null;
            }
          }



          //для жидкостей
          if (this.config.liquid) {
            if (neighbor.contant.config.transparent === 1) {
              this.mesh.material[i] = null;
            } else {
              if (i != 2) {
                if (!this.geometryUpdated) {
                  this.mesh.material[i] = null;
                } else {
                  allNeighbours = false;
                };
              };
            };
          };
        } else {
          allNeighbours = false;
        };
      } else {
        allNeighbours = false;
      };
    });
    if (allNeighbours) {
      this.removeMeshFromScene();
    };

  };

  self.onGravityUpdate = false;
  self.updateGravity = function() {
    if (this.config.gravity) {
      if (!this.onGravityUpdate) {
        if (this.mapCeil.crossNeighbors[3]) {
          if (this.mapCeil.crossNeighbors[3].contant === null) {
            this.onGravityUpdate = true;
            const lastMapCeil = this.mapCeil;
            const futureMapCeil = this.mapCeil.crossNeighbors[3];
            this.mapCeil = futureMapCeil;
            MAIN.game.world.map.moveBlock(lastMapCeil, futureMapCeil);
            this.setPosition({
              x: this.position.x,
              y: this.position.y - 1,
              z: this.position.z
            });


            const gravitySpeed = .2;
            let gravityShift = 0;
            const gravityShiftMax = 1 / gravitySpeed;

            const that = this;

            function moveMesh() {
              gravityShift++;
              that.mesh.position.y -= gravitySpeed;
              that.mouseBox.position.y -= gravitySpeed;
              if (gravityShift != gravityShiftMax) {
                setTimeout(function() {
                  moveMesh();
                })
              } else {
                that.onGravityUpdate = false;
                that.updateGravity();
              };
            };
            moveMesh();
          };
        };

      };
    };
  };



  self.removeLiquidBlock = function(){
    
  };

  self.updateLiquidPhysics = async function() {

    let needUpdate = [];
    let onlyGeometryUpdate = [];

    function addWaterBlock(mapCeil, blockConfig) {
      function add() {
        const block = get(blockConfig.liquidType);
        block.setPosition(mapCeil.position);
        block.waterfall = blockConfig.waterfall;
        block.fluidity = blockConfig.fluidity;


        MAIN.game.world.map.addBlock(block, true);
        if (!onlyGeometryUpdate.includes(mapCeil)) {
          onlyGeometryUpdate.push(mapCeil);
        };
        mapCeil.closeNeighbors.forEach((neighbour, i) => {
          if (neighbour) {
            if (neighbour.contant) {
              if (neighbour.contant.config.liquid && neighbour.contant.config.liquidType === blockConfig.liquidType) {
                if (!onlyGeometryUpdate.includes(neighbour)) {
                  onlyGeometryUpdate.push(neighbour)
                };
              };
            };
          };
        });
      };

      if (mapCeil.contant === null) {
        add();
      } else {
        if (mapCeil.contant.config.destroyedByWater) {
          MAIN.game.world.map.removeBlock(mapCeil.contant, true);
          mapCeil.crossNeighbors.forEach((neighbour, i) => {
            if (neighbour) {
              if (neighbour.contant) {
                neighbour.contant.updateInvisibleFaces();
              };
            };
          });
          add();
        };

        if (mapCeil.contant.config.liquid && mapCeil.contant.config.liquidType === blockConfig.liquidType) {
            if(mapCeil.contant.fluidity <= blockConfig.fluidity){
                mapCeil.contant.fluidity = blockConfig.fluidity;
                mapCeil.contant.waterfall = blockConfig.waterfall;
            };

            if (!onlyGeometryUpdate.includes(mapCeil)) {
              onlyGeometryUpdate.push(mapCeil);
            };

              mapCeil.closeNeighbors.forEach((neighbour, i) => {
                if (neighbour) {
                  if (neighbour.contant) {
                    if (neighbour.contant.config.liquid && neighbour.contant.config.liquidType === blockConfig.liquidType) {
                      if (!onlyGeometryUpdate.includes(neighbour)) {
                        onlyGeometryUpdate.push(neighbour);
                      };
                    };
                  };
                };
              });

          // if (mapCeil.contant.fluidity < blockConfig.fluidity || mapCeil.contant.waterfall != blockConfig.waterfall) {
          //
          //   if (mapCeil.contant.fluidity != 8) {
          //     mapCeil.contant.fluidity = blockConfig.fluidity;
          //     mapCeil.contant.waterfall = blockConfig.waterfall;
          //   };
          //
          //   if (!onlyGeometryUpdate.includes(mapCeil)) {
          //     onlyGeometryUpdate.push(mapCeil);
          //   };
          //   mapCeil.closeNeighbors.forEach((neighbour, i) => {
          //     if (neighbour) {
          //       if (neighbour.contant) {
          //         if (neighbour.contant.config.liquid && neighbour.contant.config.liquidType === blockConfig.liquidType) {
          //           if (!onlyGeometryUpdate.includes(neighbour)) {
          //             onlyGeometryUpdate.push(neighbour);
          //           };
          //         };
          //       };
          //     };
          //   });
          // };
        };
      };
    };




    if (this.config.liquid) {

      //ищем есть ли сосед с бóльшим значением воды, потому что если нет, то надо убирать
      let haveNeighbourWithGreaterFluidity = false;
      if (this.fluidity === 8) {
        //если сам является истоком, то убирать не надо
        haveNeighbourWithGreaterFluidity = true;
      } else {
        if (this.waterfall) {
          if (this.mapCeil.crossNeighbors[2]) {
            if (this.mapCeil.crossNeighbors[2].contant) {
              if (this.mapCeil.crossNeighbors[2].contant.config.liquid && this.mapCeil.crossNeighbors[2].contant.config.liquidType === this.config.liquidType) {
                //если он водопад и сверху есть вода
                haveNeighbourWithGreaterFluidity = true;
              };
            };
          };
        } else {
          let sourcesNumbers = 0;
          this.mapCeil.crossNeighbors.forEach((neighbour, i) => {
            if (i != 3 && i != 2) {
              if (neighbour) {
                if (neighbour.contant) {
                  if (neighbour.contant.config.liquid && neighbour.contant.config.liquidType === this.config.liquidType) {
                    if (neighbour.contant.fluidity > this.fluidity) {
                      haveNeighbourWithGreaterFluidity = true;
                    };
                    if (neighbour.contant.fluidity === 8) {
                      sourcesNumbers++;
                    };
                  };
                };
              };
            };
          });
          if (sourcesNumbers > 1) {
            this.fluidity = 8;
          };
        };
      };

      //после проверки на убрать/добавить воду, проверяем соседей


      needUpdate.isContain = function(mapCeil) {
        for (let i = 0; i < needUpdate.length; i++) {
          if (needUpdate[i][0].id === mapCeil.id) {
            return i;
          };
        };
        return false;
      };








      const that = this;
      async function checkNeighbours(that) {
        //сразу проверяем нижнего
        if (that.mapCeil.crossNeighbors[3]) {
          if (that.mapCeil.crossNeighbors[3].contant === null) {
            const needUpdateContain = needUpdate.isContain(that.mapCeil.crossNeighbors[3]);
            if (needUpdateContain === false) {
              needUpdate.push([that.mapCeil.crossNeighbors[3], {
                waterfall: true,
                fluidity: 7,
                liquidType: that.config.liquidType
              }]);
            }else{
              needUpdate[needUpdateContain][1] = {
                waterfall: true,
                fluidity: 7,
                liquidType: that.config.liquidType
              };
            };
          } else {
            if (that.mapCeil.crossNeighbors[3].contant.config.destroyedByWater) {
              const needUpdateContain = needUpdate.isContain(that.mapCeil.crossNeighbors[3]);
              if (needUpdateContain === false) {
                needUpdate.push([that.mapCeil.crossNeighbors[3], {
                  waterfall: true,
                  fluidity: 7,
                  liquidType: that.config.liquidType
                }]);
              }else{
                needUpdate[needUpdateContain][1] = {
                  waterfall: true,
                  fluidity: 7,
                  liquidType: that.config.liquidType
                };
              };
            };
            if (that.mapCeil.crossNeighbors[3].contant.config.liquid && that.mapCeil.crossNeighbors[3].contant.config.liquidType === that.config.liquidType) {
              const needUpdateContain = needUpdate.isContain(that.mapCeil.crossNeighbors[3]);

              if (needUpdateContain === false) {
                needUpdate.push([that.mapCeil.crossNeighbors[3], {
                  waterfall: true,
                  fluidity: 7,
                  liquidType: that.config.liquidType,
                }]);
              }else{
                needUpdate[needUpdateContain][1] = {
                  waterfall: true,
                  fluidity: 7,
                  liquidType: that.config.liquidType
                };
              };
            };
          };
        };

        if (that.fluidity > 1) {
          //разлив воды
          function check() {
            that.mapCeil.crossNeighbors.forEach((neighbour, i) => {
              if (i != 3 && i != 2) {
                if (neighbour) {
                  if (neighbour.contant === null) {
                    if (!needUpdate.isContain(neighbour)) {
                      needUpdate.push([neighbour, {
                        waterfall: false,
                        fluidity: that.fluidity - 1,
                        liquidType: that.config.liquidType
                      }]);
                    };
                  } else {
                    if (neighbour.contant.config.destroyedByWater) {
                      if (!needUpdate.isContain(neighbour)) {
                        needUpdate.push([neighbour, {
                          waterfall: false,
                          fluidity: that.fluidity - 1,
                          liquidType: that.config.liquidType
                        }]);
                      };
                    };
                    if (neighbour.contant.config.liquid && neighbour.contant.config.liquidType === that.config.liquidType) {
                      if (neighbour.contant.fluidity < that.fluidity - 1) {
                        if (!needUpdate.isContain(neighbour)) {
                          needUpdate.push([neighbour, {
                            waterfall: false,
                            fluidity: that.fluidity - 1,
                            liquidType: that.config.liquidType
                          }]);
                        };
                      };
                    };
                  };
                };
              };
            });
          };
          //при истоке разлив воды во все стороны
          if (that.fluidity === 8) {
            check();
          } else {
            //если не исток, то вода разливается только если внизу твердый блок
            if (that.mapCeil.crossNeighbors[3]) {
              if (that.mapCeil.crossNeighbors[3].contant) {
                if (!that.mapCeil.crossNeighbors[3].contant.config.destroyedByWater && !that.mapCeil.crossNeighbors[3].contant.config.liquid) {
                  check();
                };
              };
            };
          };
        };
        return 'result';
      };




      if (haveNeighbourWithGreaterFluidity) {
        async function addChildBlocks() {
          let promise = new Promise((resolve, reject) => {
            setTimeout(function() {
              for (let i = 0; i < needUpdate.length; i++) {
                addWaterBlock(needUpdate[i][0], needUpdate[i][1]);
              };

              for (let i = 0; i < onlyGeometryUpdate.length; i++) {
                onlyGeometryUpdate[i].contant.updateGeometry();
                onlyGeometryUpdate[i].contant.updateInvisibleFaces();
              };

              onlyGeometryUpdate.length = 0;
              resolve('childs added');
            }, 150)
          });

          let result = await promise;

          return result;
        };


        async function checkChilds() {
          const childs = [...needUpdate];
          needUpdate.forEach((item, i) => {
            onlyGeometryUpdate.push(item[0]);
          });

          needUpdate.length = 0;
          let childIndex = -1;
          async function check() {
            childIndex++;
            if (childIndex < childs.length) {
              checkNeighbours(childs[childIndex][0].contant).then(result => {
                if (result) {
                  check();
                };
              });
            } else {
              loop();
            };
          };

          check();
        };

        async function loop() {
          if (needUpdate.length > 0) {
            addChildBlocks().then(res => {
              if (res) {
                checkChilds();
              };
            });
          } else {
            // console.log('stop')
          }
        }


        checkNeighbours(that).then(result => {
          if (result) {
            loop();
          };
        });
      };
    };

  };



  self.updateGeometry = function() {
    const that = this;
    if (this.config.liquid) {
      this.mesh.geometry = new THREE.BoxBufferGeometry(1, 1, 1);
      if (this.fluidity === 8) {

        if (this.mapCeil.crossNeighbors[2]) {
          if (this.mapCeil.crossNeighbors[2].contant === null) {
            updateWaterBlockGeometryByCorners(this, -0.1, -0.1, -0.1, -0.1);
            this.geometryUpdated = true;
          } else {
            if (this.mapCeil.crossNeighbors[2].contant.config.liquid) {
              this.geometryUpdated = false;
            } else {
              updateWaterBlockGeometryByCorners(this, -0.1, -0.1, -0.1, -0.1);
              this.geometryUpdated = true;
            }
          }
        } else {
          updateWaterBlockGeometryByCorners(this, -0.1, -0.1, -0.1, -0.1);
          this.geometryUpdated = true;
        };
      } else {
        let c_0, c_1, c_2, c_3;
        let f_0, f_1, f_2, f_3;

        f_0 = f_1 = f_2 = f_3 = this.fluidity;

        const mapCeil = this.mapCeil;
        const neighbours = mapCeil.crossNeighbors;

        neighbours.forEach((neighbour, i) => {
          if (neighbour) {
            if (neighbour.contant) {
              if (neighbour.contant.config.liquid) {
                if (i === 1) {
                  if (neighbour.contant.fluidity > f_0) {
                    if (neighbour.contant.waterfall) {
                      f_0 = 9;
                    } else {
                      f_0 = neighbour.contant.fluidity;
                    }
                  };
                  if (neighbour.contant.fluidity > f_3) {
                    if (neighbour.contant.waterfall) {
                      f_3 = 9;
                    } else {
                      f_3 = neighbour.contant.fluidity;
                    };
                  };
                };

                if (i === 5) {
                  if (neighbour.contant.fluidity > f_0) {
                    if (neighbour.contant.waterfall) {
                      f_0 = 9;
                    } else {
                      f_0 = neighbour.contant.fluidity;
                    }
                  };
                  if (neighbour.contant.fluidity > f_1) {
                    if (neighbour.contant.waterfall) {
                      f_1 = 9;
                    } else {
                      f_1 = neighbour.contant.fluidity;
                    };
                  };
                };

                if (i === 0) {
                  if (neighbour.contant.fluidity > f_1) {
                    if (neighbour.contant.waterfall) {
                      f_1 = 9;
                    } else {
                      f_1 = neighbour.contant.fluidity;
                    };
                  };
                  if (neighbour.contant.fluidity > f_2) {
                    if (neighbour.contant.waterfall) {
                      f_2 = 9;
                    } else {
                      f_2 = neighbour.contant.fluidity;
                    };
                  };
                };

                if (i === 4) {
                  if (neighbour.contant.fluidity > f_2) {
                    if (neighbour.contant.waterfall) {
                      f_2 = 9;
                    } else {
                      f_2 = neighbour.contant.fluidity;
                    };
                  };
                  if (neighbour.contant.fluidity > f_3) {
                    if (neighbour.contant.waterfall) {
                      f_3 = 9;
                    } else {
                      f_3 = neighbour.contant.fluidity;
                    };
                  };
                };
              };
            };
          };
        });





        //diagonalNeighbours
        if (mapCeil.closeNeighbors[9]) {
          if (mapCeil.closeNeighbors[9].contant) {
            if (mapCeil.closeNeighbors[9].contant.config.liquid) {


              //если он окружен соседями не водой, то не надо обращать внимания
              if (mapCeil.crossNeighbors[1]) {
                if (mapCeil.crossNeighbors[1].contant) {
                  if (mapCeil.crossNeighbors[1].contant.config.liquid) {
                    if (mapCeil.closeNeighbors[9].contant.fluidity > f_0) {
                      f_0 = mapCeil.closeNeighbors[9].contant.fluidity;
                      if (mapCeil.closeNeighbors[9].contant.waterfall) {
                        f_0 = 9;
                      }
                    };
                  };
                };
              };
              if (mapCeil.crossNeighbors[5]) {
                if (mapCeil.crossNeighbors[5].contant) {
                  if (mapCeil.crossNeighbors[5].contant.config.liquid) {
                    if (mapCeil.closeNeighbors[9].contant.fluidity > f_0) {
                      f_0 = mapCeil.closeNeighbors[9].contant.fluidity;
                      if (mapCeil.closeNeighbors[9].contant.waterfall) {
                        f_0 = 9;
                      }
                    };
                  };
                };
              };
            };
          };
        };

        if (mapCeil.closeNeighbors[11]) {
          if (mapCeil.closeNeighbors[11].contant) {
            if (mapCeil.closeNeighbors[11].contant.config.liquid) {

              if (mapCeil.crossNeighbors[0]) {
                if (mapCeil.crossNeighbors[0].contant) {
                  if (mapCeil.crossNeighbors[0].contant.config.liquid) {
                    if (mapCeil.closeNeighbors[11].contant.fluidity > f_1) {
                      f_1 = mapCeil.closeNeighbors[11].contant.fluidity;
                      if (mapCeil.closeNeighbors[11].contant.waterfall) {
                        f_1 = 9;
                      };
                    };
                  };
                };
              };
              if (mapCeil.crossNeighbors[5]) {
                if (mapCeil.crossNeighbors[5].contant) {
                  if (mapCeil.crossNeighbors[5].contant.config.liquid) {
                    if (mapCeil.closeNeighbors[11].contant.fluidity > f_1) {
                      f_1 = mapCeil.closeNeighbors[11].contant.fluidity;
                      if (mapCeil.closeNeighbors[11].contant.waterfall) {
                        f_1 = 9;
                      };
                    };
                  };
                };
              };
            };
          };
        };

        if (mapCeil.closeNeighbors[16]) {
          if (mapCeil.closeNeighbors[16].contant) {
            if (mapCeil.closeNeighbors[16].contant.config.liquid) {

              if (mapCeil.crossNeighbors[0]) {
                if (mapCeil.crossNeighbors[0].contant) {
                  if (mapCeil.crossNeighbors[0].contant.config.liquid) {
                    if (mapCeil.closeNeighbors[16].contant.fluidity > f_2) {
                      f_2 = mapCeil.closeNeighbors[16].contant.fluidity;
                      if (mapCeil.closeNeighbors[16].contant.waterfall) {
                        f_2 = 9;
                      };
                    };
                  };
                };
              };
              if (mapCeil.crossNeighbors[4]) {
                if (mapCeil.crossNeighbors[4].contant) {
                  if (mapCeil.crossNeighbors[4].contant.config.liquid) {
                    if (mapCeil.closeNeighbors[16].contant.fluidity > f_2) {
                      f_2 = mapCeil.closeNeighbors[16].contant.fluidity;
                      if (mapCeil.closeNeighbors[16].contant.waterfall) {
                        f_2 = 9;
                      };
                    };
                  };
                };
              };
            };
          };
        };

        if (mapCeil.closeNeighbors[14]) {
          if (mapCeil.closeNeighbors[14].contant) {
            if (mapCeil.closeNeighbors[14].contant.config.liquid) {

              if (mapCeil.crossNeighbors[1]) {
                if (mapCeil.crossNeighbors[1].contant) {
                  if (mapCeil.crossNeighbors[1].contant.config.liquid) {
                    if (mapCeil.closeNeighbors[14].contant.fluidity > f_3) {
                      f_3 = mapCeil.closeNeighbors[14].contant.fluidity;
                      if (mapCeil.closeNeighbors[14].contant.waterfall) {
                        f_3 = 9;
                      };
                    };
                  };
                };
              };
              if (mapCeil.crossNeighbors[4]) {
                if (mapCeil.crossNeighbors[4].contant) {
                  if (mapCeil.crossNeighbors[4].contant.config.liquid) {
                    if (mapCeil.closeNeighbors[14].contant.fluidity > f_3) {
                      f_3 = mapCeil.closeNeighbors[14].contant.fluidity;
                      if (mapCeil.closeNeighbors[14].contant.waterfall) {
                        f_3 = 9;
                      };
                    };
                  };
                };
              };
            };
          };
        };

        if (this.waterfall) {
          f_0 = f_1 = f_2 = f_3 = 9;
        }

        c_0 = -0.1 * (9 - f_0);
        c_1 = -0.1 * (9 - f_1);
        c_2 = -0.1 * (9 - f_2);
        c_3 = -0.1 * (9 - f_3);


        updateWaterBlockGeometryByCorners(this, c_0, c_1, c_2, c_3);
        this.geometryUpdated = true;


        updateWaterBlockBottomGeometry(this, -0.1);
      };
    };
  };

  self.update = function() {
    this.updateGeometry();
    this.updateLiquidPhysics();
    this.updateInvisibleFaces();
    this.updateShadow();
    this.updateGravity();


  };
  return self;

};









const BLOCK = {
  get,
};

export {
  BLOCK
}
