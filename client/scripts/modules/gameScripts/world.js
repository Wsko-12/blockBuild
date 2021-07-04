import {
  MAIN
} from '../../main.js';

import {
  PERLIN_NOISE
} from '../libs/perlin.js';
import {
  BLOCK
} from './block.js';


const size = {
  width: 24,
  height: 64,
}


const map = [];
map.initMapCeils = function() {
  for (let x = 0; x < size.width; x++) {
    for (let z = 0; z < size.width; z++) {
      for (let y = 0; y < size.height; y++) {
        map[x][z][y].init();
      };
    };
  };
};
map.updateAllInvisibleFaces = function() {
  for (let x = 0; x < size.width; x++) {
    for (let z = 0; z < size.width; z++) {
      for (let y = 0; y < size.height; y++) {
        if (map[x][z][y].contant) {
          map[x][z][y].contant.updateInvisibleFaces();
        };
      };
    };
  };
};



map.addBlock = function(block, generation) {
  const position = block.position;
  map[position.x][position.z][position.y].contant = block;
  map[position.x][position.z][position.y].lightValue = 0;
  map[position.x][position.z][position.y].seeSky = false;
  block.mapCeil = map[position.x][position.z][position.y];
  block.addMeshToScene();
  if (!generation) {
    MAIN.game.world.map[position.x][position.z][position.y].updateBlockInvisibleFaces();
    MAIN.game.world.map[position.x][position.z][position.y].crossNeighbors.forEach((neighbour, i) => {
      if (neighbour != null && neighbour.contant === null) {
        setTimeout(function() {
          // neighbour.calculateLight();
        }, 1)
      }
    });
    MAIN.game.world.map[position.x][position.z][position.y].closeNeighbors.forEach((neighbour, i) => {
      if (neighbour != null) {
        if (neighbour.contant) {
          neighbour.contant.updateShadow();
        }
      }
    });
    MAIN.game.world.map[position.x][position.z][position.y].contant.updateShadow();
  };
};
map.removeBlock = function(block) {
  const position = block.position;
  map[position.x][position.z][position.y].contant = null;
  block.removeMeshFromScene();

  map[position.x][position.z][position.y].crossNeighbors.forEach((neighbor, i) => {
    if (neighbor != null) {
      neighbor.updateBlockInvisibleFaces()
    };
  });

  // map[position.x][position.z][position.y].findLightValue();
  // map[position.x][position.z][position.y].updateNeighbourBlockTexture();
};



map.wasUpdated = {};



