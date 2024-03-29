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



function updateLiquidBlockGeometryByCorners(block, corner0, corner1, corner2, corner3) {
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

function updateLiquidBlockBottomGeometry(block, value) {
  const geometry = block.mesh.geometry;
  const standartGeometry = [...geometry.attributes.position.array];


  if (block.mapCeil.crossNeighbors[3]) {
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

};

function get(name) {
  const self = {
    name,
  }

  self.config = BLOCKS_BASE[name];

  self.setPosition = function(position) {
    this.position = position;
  };
  self.rotateBlock = function(rotationConfig) {
    this.rotationConfig = rotationConfig;
  };

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

    if (this.meshAddedToScene) {
      this.meshAddedToScene = false;
      this.mouseBox.parent.remove(this.mouseBox);
      this.mesh.parent.remove(this.mesh);
    };
  };



  self.updateShadow = async function() {
    if (this.mesh.geometry.attributes.vertexShadow) {
      const mapCeil = this.mapCeil;
      const allCorners = []
      for (let sideIndex = 0; sideIndex < 6; sideIndex++) {
        let sideCorners = [];
        const neighbours = mapCeil.neighborsBySide[sideIndex];

        //corners:
        //0   1
        //2   3;
        sideCorners = [0, 0, 0, 0];

        const neighboursLightValues = [];
        neighbours.forEach((neighbour, i) => {
          if (neighbour) {
            neighboursLightValues.push(neighbour.lightValue)
          } else {
            //тень для блоков у края карты
            neighboursLightValues.push(5);
          }
        });




        if(!this.config.lightBlock){
          for (let corner = 0; corner < 4; corner++) {
            let neighbour_1_indx, neighbour_2_indx, neighbour_corner_indx;
            switch (corner) {
              case 0:
                neighbour_1_indx = 7;
                neighbour_2_indx = 1;
                neighbour_corner_indx = 0;
                break;
              case 1:
                neighbour_1_indx = 1;
                neighbour_2_indx = 3;
                neighbour_corner_indx = 2;
                break;
              case 2:
                neighbour_1_indx = 5;
                neighbour_2_indx = 7;
                neighbour_corner_indx = 6;
                break;
              case 3:
                neighbour_1_indx = 3;
                neighbour_2_indx = 5;
                neighbour_corner_indx = 4;
                break;
            };
            // если два соседа по краям, то не учитывать углового
            if (neighbours[neighbour_1_indx] && neighbours[neighbour_2_indx]) {
              if (neighbours[neighbour_1_indx].contant && neighbours[neighbour_2_indx].contant) {
                if (neighbours[neighbour_1_indx].contant.config.transparent === 0 && neighbours[neighbour_2_indx].contant.config.transparent === 0) {
                  //(*3) чтобы тень не была такой явной
                  sideCorners[corner] = Math.round((neighboursLightValues[8]*3 + neighboursLightValues[neighbour_1_indx] + neighboursLightValues[neighbour_2_indx]) / 5);
                  continue;
                };
              };
            };
            //(*3) чтобы тень не была такой явной
            sideCorners[corner] = Math.round((neighboursLightValues[8]*3 + neighboursLightValues[neighbour_1_indx] + neighboursLightValues[neighbour_2_indx] + neighboursLightValues[neighbour_corner_indx]) / 6);
          };
        }else{
          //if (this.config.lightBlock)
          //для светящихся блоков не надо угловые тени
          sideCorners = [15, 15, 15, 15];
        };

        sideCorners.forEach((lightValue, i) => {
          allCorners.push(lightValue)
        });
      };

      allCorners.forEach((value, i) => {
        //обрубаем лишние запятые и нормализируем
        value = Math.round(value / 15 * 100) / 100;
        const array = this.mesh.geometry.attributes.vertexShadow.array;
        array[i * 3] = value;
        array[i * 3 + 1] = value;
        array[i * 3 + 2] = value;
      });
      this.mesh.geometry.attributes.vertexShadow.needsUpdate = true;
    };

    return true;
  };

  self.updateInvisibleFaces = function() {
    this.mesh.material = this.rotateSidesTextures();
    let allNeighbours = true;
    if (!this.meshAddedToScene) {
      this.addMeshToScene();
    };
    this.mapCeil.crossNeighbors.forEach((neighbour, i) => {
      if (neighbour != null) {
        if (neighbour.contant) {

          //для обычных блоков
          if (this.config.geometry === 0 && this.config.transparent === 0) {
            //если сосед такой же
            if (neighbour.contant.config.geometry === 0 && neighbour.contant.config.transparent === 0) {
              //чтобы не схватывал блок в полете
              if (neighbour.contant.config.gravity) {
                if (!neighbour.contant.onGravityUpdate) {
                  this.mesh.material[i] = null;
                };
              } else {
                this.mesh.material[i] = null;
              };
            };
            //если сосед прозрачный
            if (neighbour.contant.config.transparent != 0) {
              allNeighbours = false;
            };

            //если у соседа сложная геометрия
            if (neighbour.contant.config.geometry != 0) {
              allNeighbours = false;
            };
          };


          //для воды
          if (this.config.liquidType === 'water') {
            //если сосед обычный блок
            if (neighbour.contant.config.geometry === 0 && neighbour.contant.config.transparent === 0) {
              if (!this.geometryUpdated) {
                //чтобы не схватывал блок в полете

                if (neighbour.contant.config.gravity) {
                  if (!neighbour.contant.onGravityUpdate) {
                    this.mesh.material[i] = null;
                  };
                } else {
                  this.mesh.material[i] = null;
                };
              } else {
                allNeighbours = false;
              };
            };

            //если сосед тоже вода
            if (neighbour.contant.config.liquid) {
              if (neighbour.contant.config.liquidType === 'water') {
                this.mesh.material[i] = null;
              };
            };
          };


          if (this.config.liquidType === 'lava') {
            //если сосед обычный блок
            if (neighbour.contant.config.geometry === 0 && neighbour.contant.config.transparent === 0) {
              if (!this.geometryUpdated) {
                //чтобы не схватывал блок в полете
                if (neighbour.contant.config.gravity) {
                  if (!neighbour.contant.onGravityUpdate) {
                    this.mesh.material[i] = null;
                  };
                } else {
                  this.mesh.material[i] = null;
                };
              } else {
                allNeighbours = false;
              };
            };

            //если сосед тоже лава
            if (neighbour.contant.config.liquid) {
              if (neighbour.contant.config.liquidType === 'lava') {
                this.mesh.material[i] = null;
              };
            };
          };



          if (this.config.transparent === 2) {
            if (neighbour.contant.config.transparent != 0) {
              allNeighbours = false;
            };
          };
        } else {
          //если сосед воздух
          allNeighbours = false;
        };
      } else {
        //если сосед за пределом карты
        allNeighbours = false;
      };
    });
    if (allNeighbours) {
      this.removeMeshFromScene();
    };

  };

  self.onGravityUpdate = false;
  self.updatedGravityPosition = false;
  self.gravityReplacedBlock = null;
  self.mapCeilBeforeGravityUpdate_updated = false;
  self.updateGravity = function() {
    const gravitySpeed = .2;
    let gravityShift = 0;
    const gravityShiftMax = 1 / gravitySpeed;

    const that = this;

    if (this.config.gravity) {
      if (!this.onGravityUpdate) {

        if (this.mapCeil.crossNeighbors[3]) {
          if (this.mapCeil.crossNeighbors[3].contant === null || this.mapCeil.crossNeighbors[3].contant.config.liquid) {
            this.onGravityUpdate = true;

            this.updatedGravityPosition = true;
            const lastMapCeil = this.mapCeil;
            const futureMapCeil = this.mapCeil.crossNeighbors[3];
            this.mapCeil = futureMapCeil;

            let nextGravityReplacedBlock = MAIN.game.world.map.moveBlock(lastMapCeil, futureMapCeil);



            if (this.gravityReplacedBlock) {
              if (this.gravityReplacedBlock.mapCeil.contant === null) {
                this.gravityReplacedBlock.mapCeil.contant = this.gravityReplacedBlock;
                this.gravityReplacedBlock.addMeshToScene();
              };
            };
            if (nextGravityReplacedBlock) {
              if (nextGravityReplacedBlock.mapCeil.crossNeighbors[2]) {
                if (nextGravityReplacedBlock.mapCeil.crossNeighbors[2].contant === null) {
                  nextGravityReplacedBlock.pushLiqudParticles();
                };
              };
            };

            this.gravityReplacedBlock = nextGravityReplacedBlock;
            this.setPosition({
              x: this.position.x,
              y: this.position.y - 1,
              z: this.position.z
            });

            function moveMesh() {
              gravityShift++;
              that.mesh.position.y -= gravitySpeed;
              that.mouseBox.position.y -= gravitySpeed;

              if (gravityShift === Math.round(gravityShiftMax / 2)) {
                if (that.mapCeilBeforeGravityUpdate_updated === false) {
                  that.mapCeilBeforeGravityUpdate_updated = true;
                  lastMapCeil.findLightValue();
                  lastMapCeil.closeNeighbors.update();
                };
              };

              if (gravityShift != gravityShiftMax) {
                requestAnimationFrame(function() {
                  moveMesh();
                });
              } else {
                that.onGravityUpdate = false;
                that.updateGravity();
              };
            };
            moveMesh();
          } else {
            if (this.updatedGravityPosition) {
              this.updatedGravityPosition = false;
              this.mapCeilBeforeGravityUpdate_updated = false;
              MAIN.game.world.recalculateAmbientLight();
              this.mapCeil.closeNeighbors.update({
                shadow: true,
                faces: true,
                liquid: true
              });
              this.onGravityUpdate = false;
              this.update();
            };
          };
        } else {
          if (this.updatedGravityPosition) {
            this.updatedGravityPosition = false;
            this.mapCeilBeforeGravityUpdate_updated = false;
            MAIN.game.world.recalculateAmbientLight();
            this.mapCeil.closeNeighbors.update({
              shadow: true,
              faces: true,
              liquid: true
            });
            this.onGravityUpdate = false;
            this.update();
          };
        }
      };
    };
  };

  self.removeLiquidBlock = function() {
    if (this.config.liquid) {
      if (this.config.liquidType === 'water') {
        let haveNeighbourWithGreaterFluidity = false;
        let greaterFluidityValue = 0;
        let neighbourWithGreaterFluidity = null;


        this.mapCeil.crossNeighbors.forEach((neighbour, i) => {
          if (neighbour) {
            if (neighbour.contant) {
              if (neighbour.contant.config.liquid && neighbour.contant.config.liquidType === this.config.liquidType) {
                if (i != 3) {
                  if (this.fluidity === 8) {
                    if (neighbour.contant.fluidity === 8) {
                      haveNeighbourWithGreaterFluidity = true;
                      if (neighbour.contant.fluidity > greaterFluidityValue) {
                        greaterFluidityValue = neighbour.contant.fluidity;
                        neighbourWithGreaterFluidity = neighbour;
                      };

                    }
                  } else {
                    if (neighbour.contant.fluidity > this.fluidity) {
                      haveNeighbourWithGreaterFluidity = true;
                      if (neighbour.contant.fluidity > greaterFluidityValue) {
                        greaterFluidityValue = neighbour.contant.fluidity;
                        neighbourWithGreaterFluidity = neighbour;
                      };
                    };
                  };
                };
              };
            };
          };
        });
        if (haveNeighbourWithGreaterFluidity) {
          this.mapCeil.contant = null;
          this.removeMeshFromScene();
          this.mapCeil.crossNeighbors.forEach((neighbour, i) => {
            if (neighbour) {
              if (neighbour.contant) {
                if (neighbour.contant.config.liquid && neighbour.contant.config.liquidType === this.config.liquidType) {
                  neighbour.contant.updateGeometry();
                  neighbour.contant.updateInvisibleFaces();
                };
              };
            };
          });
          setTimeout(function() {
            if (neighbourWithGreaterFluidity.contant) {
              neighbourWithGreaterFluidity.contant.update();
            }
          }, 250);
        } else {
          this.mapCeil.contant = null;
          if (this.removeMeshFromScene) {
            this.removeMeshFromScene();
          }

          const neighboursToRemove = [];
          const copyBlocks = [];
          const blocksWithGreaterValue = [];





          this.mapCeil.crossNeighbors.forEach((neighbour, i) => {
            if (neighbour) {
              if (neighbour.contant) {
                if (neighbour.contant.config.liquid && neighbour.contant.config.liquidType === this.config.liquidType) {
                  if (i != 3) {
                    if (neighbour.contant.fluidity < this.fluidity) {
                      neighbour.contant.updateGeometry();
                      neighbour.contant.updateInvisibleFaces();
                      if (!neighboursToRemove.includes(neighbour)) {
                        neighboursToRemove.push(neighbour);
                      }

                    } else {
                      if (!blocksWithGreaterValue.includes(neighbour.contant)) {
                        blocksWithGreaterValue.push(neighbour.contant)
                      };
                    };
                  } else {
                    if (neighbour.contant.waterfall) {
                      neighbour.contant.updateGeometry();
                      neighbour.contant.updateInvisibleFaces();
                      if (!neighboursToRemove.includes(neighbour)) {
                        neighboursToRemove.push(neighbour);
                      }
                    } else {
                      neighbour.contant.updateGeometry();
                      neighbour.contant.updateInvisibleFaces();
                    }
                  };

                };
              };
            };
          });

          async function loop() {
            if (neighboursToRemove.length > 0) {
              setTimeout(function() {
                removeChilds().then(result => {
                  if (result) {
                    MAIN.game.world.recalculateAmbientLight();
                    checkChilds().then(res => {
                      if (res) {
                        loop();
                      };
                    });
                  };
                });
              }, 150)
            } else {
              if (blocksWithGreaterValue.length > 0) {
                blocksWithGreaterValue.forEach((block, i) => {
                  if (block.mapCeil.contant) {
                    block.update();
                  };
                });
              };
            };
          };

          async function removeChilds() {
            copyBlocks.length = 0;
            let childIndex = -1;

            function removeBlock() {
              childIndex++;
              if (childIndex < neighboursToRemove.length) {
                copyBlocks.push(neighboursToRemove[childIndex].contant);
                neighboursToRemove[childIndex].contant.removeMeshFromScene();
                neighboursToRemove[childIndex].contant = null;
                return removeBlock();
              } else {
                return true;
              }
            };
            return removeBlock();
          };

          async function checkChilds() {
            const copy = [...neighboursToRemove];
            neighboursToRemove.length = 0;
            let childIndex = -1;

            function check() {
              childIndex++;
              if (childIndex < copy.length) {
                const mapCeil = copy[childIndex];
                const that = copyBlocks[childIndex];
                mapCeil.crossNeighbors.forEach((neighbour, i) => {
                  if (neighbour) {
                    if (neighbour.contant) {
                      if (neighbour.contant.config.liquid && neighbour.contant.config.liquidType === that.config.liquidType) {
                        if (i != 3) {
                          if (neighbour.contant.fluidity < that.fluidity) {
                            neighbour.contant.updateGeometry();
                            neighbour.contant.updateInvisibleFaces();
                            if (!neighboursToRemove.includes(neighbour)) {
                              neighboursToRemove.push(neighbour);
                            }
                          } else {
                            if (!blocksWithGreaterValue.includes(neighbour.contant)) {
                              blocksWithGreaterValue.push(neighbour.contant)
                            };
                          };
                        } else {
                          if (neighbour.contant.waterfall) {
                            neighbour.contant.updateGeometry();
                            neighbour.contant.updateInvisibleFaces();
                            if (!neighboursToRemove.includes(neighbour)) {
                              neighboursToRemove.push(neighbour);
                            }
                          } else {
                            neighbour.contant.updateGeometry();
                            neighbour.contant.updateInvisibleFaces();
                          };
                        };
                      };
                    };
                  };
                });
                return check();
              } else {
                return true;
              };
            };
            return check();
          };
          loop();
        };
      };

      if (this.config.liquidType === 'lava') {
        let haveNeighbourWithGreaterFluidity = false;
        let greaterFluidityValue = 0;
        let neighbourWithGreaterFluidity = null;


        this.mapCeil.crossNeighbors.forEach((neighbour, i) => {
          if (neighbour) {
            if (neighbour.contant) {
              if (neighbour.contant.config.liquid && neighbour.contant.config.liquidType === this.config.liquidType) {
                if (i != 3) {
                  if (this.fluidity === 4) {
                    if (neighbour.contant.fluidity === 4) {
                      haveNeighbourWithGreaterFluidity = true;
                      if (neighbour.contant.fluidity > greaterFluidityValue) {
                        greaterFluidityValue = neighbour.contant.fluidity;
                        neighbourWithGreaterFluidity = neighbour;
                      };

                    }
                  } else {
                    if (neighbour.contant.fluidity > this.fluidity) {
                      haveNeighbourWithGreaterFluidity = true;
                      if (neighbour.contant.fluidity > greaterFluidityValue) {
                        greaterFluidityValue = neighbour.contant.fluidity;
                        neighbourWithGreaterFluidity = neighbour;
                      };
                    };
                  };
                };
              };
            };
          };
        });
        if (haveNeighbourWithGreaterFluidity) {
          this.mapCeil.contant = null;
          this.removeMeshFromScene();
          this.mapCeil.crossNeighbors.forEach((neighbour, i) => {
            if (neighbour) {
              if (neighbour.contant) {
                if (neighbour.contant.config.liquid && neighbour.contant.config.liquidType === this.config.liquidType) {
                  neighbour.contant.updateGeometry();
                  neighbour.contant.updateInvisibleFaces();
                };
              };
            };
          });
          setTimeout(function() {
            if (neighbourWithGreaterFluidity.contant) {
              neighbourWithGreaterFluidity.contant.update();
            }
          }, 1500);
        } else {
          this.mapCeil.contant = null;
          if (this.removeMeshFromScene) {
            this.removeMeshFromScene();
          }

          const neighboursToRemove = [];
          const copyBlocks = [];
          const blocksWithGreaterValue = [];





          this.mapCeil.crossNeighbors.forEach((neighbour, i) => {
            if (neighbour) {
              if (neighbour.contant) {
                if (neighbour.contant.config.liquid && neighbour.contant.config.liquidType === this.config.liquidType) {
                  if (i != 3) {
                    if (neighbour.contant.fluidity < this.fluidity) {
                      neighbour.contant.updateGeometry();
                      neighbour.contant.updateInvisibleFaces();
                      if (!neighboursToRemove.includes(neighbour)) {
                        neighboursToRemove.push(neighbour);
                      }

                    } else {
                      if (!blocksWithGreaterValue.includes(neighbour.contant)) {
                        blocksWithGreaterValue.push(neighbour.contant)
                      };
                    };
                  } else {
                    if (neighbour.contant.waterfall) {
                      neighbour.contant.updateGeometry();
                      neighbour.contant.updateInvisibleFaces();
                      if (!neighboursToRemove.includes(neighbour)) {
                        neighbour.push(neighbour);
                      }
                    } else {
                      neighbour.contant.updateGeometry();
                      neighbour.contant.updateInvisibleFaces();
                    }
                  };

                };
              };
            };
          });

          async function loop() {
            if (neighboursToRemove.length > 0) {
              setTimeout(function() {
                removeChilds().then(result => {
                  if (result) {
                    MAIN.game.world.recalculateAmbientLight();
                    checkChilds().then(res => {
                      if (res) {
                        loop();
                      };
                    });
                  };
                });
              }, 1500)
            } else {
              if (blocksWithGreaterValue.length > 0) {
                blocksWithGreaterValue.forEach((block, i) => {
                  if (block.mapCeil.contant) {
                    block.update();
                  };
                });
              };
            };
          };

          async function removeChilds() {
            copyBlocks.length = 0;
            let childIndex = -1;

            function removeBlock() {
              childIndex++;
              if (childIndex < neighboursToRemove.length) {
                copyBlocks.push(neighboursToRemove[childIndex].contant);
                neighboursToRemove[childIndex].contant.removeMeshFromScene();
                neighboursToRemove[childIndex].contant = null;
                return removeBlock();
              } else {
                return true;
              }
            };
            return removeBlock();
          };

          async function checkChilds() {
            const copy = [...neighboursToRemove];
            neighboursToRemove.length = 0;
            let childIndex = -1;

            function check() {
              childIndex++;
              if (childIndex < copy.length) {
                const mapCeil = copy[childIndex];
                const that = copyBlocks[childIndex];
                mapCeil.crossNeighbors.forEach((neighbour, i) => {
                  if (neighbour) {
                    if (neighbour.contant) {
                      if (neighbour.contant.config.liquid && neighbour.contant.config.liquidType === that.config.liquidType) {
                        if (i != 3) {
                          if (neighbour.contant.fluidity < that.fluidity) {
                            neighbour.contant.updateGeometry();
                            neighbour.contant.updateInvisibleFaces();
                            if (!neighboursToRemove.includes(neighbour)) {
                              neighboursToRemove.push(neighbour);
                            }
                          } else {
                            if (!blocksWithGreaterValue.includes(neighbour.contant)) {
                              blocksWithGreaterValue.push(neighbour.contant)
                            };
                          };
                        } else {
                          if (neighbour.contant.waterfall) {
                            neighbour.contant.updateGeometry();
                            neighbour.contant.updateInvisibleFaces();
                            if (!neighboursToRemove.includes(neighbour)) {
                              neighboursToRemove.push(neighbour);
                            }
                          } else {
                            neighbour.contant.updateGeometry();
                            neighbour.contant.updateInvisibleFaces();
                          };
                        };
                      };
                    };
                  };
                });
                return check();
              } else {
                return true;
              };
            };
            return check();
          };
          loop();
        };
      };
    };


  };
  self.updateLiquidPhysics = async function() {

    if (this.config.liquid) {
      if (this.config.liquidType === 'water') {
        let needUpdate = [];
        needUpdate.isContain = function(mapCeil) {
          for (let i = 0; i < needUpdate.length; i++) {
            if (needUpdate[i][0].id === mapCeil.id) {
              return i;
            };
          };
          return false;
        };



        let onlyGeometryUpdate = [];

        function addWaterBlock(mapCeil, blockConfig) {
          function add() {
            const block = get(blockConfig.liquidType);
            block.setPosition(mapCeil.position);
            block.waterfall = blockConfig.waterfall;
            block.fluidity = blockConfig.fluidity;


            if (mapCeil.crossNeighbors[2]) {
              if (mapCeil.crossNeighbors[2].contant) {
                if (mapCeil.crossNeighbors[2].contant.config.liquid && mapCeil.crossNeighbors[2].contant.config.liquidType === blockConfig.liquidType) {
                  block.waterfall = true;
                  block.fluidity = 7;
                };
              };
            };

            MAIN.game.world.map.addBlock(block, true);
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
          };

          if (mapCeil.contant === null) {
            add();
          } else {
            if (mapCeil.contant.config.destroyedByLiquid) {
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
              if (mapCeil.contant.fluidity <= blockConfig.fluidity) {
                mapCeil.contant.fluidity = blockConfig.fluidity;
                mapCeil.contant.waterfall = blockConfig.waterfall;
              };
              if (mapCeil.crossNeighbors[2]) {
                if (mapCeil.crossNeighbors[2].contant) {
                  if (mapCeil.crossNeighbors[2].contant.config.liquid && mapCeil.crossNeighbors[2].contant.config.liquidType === blockConfig.liquidType) {
                    if (mapCeil.contant.fluidity != 8) {
                      mapCeil.contant.waterfall = true;
                      mapCeil.contant.fluidity = 7;
                    };
                  };
                };
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
                };
              } else {
                if (that.mapCeil.crossNeighbors[3].contant.config.destroyedByLiquid) {
                  const needUpdateContain = needUpdate.isContain(that.mapCeil.crossNeighbors[3]);
                  if (needUpdateContain === false) {
                    needUpdate.push([that.mapCeil.crossNeighbors[3], {
                      waterfall: true,
                      fluidity: 7,
                      liquidType: that.config.liquidType
                    }]);
                  };
                };
                if (that.mapCeil.crossNeighbors[3].contant.config.liquid && that.mapCeil.crossNeighbors[3].contant.config.liquidType === that.config.liquidType) {
                  if (that.mapCeil.crossNeighbors[3].contant.fluidity < 8) {
                    const needUpdateContain = needUpdate.isContain(that.mapCeil.crossNeighbors[3]);
                    if (needUpdateContain === false) {
                      needUpdate.push([that.mapCeil.crossNeighbors[3], {
                        waterfall: true,
                        fluidity: 7,
                        liquidType: that.config.liquidType,
                      }]);
                    };
                  };
                };
              };
            };

            if (that.fluidity > 1) {
              //разлив воды
              function check() {
                let sourcesNumbers = 0;
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
                        if (neighbour.contant.config.destroyedByLiquid) {
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
                          } else {
                            //bug fix
                            if (that.fluidity === 8) {
                              if (neighbour.contant.fluidity === 7) {
                                const needUpdateIndex = needUpdate.isContain(neighbour)
                                if (!needUpdateIndex) {
                                  needUpdate.push([neighbour, {
                                    waterfall: false,
                                    fluidity: that.fluidity - 1,
                                    liquidType: that.config.liquidType
                                  }]);
                                } else {
                                  needUpdate[needUpdateIndex][1] = {
                                    waterfall: false,
                                    fluidity: that.fluidity - 1,
                                    liquidType: that.config.liquidType,
                                  };
                                };
                              };
                            } else {
                              if (neighbour.contant.fluidity === 8) {
                                sourcesNumbers++;
                              };
                            };
                          };
                        };
                      };
                    };
                  };
                });
                //bug fux
                if (sourcesNumbers > 1) {
                  const needUpdateContain = needUpdate.isContain(that.mapCeil);
                  if (needUpdateContain === false) {
                    needUpdate.push([that.mapCeil, {
                      waterfall: false,
                      fluidity: 8,
                      liquidType: that.config.liquidType,
                    }]);
                  } else {
                    needUpdate[needUpdateContain][1] = {
                      waterfall: false,
                      fluidity: 8,
                      liquidType: that.config.liquidType,
                    };
                  };
                };
              };
              //при истоке разлив воды во все стороны
              if (that.fluidity === 8) {
                check();
              } else {
                //если не исток, то вода разливается только если внизу твердый блок
                if (that.mapCeil.crossNeighbors[3]) {
                  if (that.mapCeil.crossNeighbors[3].contant) {
                    if (!that.mapCeil.crossNeighbors[3].contant.config.destroyedByLiquid && !that.mapCeil.crossNeighbors[3].contant.config.liquid) {
                      check();
                    } else {
                      //баг при колодце в 2 блока.
                      let sourcesNumbers = 0;
                      that.mapCeil.crossNeighbors.forEach((neighbour, i) => {
                        if (i != 3 && i != 2) {
                          if (neighbour) {
                            if (neighbour.contant) {
                              if (neighbour.contant.config.liquid && neighbour.contant.config.liquidType === that.config.liquidType) {
                                if (neighbour.contant.fluidity === 8) {
                                  sourcesNumbers++;
                                };
                              };
                            };
                          };
                        };
                      });
                      if (sourcesNumbers > 1) {
                        const needUpdateContain = needUpdate.isContain(that.mapCeil);
                        if (needUpdateContain === false) {
                          needUpdate.push([that.mapCeil, {
                            waterfall: false,
                            fluidity: 8,
                            liquidType: that.config.liquidType,
                          }]);
                        } else {
                          needUpdate[needUpdateContain][1] = {
                            waterfall: false,
                            fluidity: 8,
                            liquidType: that.config.liquidType,
                          };
                        };
                      };


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
                  if (that.mapCeil.contant === that) {
                    for (let i = 0; i < needUpdate.length; i++) {
                      addWaterBlock(needUpdate[i][0], needUpdate[i][1]);
                    };

                    for (let i = 0; i < onlyGeometryUpdate.length; i++) {
                      onlyGeometryUpdate[i].contant.updateGeometry();
                      onlyGeometryUpdate[i].contant.updateInvisibleFaces();
                    };

                    onlyGeometryUpdate.length = 0;
                    resolve('childs added');
                  };
                }, 150)
              });

              let result = await promise;

              return result;
            };


            async function checkChilds() {
              if (that.mapCeil.contant === that) {
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
            };

            async function loop() {
              if (needUpdate.length > 0) {
                if (that.mapCeil.contant === that) {
                  addChildBlocks().then(res => {
                    if (res) {
                      MAIN.game.world.recalculateAmbientLight();
                      checkChilds();
                    };
                  });
                };
              } else {
                MAIN.game.world.recalculateAmbientLight();
              };
            };
            checkNeighbours(that).then(result => {
              if (result) {
                loop();
              };
            });
          };
        };
      };


      if (this.config.liquidType === 'lava') {
        let needUpdate = [];
        needUpdate.isContain = function(mapCeil) {
          for (let i = 0; i < needUpdate.length; i++) {
            if (needUpdate[i][0].id === mapCeil.id) {
              return i;
            };
          };
          return false;
        };
        let onlyGeometryUpdate = [];

        function addLavaBlock(mapCeil, blockConfig) {
          function add() {
            const block = get(blockConfig.liquidType);
            block.setPosition(mapCeil.position);
            block.waterfall = blockConfig.waterfall;
            block.fluidity = blockConfig.fluidity;
            if (mapCeil.crossNeighbors[2]) {
              if (mapCeil.crossNeighbors[2].contant) {
                if (mapCeil.crossNeighbors[2].contant.config.liquid && mapCeil.crossNeighbors[2].contant.config.liquidType === blockConfig.liquidType) {
                  block.waterfall = true;
                  block.fluidity = 3;
                };
              };
            };

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
            if (mapCeil.contant.config.destroyedByLiquid) {
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
              if (mapCeil.contant.fluidity <= blockConfig.fluidity) {
                mapCeil.contant.fluidity = blockConfig.fluidity;
                mapCeil.contant.waterfall = blockConfig.waterfall;
              };
              if (mapCeil.crossNeighbors[2]) {
                if (mapCeil.crossNeighbors[2].contant) {
                  if (mapCeil.crossNeighbors[2].contant.config.liquid && mapCeil.crossNeighbors[2].contant.config.liquidType === blockConfig.liquidType) {
                    if (mapCeil.contant.fluidity != 4) {
                      mapCeil.contant.waterfall = true;
                      mapCeil.contant.fluidity = 3;
                    };
                  };
                };
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
            };
          };
        };



        if (this.config.liquid) {
          //ищем есть ли сосед с бóльшим значением лавы, потому что если нет, то надо убирать
          let haveNeighbourWithGreaterFluidity = false;
          if (this.fluidity === 4) {
            //если сам является истоком, то убирать не надо
            haveNeighbourWithGreaterFluidity = true;
          } else {
            if (this.waterfall) {
              if (this.mapCeil.crossNeighbors[2]) {
                if (this.mapCeil.crossNeighbors[2].contant) {
                  if (this.mapCeil.crossNeighbors[2].contant.config.liquid && this.mapCeil.crossNeighbors[2].contant.config.liquidType === this.config.liquidType) {
                    //если он водопад и сверху есть лава
                    haveNeighbourWithGreaterFluidity = true;
                  };
                };
              };
            } else {
              // let sourcesNumbers = 0;
              this.mapCeil.crossNeighbors.forEach((neighbour, i) => {
                if (i != 3 && i != 2) {
                  if (neighbour) {
                    if (neighbour.contant) {
                      if (neighbour.contant.config.liquid && neighbour.contant.config.liquidType === this.config.liquidType) {
                        if (neighbour.contant.fluidity > this.fluidity) {
                          haveNeighbourWithGreaterFluidity = true;
                        };
                        if (neighbour.contant.fluidity === 4) {
                          // sourcesNumbers++;
                        };
                      };
                    };
                  };
                };
              });
              // if (sourcesNumbers > 1) {
              //   this.fluidity = 4;
              //   let needUpdateIndex = needUpdate.isContain(this.mapCeil);
              //   if(!needUpdateIndex){
              //     needUpdate.push([this.mapCeil,{
              //       waterfall: false,
              //       fluidity: 4,
              //       liquidType: this.config.liquidType,
              //     }]);
              //   }else{
              //     needUpdate[needUpdateIndex][1] = {
              //       waterfall: false,
              //       fluidity: 4,
              //       liquidType: this.config.liquidType,
              //     };
              //   };
              // };
            };
          };

          //после проверки на убрать/добавить воду, проверяем соседей

          const that = this;
          async function checkNeighbours(that) {
            //сразу проверяем нижнего
            if (that.mapCeil.crossNeighbors[3]) {
              if (that.mapCeil.crossNeighbors[3].contant === null) {
                const needUpdateContain = needUpdate.isContain(that.mapCeil.crossNeighbors[3]);
                if (needUpdateContain === false) {
                  needUpdate.push([that.mapCeil.crossNeighbors[3], {
                    waterfall: true,
                    fluidity: 3,
                    liquidType: that.config.liquidType
                  }]);
                };
              } else {
                if (that.mapCeil.crossNeighbors[3].contant.config.destroyedByLiquid) {
                  const needUpdateContain = needUpdate.isContain(that.mapCeil.crossNeighbors[3]);
                  if (needUpdateContain === false) {
                    needUpdate.push([that.mapCeil.crossNeighbors[3], {
                      waterfall: true,
                      fluidity: 3,
                      liquidType: that.config.liquidType
                    }]);
                  };
                };
                if (that.mapCeil.crossNeighbors[3].contant.config.liquid && that.mapCeil.crossNeighbors[3].contant.config.liquidType === that.config.liquidType) {
                  const needUpdateContain = needUpdate.isContain(that.mapCeil.crossNeighbors[3]);
                  if (needUpdateContain === false) {
                    needUpdate.push([that.mapCeil.crossNeighbors[3], {
                      waterfall: true,
                      fluidity: 3,
                      liquidType: that.config.liquidType,
                    }]);
                  };
                };


                if (that.mapCeil.crossNeighbors[3].contant.config.liquid && that.mapCeil.crossNeighbors[3].contant.config.liquidType === 'water') {
                  const block = get('stone');
                  block.setPosition(that.mapCeil.crossNeighbors[3].position);
                  MAIN.game.world.map.replaceBlock(block, true);
                };
              };
            };

            if (that.fluidity > 1) {
              //разлив воды
              function check() {
                // let sourcesNumbers = 0;
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
                        if (neighbour.contant.config.destroyedByLiquid) {
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
                          }
                          // else {
                          //   //bug fix
                          //   if (that.fluidity === 4) {
                          //     if (neighbour.contant.fluidity === 3) {
                          //       const needUpdateIndex = needUpdate.isContain(neighbour)
                          //       if (!needUpdateIndex) {
                          //         needUpdate.push([neighbour, {
                          //           waterfall: false,
                          //           fluidity: that.fluidity - 1,
                          //           liquidType: that.config.liquidType
                          //         }]);
                          //       } else {
                          //         needUpdate[needUpdateIndex][1] = {
                          //           waterfall: false,
                          //           fluidity: that.fluidity - 1,
                          //           liquidType: that.config.liquidType,
                          //         };
                          //       };
                          //     };
                          //   } else {
                          //     if (neighbour.contant.fluidity === 4) {
                          //       sourcesNumbers++;
                          //     };
                          //   };
                          // };
                        };
                        if (neighbour.contant.config.liquid && neighbour.contant.config.liquidType === 'water') {
                          if (that.fluidity === 4) {
                            const block = get('obsidian');
                            block.setPosition(that.position);
                            MAIN.game.world.map.replaceBlock(block, true);
                          } else {
                            const block = get('cobblestone');
                            block.setPosition(that.position);
                            MAIN.game.world.map.replaceBlock(block, true);
                          };
                        };
                      };
                    };
                  };
                });
                // //bug fix
                // if (sourcesNumbers > 1) {
                //   const needUpdateContain = needUpdate.isContain(that.mapCeil);
                //   if (needUpdateContain === false) {
                //     needUpdate.push([that.mapCeil, {
                //       waterfall: false,
                //       fluidity: 4,
                //       liquidType: that.config.liquidType,
                //     }]);
                //   } else {
                //     needUpdate[needUpdateContain][1] = {
                //       waterfall: false,
                //       fluidity: 4,
                //       liquidType: that.config.liquidType,
                //     };
                //   };
                // };
              };
              //при истоке разлив воды во все стороны
              if (that.fluidity === 4) {
                check();
              } else {
                //если не исток, то вода разливается только если внизу твердый блок
                if (that.mapCeil.crossNeighbors[3]) {
                  if (that.mapCeil.crossNeighbors[3].contant) {
                    if (!that.mapCeil.crossNeighbors[3].contant.config.destroyedByLiquid && !that.mapCeil.crossNeighbors[3].contant.config.liquid) {
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
                  if (that.mapCeil.contant === that) {
                    for (let i = 0; i < needUpdate.length; i++) {
                      addLavaBlock(needUpdate[i][0], needUpdate[i][1]);
                    };

                    for (let i = 0; i < onlyGeometryUpdate.length; i++) {
                      onlyGeometryUpdate[i].contant.updateGeometry();
                      onlyGeometryUpdate[i].contant.updateInvisibleFaces();
                    };

                    onlyGeometryUpdate.length = 0;
                    resolve('childs added');
                  };
                }, 1000);
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
                  if (needUpdate.length === 0) {
                    //перепроверка детей, чтобы если последние по глубине контактируют с водой, то их превратить в камень
                    //а, все, этот баг и в майне
                    // childs.forEach((child, i) => {
                    //   child[0].crossNeighbors.forEach((neighbour, i) => {
                    //     if(neighbour){
                    //       if(neighbour.contant){
                    //         if(neighbour.contant.liquid && neighbour.contant.liquidType === 'water'){
                    //           if(i === 2){
                    //             if(child[0].contant.fluidity === 4){
                    //               const block = get('obsidian');
                    //               block.setPosition(child[0].position);
                    //               MAIN.game.world.map.replaceBlock(block);
                    //             }else{
                    //               const block = get('cobblestone');
                    //               block.setPosition(child[0].position);
                    //               MAIN.game.world.map.replaceBlock(block);
                    //             };
                    //           }else if(i === 3){
                    //             const block = get('stone');
                    //             block.setPosition(neighbour.position);
                    //             MAIN.game.world.map.replaceBlock(block);
                    //           }else{
                    //             const block = get('cobblestone');
                    //             block.setPosition(child[0].position);
                    //             MAIN.game.world.map.replaceBlock(block);
                    //           };
                    //         };
                    //       };
                    //     };
                    //   });
                    //
                    // });
                  } else {
                    loop();
                  }
                };
              };

              check();
            };

            async function loop() {
              if (needUpdate.length > 0) {

                addChildBlocks().then(res => {
                  if (res) {
                    MAIN.game.world.recalculateAmbientLight();
                    checkChilds();
                  };
                });
              } else {
                MAIN.game.world.recalculateAmbientLight();
              }
            };
            setTimeout(function() {
              checkNeighbours(that).then(result => {
                if (result) {
                  loop();
                };
              });
            }, 200);
          };
        };

      };
    };






  };

  self.updateGeometry = function() {
    const that = this;
    if (this.config.liquid) {
      this.mesh.geometry = new THREE.BoxBufferGeometry(1, 1, 1);
      if (this.config.liquidType === 'water') {
        if (this.fluidity === 8) {

          if (this.mapCeil.crossNeighbors[2]) {
            if (this.mapCeil.crossNeighbors[2].contant === null) {
              updateLiquidBlockGeometryByCorners(this, -0.12, -0.12, -0.12, -0.12);
              this.geometryUpdated = true;
            } else {
              if (this.mapCeil.crossNeighbors[2].contant.config.liquid && this.mapCeil.crossNeighbors[2].contant.config.liquidType === this.config.liquidType) {
                this.geometryUpdated = false;
              } else {
                updateLiquidBlockGeometryByCorners(this, -0.12, -0.12, -0.12, -0.12);
                this.geometryUpdated = true;
              }
            }
          } else {
            updateLiquidBlockGeometryByCorners(this, -0.12, -0.12, -0.12, -0.12);
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
                if (neighbour.contant.config.liquid && neighbour.contant.config.liquidType === 'water') {
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
              if (mapCeil.closeNeighbors[9].contant.config.liquid && mapCeil.closeNeighbors[9].contant.config.liquidType === 'water') {


                //если он окружен соседями не водой, то не надо обращать внимания
                if (mapCeil.crossNeighbors[1]) {
                  if (mapCeil.crossNeighbors[1].contant) {
                    if (mapCeil.crossNeighbors[1].contant.config.liquid && mapCeil.crossNeighbors[1].contant.config.liquidType === 'water') {
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
                    if (mapCeil.crossNeighbors[5].contant.config.liquid && mapCeil.crossNeighbors[5].contant.config.liquidType === 'water') {
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
              if (mapCeil.closeNeighbors[11].contant.config.liquid && mapCeil.closeNeighbors[11].contant.config.liquidType === 'water') {

                if (mapCeil.crossNeighbors[0]) {
                  if (mapCeil.crossNeighbors[0].contant) {
                    if (mapCeil.crossNeighbors[0].contant.config.liquid && mapCeil.crossNeighbors[0].contant.config.liquidType === 'water') {
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
                    if (mapCeil.crossNeighbors[5].contant.config.liquid && mapCeil.crossNeighbors[5].contant.config.liquidType === 'water') {
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
              if (mapCeil.closeNeighbors[16].contant.config.liquid && mapCeil.closeNeighbors[16].contant.config.liquidType === 'water') {

                if (mapCeil.crossNeighbors[0]) {
                  if (mapCeil.crossNeighbors[0].contant) {
                    if (mapCeil.crossNeighbors[0].contant.config.liquid && mapCeil.crossNeighbors[0].contant.config.liquidType === 'water') {
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
                    if (mapCeil.crossNeighbors[4].contant.config.liquid && mapCeil.crossNeighbors[4].contant.config.liquidType === 'water') {
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
              if (mapCeil.closeNeighbors[14].contant.config.liquid && mapCeil.closeNeighbors[14].contant.config.liquidType === 'water') {

                if (mapCeil.crossNeighbors[1]) {
                  if (mapCeil.crossNeighbors[1].contant) {
                    if (mapCeil.crossNeighbors[1].contant.config.liquid && mapCeil.crossNeighbors[1].contant.config.liquidType === 'water') {
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
                    if (mapCeil.crossNeighbors[4].contant.config.liquid && mapCeil.crossNeighbors[4].contant.config.liquidType === 'water') {
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

          c_0 = -0.12 * (9 - f_0);
          c_1 = -0.12 * (9 - f_1);
          c_2 = -0.12 * (9 - f_2);
          c_3 = -0.12 * (9 - f_3);




          updateLiquidBlockGeometryByCorners(this, c_0, c_1, c_2, c_3);
          this.geometryUpdated = true;


          updateLiquidBlockBottomGeometry(this, -0.12);
        };
      };

      if (this.config.liquidType === 'lava') {
        if (this.fluidity === 4) {

          if (this.mapCeil.crossNeighbors[2]) {
            if (this.mapCeil.crossNeighbors[2].contant === null) {
              updateLiquidBlockGeometryByCorners(this, -0.12, -0.12, -0.12, -0.12);
              this.geometryUpdated = true;
            } else {
              if (this.mapCeil.crossNeighbors[2].contant.config.liquid && this.mapCeil.crossNeighbors[2].contant.config.liquidType === this.config.liquidType) {
                this.geometryUpdated = false;
              } else {
                updateLiquidBlockGeometryByCorners(this, -0.12, -0.12, -0.12, -0.12);
                this.geometryUpdated = true;
              }
            }
          } else {
            updateLiquidBlockGeometryByCorners(this, -0.12, -0.12, -0.12, -0.12);
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
                if (neighbour.contant.config.liquid && neighbour.contant.config.liquidType === 'lava') {
                  if (i === 1) {
                    if (neighbour.contant.fluidity > f_0) {
                      if (neighbour.contant.waterfall) {
                        f_0 = 5;
                      } else {
                        f_0 = neighbour.contant.fluidity;
                        if (f_0 === 4) {
                          f_0 = 4.5;
                        };
                      }
                    };
                    if (neighbour.contant.fluidity > f_3) {
                      if (neighbour.contant.waterfall) {
                        f_3 = 5;
                      } else {
                        f_3 = neighbour.contant.fluidity;
                        if (f_3 === 4) {
                          f_3 = 4.5;
                        };
                      };
                    };
                  };

                  if (i === 5) {
                    if (neighbour.contant.fluidity > f_0) {
                      if (neighbour.contant.waterfall) {
                        f_0 = 5;
                      } else {
                        f_0 = neighbour.contant.fluidity;
                        if (f_0 === 4) {
                          f_0 = 4.5;
                        };
                      }
                    };
                    if (neighbour.contant.fluidity > f_1) {
                      if (neighbour.contant.waterfall) {
                        f_1 = 5;
                      } else {
                        f_1 = neighbour.contant.fluidity;
                        if (f_1 === 4) {
                          f_1 = 4.5;
                        };
                      };
                    };
                  };

                  if (i === 0) {
                    if (neighbour.contant.fluidity > f_1) {
                      if (neighbour.contant.waterfall) {
                        f_1 = 5;
                      } else {
                        f_1 = neighbour.contant.fluidity;
                        if (f_1 === 4) {
                          f_1 = 4.5;
                        };
                      };
                    };
                    if (neighbour.contant.fluidity > f_2) {
                      if (neighbour.contant.waterfall) {
                        f_2 = 5;
                      } else {
                        f_2 = neighbour.contant.fluidity;
                        if (f_2 === 4) {
                          f_2 = 4.5;
                        };
                      };
                    };
                  };

                  if (i === 4) {
                    if (neighbour.contant.fluidity > f_2) {
                      if (neighbour.contant.waterfall) {
                        f_2 = 5;
                      } else {
                        f_2 = neighbour.contant.fluidity;
                        if (f_2 === 4) {
                          f_2 = 4.5;
                        };
                      };
                    };
                    if (neighbour.contant.fluidity > f_3) {
                      if (neighbour.contant.waterfall) {
                        f_3 = 5;
                      } else {
                        f_3 = neighbour.contant.fluidity;
                        if (f_3 === 4) {
                          f_3 = 4.5;
                        };
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
              if (mapCeil.closeNeighbors[9].contant.config.liquid && mapCeil.closeNeighbors[9].contant.config.liquidType === 'lava') {


                //если он окружен соседями не водой, то не надо обращать внимания
                if (mapCeil.crossNeighbors[1]) {
                  if (mapCeil.crossNeighbors[1].contant) {
                    if (mapCeil.crossNeighbors[1].contant.config.liquid && mapCeil.crossNeighbors[1].contant.config.liquidType === 'lava') {
                      if (mapCeil.closeNeighbors[9].contant.fluidity > f_0) {
                        f_0 = mapCeil.closeNeighbors[9].contant.fluidity;
                        if (f_0 === 4) {
                          f_0 = 4.5;
                        };
                        if (mapCeil.closeNeighbors[9].contant.waterfall) {
                          f_0 = 5;
                        }
                      };
                    };
                  };
                };
                if (mapCeil.crossNeighbors[5]) {
                  if (mapCeil.crossNeighbors[5].contant) {
                    if (mapCeil.crossNeighbors[5].contant.config.liquid && mapCeil.crossNeighbors[5].contant.config.liquidType === 'lava') {
                      if (mapCeil.closeNeighbors[9].contant.fluidity > f_0) {
                        f_0 = mapCeil.closeNeighbors[9].contant.fluidity;
                        if (f_0 === 4) {
                          f_0 = 4.5;
                        };
                        if (mapCeil.closeNeighbors[9].contant.waterfall) {
                          f_0 = 5;
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
              if (mapCeil.closeNeighbors[11].contant.config.liquid && mapCeil.closeNeighbors[11].contant.config.liquidType === 'lava') {

                if (mapCeil.crossNeighbors[0]) {
                  if (mapCeil.crossNeighbors[0].contant) {
                    if (mapCeil.crossNeighbors[0].contant.config.liquid && mapCeil.crossNeighbors[0].contant.config.liquidType === 'lava') {
                      if (mapCeil.closeNeighbors[11].contant.fluidity > f_1) {
                        f_1 = mapCeil.closeNeighbors[11].contant.fluidity;
                        if (f_1 === 4) {
                          f_1 = 4.5;
                        };
                        if (mapCeil.closeNeighbors[11].contant.waterfall) {
                          f_1 = 5;
                        };
                      };
                    };
                  };
                };
                if (mapCeil.crossNeighbors[5]) {
                  if (mapCeil.crossNeighbors[5].contant) {
                    if (mapCeil.crossNeighbors[5].contant.config.liquid && mapCeil.crossNeighbors[5].contant.config.liquidType === 'lava') {
                      if (mapCeil.closeNeighbors[11].contant.fluidity > f_1) {
                        f_1 = mapCeil.closeNeighbors[11].contant.fluidity;
                        if (f_1 === 4) {
                          f_1 = 4.5;
                        };
                        if (mapCeil.closeNeighbors[11].contant.waterfall) {
                          f_1 = 5;
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
              if (mapCeil.closeNeighbors[16].contant.config.liquid && mapCeil.closeNeighbors[16].contant.config.liquidType === 'lava') {

                if (mapCeil.crossNeighbors[0]) {
                  if (mapCeil.crossNeighbors[0].contant) {
                    if (mapCeil.crossNeighbors[0].contant.config.liquid && mapCeil.crossNeighbors[0].contant.config.liquidType === 'lava') {
                      if (mapCeil.closeNeighbors[16].contant.fluidity > f_2) {
                        f_2 = mapCeil.closeNeighbors[16].contant.fluidity;
                        if (f_2 === 4) {
                          f_2 = 4.5;
                        };
                        if (mapCeil.closeNeighbors[16].contant.waterfall) {
                          f_2 = 5;
                        };
                      };
                    };
                  };
                };
                if (mapCeil.crossNeighbors[4]) {
                  if (mapCeil.crossNeighbors[4].contant) {
                    if (mapCeil.crossNeighbors[4].contant.config.liquid && mapCeil.crossNeighbors[4].contant.config.liquidType === 'lava') {
                      if (mapCeil.closeNeighbors[16].contant.fluidity > f_2) {
                        f_2 = mapCeil.closeNeighbors[16].contant.fluidity;
                        if (f_2 === 4) {
                          f_2 = 4.5;
                        };
                        if (mapCeil.closeNeighbors[16].contant.waterfall) {
                          f_2 = 5;
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
              if (mapCeil.closeNeighbors[14].contant.config.liquid && mapCeil.closeNeighbors[14].contant.config.liquidType === 'lava') {

                if (mapCeil.crossNeighbors[1]) {
                  if (mapCeil.crossNeighbors[1].contant) {
                    if (mapCeil.crossNeighbors[1].contant.config.liquid && mapCeil.crossNeighbors[1].contant.config.liquidType === 'lava') {
                      if (mapCeil.closeNeighbors[14].contant.fluidity > f_3) {
                        f_3 = mapCeil.closeNeighbors[14].contant.fluidity;
                        if (f_3 === 4) {
                          f_3 = 4.5;
                        };
                        if (mapCeil.closeNeighbors[14].contant.waterfall) {
                          f_3 = 5;
                        };
                      };
                    };
                  };
                };
                if (mapCeil.crossNeighbors[4]) {
                  if (mapCeil.crossNeighbors[4].contant) {
                    if (mapCeil.crossNeighbors[4].contant.config.liquid && mapCeil.crossNeighbors[4].contant.config.liquidType === 'lava') {
                      if (mapCeil.closeNeighbors[14].contant.fluidity > f_3) {
                        f_3 = mapCeil.closeNeighbors[14].contant.fluidity;
                        if (f_3 === 4) {
                          f_3 = 4.5;
                        };
                        if (mapCeil.closeNeighbors[14].contant.waterfall) {
                          f_3 = 5;
                        };
                      };
                    };
                  };
                };
              };
            };
          };

          if (this.waterfall) {
            f_0 = f_1 = f_2 = f_3 = 5;
          }

          c_0 = -0.12 * ((5 - f_0) * 2);
          c_1 = -0.12 * ((5 - f_1) * 2);
          c_2 = -0.12 * ((5 - f_2) * 2);
          c_3 = -0.12 * ((5 - f_3) * 2);




          updateLiquidBlockGeometryByCorners(this, c_0, c_1, c_2, c_3);
          this.geometryUpdated = true;


          updateLiquidBlockBottomGeometry(this, -0.12);
        };
      };
    };
  };

  self.rotateSidesTextures = function() {
    let material = MESHES_BASE.getMeshMaterial(this.name);



    if (this.rotationConfig) {
      if (this.config.rotated) {
        function rotateTo(direction) {

          let copy = [...material]

          //по умолчанию лицевая сторона направлена на восток
          if (direction === 0) { //на восток
            return copy;
          };
          if (direction === 1) { //на север
            copy[0] = material[4];
            copy[1] = material[5];
            copy[4] = material[1];
            copy[5] = material[0];
            return copy;
          };
          if (direction === 2) { //на запад
            copy[0] = material[1];
            copy[1] = material[0];
            copy[4] = material[5];
            copy[5] = material[4];
            return copy;
          };
          if (direction === 3) { //на юг
            copy[0] = material[4];
            copy[1] = material[5];
            copy[4] = material[0];
            copy[5] = material[1];
            return copy;
          };
        };
        if (this.config.rotatedConfig === 0) {
          //прокрутка тестуры по ewsn (печь)


          //сначала отрубим если был клик на соседний блок (на его east, west,south,north);
          if (this.rotationConfig.faceIndex != 2 && this.rotationConfig.faceIndex != 3) {
            // return rotateTo(this.rotationConfig.faceIndex);
            let direction;
            if (this.rotationConfig.faceIndex === 0) {
              direction = 0;
            };
            if (this.rotationConfig.faceIndex === 1) {
              direction = 2;
            };
            if (this.rotationConfig.faceIndex === 4) {
              direction = 3;
            };
            if (this.rotationConfig.faceIndex === 5) {
              direction = 1;
            };
            return rotateTo(direction);
          } else {
            return rotateTo(this.rotationConfig.rotation);
          };
        };

        if (this.config.rotatedConfig === 1) { //дерево и тд;
          //сначала отрубим если был клик на нижний или верхний блок(на его top, bottom);
          if (this.rotationConfig.faceIndex === 2 || this.rotationConfig.faceIndex === 3) {
            return material;
          } else {
            //если был клик на соседний блок (на его east, west,south,north);
            material = MESHES_BASE.getMeshMaterial_Rotated_1(this.name);
            let direction;
            if (this.rotationConfig.faceIndex === 0) {
              direction = 0;
            };
            if (this.rotationConfig.faceIndex === 1) {
              direction = 2;
            };
            if (this.rotationConfig.faceIndex === 4) {
              direction = 3;
            };
            if (this.rotationConfig.faceIndex === 5) {
              direction = 1;
            };
            return rotateTo(direction);
          };
        };
      } else {
        return material;
      };
    } else {
      return material;
    };
  };





  self.pushDeathParticles = async function() {
    const that = this;
    const size = 2;
    const count = 20;
    const image = MESHES_BASE.getMeshMaterial(this.name)[0].map.image;
    const spritesTextures = [];
    const particles = [];
    const sprites = new THREE.Group();
    let createdIndex = -1
    async function create() {
      //рисуем полную текстуру
      createdIndex++;
      if (createdIndex < count) {
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = false;
        let x = Math.round(Math.random() * (14 - size));
        let y = Math.round(Math.random() * (14 - size));
        ctx.drawImage(image, x, y, x + size, y + size, 0, 0, size, size);
        const spriteTexture = new THREE.CanvasTexture(canvas);
        spriteTexture.magFilter = THREE.NearestFilter;
        spritesTextures[createdIndex] = spriteTexture;

        return create();
      } else {


        for (let i = 0; i < count; i++) {
          const x = that.position.x + 0.5 - Math.random();
          const y = that.position.y + 0.5 - Math.random();
          const z = that.position.z + 0.5 - Math.random();

          const material = new THREE.SpriteMaterial({
            map: spritesTextures[i]
          });
          const sprite = new THREE.Sprite(material);
          sprite.scale.set(size / 16, size / 16, size / 16);
          sprite.position.set(x, y, z);
          sprites.add(sprite);

          const particle = {
            sprite,
            x,
            y,
            z,
            shift: 0,
            startY: y,
            deg: Math.round(Math.random() * 360),
          };
          particles.push(particle);
        };
        MAIN.render.scene.add(sprites);

        return true;
      };

    };



    create().then(result => {
      if (result) {
        play();
      };
    })








    function play() {
      let allParticlesOnGround = true;
      particles.forEach((particle, i) => {
        const normalizedCords = {
          x: Math.floor(0.5 + particle.x),
          y: Math.floor(0.5 + particle.y),
          z: Math.floor(0.5 + particle.z),
        };

        let thisCordsColumnHeight;
        for (let i = normalizedCords.y; i > 0; i--) {
          if (normalizedCords.x < 0 || normalizedCords.x >= MAIN.game.world.size.width || normalizedCords.z < 0 || normalizedCords.z >= MAIN.game.world.size.width) {
            thisCordsColumnHeight = 0;
            break;
          };
          if (MAIN.game.world.map[normalizedCords.x][normalizedCords.z][i].contant) {
            if (MAIN.game.world.map[normalizedCords.x][normalizedCords.z][i].contant.name != 'water') {
              thisCordsColumnHeight = i + 0.6;
              break;
            };
          } else {
            thisCordsColumnHeight = 0;
          };
        };
        if (particle.y > thisCordsColumnHeight) {
          particle.shift += Math.random() * 0.005;
          particle.x += Math.sin(particle.deg * Math.PI / 180) * particle.shift / 3;
          particle.z += Math.cos(particle.deg * Math.PI / 180) * particle.shift / 3;
          particle.y -= particle.shift * 1.2;
          particle.sprite.position.set(particle.x, particle.y, particle.z);
          allParticlesOnGround = false;
        };
      });

      if (allParticlesOnGround) {
        setTimeout(function() {
          MAIN.render.scene.remove(sprites);
        }, 250);
      } else {
        requestAnimationFrame(function() {
          play();
        });
      };
    };

  };
  self.pushLiqudParticles = function() {
    if (this.config.liquid) {
      let particleColor;
      if (this.config.liquidType === 'water') {
        particleColor = 0x34a6e7;
      };
      if (this.config.liquidType === 'lava') {
        particleColor = 0xff2e00;
      };
      //creating
      const geometry = new THREE.BufferGeometry();
      const vertices = [];
      const particles = [];

      for (let i = 0; i < 10; i++) {

        const x = this.mapCeil.position.x + 0.5 - Math.random();
        const y = this.mapCeil.position.y + 1;
        const z = this.mapCeil.position.z + 0.5 - Math.random();

        vertices.push(x, y, z);

        const point = {
          x,
          y,
          z,
          deg: Math.round(Math.random() * 360),
        };
        particles.push(point);
      };


      geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

      const material = new THREE.PointsMaterial({
        color: particleColor,
        size: 1,
      });
      const cloud = new THREE.Points(geometry, material);
      const array = cloud.geometry.attributes.position.array;
      MAIN.render.scene.add(cloud);

      let count = 0;

      function play() {
        count++;
        particles.forEach((point, i) => {
          point.x += Math.sin(point.deg * Math.PI / 180) * count / 500;
          point.z += Math.cos(point.deg * Math.PI / 180) * count / 500;


          point.y += Math.sin(25 / count * 3) / 3;

          array[i * 3] = point.x;
          array[i * 3 + 1] = point.y;
          array[i * 3 + 2] = point.z;

        });

        cloud.geometry.attributes.position.needsUpdate = true;





        if (count < 20) {
          requestAnimationFrame(play);
        } else {
          MAIN.render.scene.remove(cloud);
        };
      };

      play();



    };
  };


  self.update = function() {
    this.updateGeometry();
    this.updateLiquidPhysics();
    this.updateInvisibleFaces();
    this.updateShadow();
    this.updateGravity();
    if (this.config.uniqueUpdate) {
      this.config.uniqueUpdateFunction(this);
    };
  };
  return self;

};









const BLOCK = {
  get,
};

export {
  BLOCK
}