function mapCeil(x, y, z) {
  const ceil = {};
  ceil.shadowsDate = {
    updated: false,
  };
  ceil.position = {
    x,
    y,
    z,
  };
  ceil.id = `X${x}Y${y}Z${z}`;

  //!!!!!
  ceil.findCrossNeighbors = function() {
    const crossNeighborsIndex = [
      [this.position.x + 1, this.position.y, this.position.z, 'e'],
      [this.position.x - 1, this.position.y, this.position.z, 'w'],
      [this.position.x, this.position.y + 1, this.position.z, 't'],
      [this.position.x, this.position.y - 1, this.position.z, 'b'],
      [this.position.x, this.position.y, this.position.z + 1, 's'],
      [this.position.x, this.position.y, this.position.z - 1, 'n'],
    ];

    this.crossNeighbors = [null, null, null, null, null, null];
    crossNeighborsIndex.forEach((item, i) => {
      const x = item[0];
      const y = item[1];
      const z = item[2];
      //если вышли за край карты
      if (x >= 0 && x < size.width && y >= 0 && y < size.height && z >= 0 && z < size.width) {
        this.crossNeighbors[i] = map[x][z][y];
      };
    });
  };

  ceil.findAroundNeighbors = function(radius, helpers) {
    const aroundNeighbors = [];
    for (let yI = radius; yI >= 0 - radius; yI--) {
      for (let zI = 0 - radius; zI <= radius; zI++) {
        for (let xI = 0 - radius; xI <= radius; xI++) {
          const neighbor = {
            x: this.position.x + xI,
            y: this.position.y + yI,
            z: this.position.z + zI,
          };

          //выход за пределы карты
          if (neighbor.x >= 0 && neighbor.x < size.width && neighbor.y >= 0 && neighbor.y < size.height && neighbor.z >= 0 && neighbor.z < size.width) {

            if (xI === 0 && zI === 0 && yI === 0) {
              //если он сам
            } else {
              if (helpers) {
                if (!MAIN.render.config.helpers.neighbors) {
                  MAIN.render.config.helpers.neighbors = new THREE.Group();
                  MAIN.render.scene.add(MAIN.render.config.helpers.neighbors);
                };
                const geom = new THREE.BoxGeometry(0.2, 0.2, 0.2);
                const material = new THREE.MeshBasicMaterial({
                  color: 0x5fb942,
                  transparent: true,
                  opacity: 0.5,
                });


                const mesh = new THREE.Mesh(geom, material);
                mesh.position.x = neighbor.x;
                mesh.position.y = neighbor.y;
                mesh.position.z = neighbor.z;

                MAIN.render.config.helpers.neighbors.add(mesh);
              };
              aroundNeighbors.push(map[neighbor.x][neighbor.z][neighbor.y]);
            }
          } else {
            aroundNeighbors.push(null);
          };
        };
      };
    };
    return aroundNeighbors;
  };


  ceil.findCloseNeighbors = function() {
    this.closeNeighbors = this.findAroundNeighbors(1);
  };

  //!!!!!!!
  ceil.findNeighborsBySide = function(helpers) {
    this.neighborsBySide = [];
    const neighbors = this.closeNeighbors;

    //
    const east = [];
    east.push(neighbors[8]);
    east.push(neighbors[5]);
    east.push(neighbors[2]);

    east.push(neighbors[11]);
    east.push(neighbors[19]);
    east.push(neighbors[22]);

    east.push(neighbors[25]);
    east.push(neighbors[16]);
    east.push(neighbors[13]);
    this.neighborsBySide.push(east);





    const west = [];
    west.push(neighbors[0]);
    west.push(neighbors[3]);
    west.push(neighbors[6]);

    west.push(neighbors[14]);
    west.push(neighbors[23]);
    west.push(neighbors[20]);

    west.push(neighbors[17]);
    west.push(neighbors[9]);
    west.push(neighbors[12]);
    this.neighborsBySide.push(west);

    const top = [];
    top.push(neighbors[0]);
    top.push(neighbors[1]);
    top.push(neighbors[2]);

    top.push(neighbors[5]);
    top.push(neighbors[8]);
    top.push(neighbors[7]);

    top.push(neighbors[6]);
    top.push(neighbors[3]);
    top.push(neighbors[4]);
    this.neighborsBySide.push(top);

    const bottom = [];
    bottom.push(neighbors[23]);
    bottom.push(neighbors[24]);
    bottom.push(neighbors[25]);

    bottom.push(neighbors[22]);
    bottom.push(neighbors[19]);
    bottom.push(neighbors[18]);

    bottom.push(neighbors[17]);
    bottom.push(neighbors[20]);
    bottom.push(neighbors[21]);
    this.neighborsBySide.push(bottom);

    const south = [];
    south.push(neighbors[6]);
    south.push(neighbors[7]);
    south.push(neighbors[8]);

    south.push(neighbors[16]);
    south.push(neighbors[25]);
    south.push(neighbors[24]);

    south.push(neighbors[23]);
    south.push(neighbors[14]);
    south.push(neighbors[15]);
    this.neighborsBySide.push(south);


    const north = [];
    north.push(neighbors[2]);
    north.push(neighbors[1]);
    north.push(neighbors[0]);

    north.push(neighbors[9]);
    north.push(neighbors[17]);
    north.push(neighbors[18]);

    north.push(neighbors[19]);
    north.push(neighbors[11]);
    north.push(neighbors[10]);
    this.neighborsBySide.push(north);


    if (helpers) {
      if (!MAIN.render.config.helpers.neighbors) {
        MAIN.render.config.helpers.neighbors = new THREE.Group();
        MAIN.render.scene.add(MAIN.render.config.helpers.neighbors);
      };
      south.forEach((item, i) => {
        if (item != null) {
          const geom = new THREE.BoxGeometry(0.2, 0.2, 0.2);
          const material = new THREE.MeshBasicMaterial({
            color: 0xe7e527,
            transparent: true,
            opacity: 0.5,
          });


          const mesh = new THREE.Mesh(geom, material);
          mesh.position.x = item.position.x;
          mesh.position.y = item.position.y;
          mesh.position.z = item.position.z;

          MAIN.render.config.helpers.neighbors.add(mesh);
        };
      });
    };
  };



  ceil.init = function() {
    this.findCrossNeighbors();
    this.findCloseNeighbors();
    this.findNeighborsBySide();
  };

  ceil.updateBlockInvisibleFaces = function() {
    if (this.contant) {
      this.contant.updateInvisibleFaces();
    };
  };

  ceil.updateNeighbourBlockTexture = function() {
    this.closeNeighbors.forEach((neighbor, i) => {
      if (neighbor != null) {
        if (neighbor.contant) {
          neighbor.contant.updateShadow();
        };
      };
    });
  };

  ceil.updateLight = function(helpers) {
    if (helpers) {
      if (!MAIN.render.config.helpers.lightHelpers) {
        MAIN.render.config.helpers.lightHelpers = new THREE.Group();
        MAIN.render.scene.add(MAIN.render.config.helpers.lightHelpers);
      };
      const geom = new THREE.BoxGeometry(0.15, 0.15, 0.15);
      const material = new THREE.MeshBasicMaterial({
        color: `rgb(${Math.round(255*this.lightValue/15)},${Math.round(255*this.lightValue/15)},${Math.round(255*this.lightValue/15)})`,
        transparent: true,
        opacity: 1,
      });


      const mesh = new THREE.Mesh(geom, material);
      mesh.position.x = this.position.x;
      mesh.position.y = this.position.y;
      mesh.position.z = this.position.z;

      MAIN.render.config.helpers.lightHelpers.add(mesh);
    }
    this.crossNeighbors.forEach((neighbor, i) => {
      //если не вышли за пределы карты
      if (neighbor != null) {
        if (neighbor.contant) {
          //если сосед блок
          // neighbor.contant.updateShadow();
        } else {
          //если нет, то
          if (neighbor.lightValue < this.lightValue - 1) {
            neighbor.lightValue = this.lightValue - 1;
            neighbor.updateLight(helpers);
          };
        };
      };
    });
  };


  ceil.calculateLight = function() {
    const startLightValue = this.lightValue;
    let changed = false;
    this.crossNeighbors.forEach((neighbour, i) => {
      if (neighbour) {
        if (neighbour.contant === null && neighbour.lightValue != 0) {
          if (neighbour.lightValue > startLightValue) {

          } else {
            if (neighbour.position.y < this.position.y) {
              this.lightValue = 0;
              changed = true
              setTimeout(function() {
                neighbour.calculateLight();
              });
            } else if (neighbour.position.y === this.position.y) {
              if (neighbour.lightValue < startLightValue) {
                this.lightValue = 0;
                changed = true
                setTimeout(function() {
                  neighbour.calculateLight();
                });
              }
            }
          };
        };
      };
    });

    if(!changed){
      let maxNeighbourLightValue
      this.crossNeighbors.forEach((neighbour, i) => {
        if(neighbour && neighbour.contant === null){
          if(neighbour.lightValue > maxNeighbourLightValue){
            maxNeighbourLightValue = neighbour.lightValue
          };
        };
      });
      if(this.lightValue > maxNeighbourLightValue){
        this.lightValue = 0;
      }

    }
    this.updateNeighbourBlockTexture();

  };


  ceil.findLightValue = function() {
    //смотрим верхнего соседа
    const oldLightValue = this.lightValue;
    if (this.contant === null) {
      if (this.crossNeighbors[2]) {
        if (this.crossNeighbors[2].seeSky) {
          this.seeSky = true;
          this.lightValue = this.crossNeighbors[2].lightValue;
          for (let y = this.position.y - 1; y >= 0; y--) {
            if (!map[this.position.x][this.position.z][y].contant) {
              map[this.position.x][this.position.z][y].findLightValue();
            } else {
              break;
            }
          };
        } else {
          //если сверху нет блока, то ищем вокруг
          //соеседа, который видит небо, кроме нижнего;
          let maxNeighbourLightValue = 0;
          for (let i = 0; i < 6; i++) {
            const neighbour = this.crossNeighbors[i];
            if (neighbour != null) {
              if (i != 3) {
                if (neighbour != null) {
                  if (neighbour.seeSky) {
                    this.seeSky = false;
                    this.lightValue = neighbour.lightValue - 1;
                    break;
                  } else {
                    this.seeSky = false;
                    if (neighbour.lightValue >= maxNeighbourLightValue) {
                      maxNeighbourLightValue = neighbour.lightValue;
                      this.lightValue = maxNeighbourLightValue - 1;
                      if (this.lightValue < 0) {
                        this.lightValue = 0;
                      }
                    };
                  };
                };
              } else {
                //но если нижний сосед светящийся блок
                if (neighbour.lightBlock) {

                };
                if (neighbour.lightValue != 15) {
                  if (neighbour.lightValue >= maxNeighbourLightValue) {
                    maxNeighbourLightValue = neighbour.lightValue;
                    if (maxNeighbourLightValue != 0) {
                      this.lightValue = maxNeighbourLightValue - 1;
                    } else {
                      this.lightValue = 0;
                    }
                  };
                };
              };
            };
          };
        };
      } else {
        //самый верхний блок
        this.lightValue = 15;
        this.seeSky = true;
      };

      if (oldLightValue != this.lightValue) {
        this.crossNeighbors.forEach((neighbour, i) => {
          if (neighbour != null) {
            setTimeout(function() {
              neighbour.findLightValue();
            }, 1)
          }
        });
        this.updateNeighbourBlockTexture();
      };
    };
  };

  ceil.findLightValueWhenAddBlock = function() {
    //сначала проверяем блок сверху
    if (this.contant === null || this.lightBlock) {
      if (this.crossNeighbors[2] != null) {
        //если блок сверху видит небо, то и этот видит небо
        if (this.crossNeighbors[2].seeSky) {
          this.crossNeighbors.forEach((neighbour, i) => {
            if (neighbour) {
              if (!neighbour.seeSky) {
                if (neighbour.contant === null) {
                  console.log(neighbour);
                  neighbour.findLightValue();
                }
              };
            };
          });

        } else {
          this.seeSky = false;
          this.lightValue = 0;
          this.updateNeighbourBlockTexture();
          this.crossNeighbors.forEach((neighbour, i) => {
            if (neighbour) {
              if (neighbour.contant === null && neighbour.lightValue != 0) {
                // console.log(neighbour)
                neighbour.findLightValueWhenAddBlock();
              } else if (neighbour.lightBlock) {

              }
            };
          });


        }
      } else {
        //если блока сверху нет, значит этот блок финальный
        this.seeSky = true;
        this.lightValue = 15;
        const that = this;
        setTimeout(function() {
          that.updateNeighbourBlockTexture();
        }, 1000);
      };
    };




  };



  ceil.contant = null;
  return ceil;
};


function updateAmbientLight(helpers) {
  // if(!map.onUpdateAmbientLight){
  // map.onUpdateAmbientLight = true;
  const updateID = Math.random();
  const airBlocks = [];
  const blocks = [];

  for (let x = 0; x < size.width; x++) {
    for (let z = 0; z < size.width; z++) {
      let lightValue = 15;
      for (let y = size.height - 1; y >= 0; y--) {
        const mapCeil = map[x][z][y];
        mapCeil.lightUpdateId = updateID;
        if (mapCeil.contant != null) {
          lightValue = 0;
          blocks.push(mapCeil.contant);
        } else {
          airBlocks.push(mapCeil);
        }
        mapCeil.lightValue = lightValue;
        mapCeil.seeSky = false;
        if (lightValue === 15) {
          mapCeil.seeSky = true;
        };
      };
    };
  };

  let updatedMapCeilIndex = 0;
  let updatedBlockIndex = 0;


  airBlocks.forEach((mapCeil, i) => {
    mapCeil.updateLight();
  });


  let blockIndex = -1;
  async function updateBlockTexture(){
    blockIndex++;
    if(blockIndex < blocks.length){
      if(blocks[blockIndex].meshAddedToScene){
        blocks[blockIndex].updateShadow().then(function(){
          updateBlockTexture();
        });
      }else{
        updateBlockTexture();
      };
    }else{
      MAIN.render.render();
    }
  };
  updateBlockTexture();

};

function generateLandscape(seed) {
  PERLIN_NOISE.init(seed);
  const mapHeight = size.height;
  const landHeightMax = Math.round(mapHeight * 0.68);

  const mountainHeightMin = Math.round(mapHeight * 0.26);
  const snowLevel = Math.round(mapHeight * 0.23);
  const onlySnowLevel = Math.round(mapHeight * 0.38);


  const groundLayer = 3;
  const waterLine = 4;





  for (let x = 0; x < size.width; x++) {
    for (let z = 0; z < size.width; z++) {
      //узнаем [0,1] высоты;
      let perlinHeight = PERLIN_NOISE.Noise('land', x, z);
      //узнаем [0,1] воды;
      let perlinWater = PERLIN_NOISE.Noise('water', x, z);
      const waterValue = 1 - Math.abs(perlinWater - 0.5) / 0.5;
      const heightValue = Math.round(perlinHeight * landHeightMax);
      let landHeight = heightValue - Math.round(heightValue * waterValue);

      let landType = 'stone'

      if (waterValue >= 0.8) {
        landType = 'water';
      };


      landHeight < 4 ? landHeight = 4 : false;



      for (let y = 0; y <= landHeight; y++) {


        let blockType = landType
        //обработка воды
        if (blockType === 'water') {
          if (y === 0) {
            //самое дно
            blockType = 'sand';
          } else {
            //плавное дно
            const waterDepth = 1 - (waterValue - 0.9) * 10;
            if (y < Math.round(waterDepth * waterLine)) {
              blockType = 'sand';
            };
          };
          //берег
          if (waterValue < 0.9) {
            blockType = 'sand';
          };
        };


        //обработка земли
        if (blockType === 'stone') {
          if (landHeight < mountainHeightMin) {
            //просто земля
            if (y === landHeight) {
              blockType = 'grass';
            }
            if (y === landHeight - 1) {
              //второй слой земли
              blockType = 'ground';
            }
            if (y === landHeight - 2) {
              Math.random() > 0.5 ? blockType = 'ground' : false;
            }
            if (y > snowLevel && y === landHeight) {
              //шапка из снега
              // Math.random() > 0.5? GAME.blocks.addBlock({x,y:y+1,z},'snowCarpet') :false;
            }

          } else {
            //тут горы
            if (y === landHeight) {
              // Math.random() > 0.1? GAME.blocks.addBlock({x,y:y+1,z},'snowCarpet',null,true) :false;
            };
            if (y > onlySnowLevel) {
              blockType = 'snow'
            };
          };
        };

        const caveValue = PERLIN_NOISE.Worm(x, z, y);
        if (caveValue < 0.5) {
          // GAME.blocks.addBlock({x,y,z},blockType,null,true);
          if (blockType === 'stone' || blockType === 'ground' || blockType === 'sand' || blockType === 'snow') {
            let block = BLOCK.get(blockType);
            block.setPosition({
              x,
              y,
              z
            });
            map.addBlock(block, true);
          } else {
            let block = BLOCK.get('test');
            block.setPosition({
              x,
              y,
              z
            });
            map.addBlock(block, true);
          }


        } else {
          if (blockType === 'snow' || blockType === 'sand' || blockType === 'water' || y === 0) {
            // GAME.blocks.addBlock({x,y,z},blockType,null,true);
            if (blockType === 'stone' || blockType === 'ground' || blockType === 'sand' || blockType === 'snow') {
              let block = BLOCK.get(blockType);
              block.setPosition({
                x,
                y,
                z
              });
              map.addBlock(block, true);
            } else {
              let block = BLOCK.get('test');
              block.setPosition({
                x,
                y,
                z
              });
              map.addBlock(block, true);
            }
          };
        };
      };
    };
  };
};

function parse() {

};






function init() {
  //init map array
  for (let x = 0; x < size.width; x++) {
    map.push([]);
    for (let z = 0; z < size.width; z++) {
      map[x].push([]);
      for (let y = 0; y < size.height; y++) {
        map[x][z].push([]);
        map[x][z][y] = mapCeil(x, y, z);
      };
    };
  };
  map.initMapCeils();
};


const WORLD = {
  init,
  map,
  size,
  updateAmbientLight,
  generateLandscape,
};

export {
  WORLD
};
