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



map.addBlock = async function(block, generation, rotationObj) {
  const position = block.position;
  map[position.x][position.z][position.y].contant = block;
  block.mapCeil = map[position.x][position.z][position.y];
  block.addMeshToScene();

  if (!generation) {
    recalculateAmbientLight().then(function() {
        map[position.x][position.z][position.y].contant.update();
        map[position.x][position.z][position.y].closeNeighbors.forEach((neighbour, i) => {
          if (neighbour) {
            if(neighbour.contant){
              neighbour.contant.update();
            };
          };
        });
    });
  };
};
map.removeBlock = async function(block,generation) {
  if(block.config.liquid){
    block.removeLiquidBlock();
  }else{
    const position = block.position;
    map[position.x][position.z][position.y].contant = null;
    block.removeMeshFromScene();
    if(!generation){
      if(!block.config.disableDeathParticles){
        block.pushDeathParticles();
      };
      recalculateAmbientLight().then(function() {
        map[position.x][position.z][position.y].closeNeighbors.forEach((neighbour, i) => {
          if (neighbour != null) {
            if(neighbour.contant){
              neighbour.contant.update();
            };
          };
        });
      });
    };
  };
};

map.replaceBlock = async function(block){
  const position = block.position;
  map[position.x][position.z][position.y].contant.removeMeshFromScene();
  map[position.x][position.z][position.y].contant = block;
  block.mapCeil =   map[position.x][position.z][position.y];
  block.addMeshToScene();
  block.update();
};




map.moveBlock = function(fromMapCeil,toMapCeil){
  toMapCeil.contant = fromMapCeil.contant;
  fromMapCeil.contant = null;

  recalculateAmbientLight().then(function() {
  fromMapCeil.closeNeighbors.forEach((neighbour, i) => {
      if (neighbour != null) {
        if(neighbour.contant){
          neighbour.contant.update();
        };
      };
    });
  toMapCeil.closeNeighbors.forEach((neighbour, i) => {
      if (neighbour != null) {
        if(neighbour.contant){
          neighbour.contant.update();
        };
      };
    });
  });
};





function mapCeil(x, y, z) {
  const ceil = {};
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

  ceil.updateLight = function(generation) {

    this.crossNeighbors.forEach((neighbor, i) => {
      //если не вышли за пределы карты
      if (neighbor != null) {
        if (neighbor.contant === null || neighbor.contant.config.transparent != 0) {
          if (this.contant && this.contant.config.transparent != 0) {
              if (neighbor.lightValue < this.lightValue - this.contant.config.lightRefraction) {
                neighbor.lightValue = this.lightValue - this.contant.config.lightRefraction;
                if (generation) {
                  neighbor.lastLightValue = neighbor.lightValue;
                };
                  neighbor.updateLight(generation);
              };
          } else {
            if (neighbor.lightValue < this.lightValue - 1) {
              neighbor.lightValue = this.lightValue - 1;
              if (generation) {
                neighbor.lastLightValue = neighbor.lightValue;
              };
              neighbor.updateLight(generation);
            };
          };
        };
      };
    });
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
          if (mapCeil.contant.config.transparent != 0) {
            lightValue -= mapCeil.contant.config.lightRefraction;
            airBlocks.push(mapCeil);
          } else {
            lightValue = 0;
          }
          blocks.push(mapCeil.contant);
        } else {
          airBlocks.push(mapCeil);
        }
        mapCeil.lightValue = lightValue;
        mapCeil.lastLightValue = lightValue;
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
    mapCeil.updateLight(true);
  });


  let blockIndex = -1;
  async function updateBlockTexture() {
    blockIndex++;
    if (blockIndex < blocks.length) {
      if (blocks[blockIndex].meshAddedToScene) {
        blocks[blockIndex].updateShadow().then(function() {
          updateBlockTexture();
        });
      } else {
        updateBlockTexture();
      };
    } else {
      MAIN.render.render();
    }
  };
  updateBlockTexture();

};





function updateWaterGeometry(){
  for (let x = 0; x < size.width; x++) {
    for (let z = 0; z < size.width; z++) {
      for (let y = size.height - 1; y >= 0; y--) {
        const mapCeil = map[x][z][y];
        if(mapCeil.contant){
          if(mapCeil.contant.config.liquid){
            mapCeil.contant.updateGeometry();
            break;
          }else{
            break;
          };
        };
      };
    };
  };
}
async function recalculateAmbientLight() {

  const updateID = Math.random();
  const airBlocks = [];

  for (let x = 0; x < size.width; x++) {
    for (let z = 0; z < size.width; z++) {
      let lightValue = 15;
      for (let y = size.height - 1; y >= 0; y--) {
        const mapCeil = map[x][z][y];
        mapCeil.lightUpdateId = updateID;
        if (mapCeil.contant != null) {
          if (mapCeil.contant.config.transparent != 0) {
            lightValue -= mapCeil.contant.config.lightRefraction;
            airBlocks.push(mapCeil);
          } else {
            if(mapCeil.contant.config.lightBlock){
              lightValue = mapCeil.contant.config.lightValue;
              airBlocks.push(mapCeil);
            }else{
              lightValue = 0;
            }
          }
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

  const needUpdate = []
  airBlocks.forEach((mapCeil, i) => {
    if (mapCeil.lightValue != mapCeil.lastLightValue) {
      mapCeil.lastLightValue = mapCeil.lightValue;
      needUpdate.push(mapCeil);
    };
  });

  const blocks = []
  needUpdate.forEach((mapCeil, i) => {
    mapCeil.crossNeighbors.forEach((neighbour, i) => {
      if (neighbour) {
        if (neighbour.contant) {
          blocks.push(neighbour.contant)
        };
      };
    });
  });

  let blockIndex = -1;
  async function updateBlockTexture() {
    blockIndex++;
    if (blockIndex < blocks.length) {
      if (blocks[blockIndex].meshAddedToScene) {
        blocks[blockIndex].updateShadow().then(function() {
          return updateBlockTexture();
        });
      } else {
        return updateBlockTexture();
      };
    } else {
      return true;
    };
  };
  return updateBlockTexture();
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
          if (blockType === 'stone' || blockType === 'ground' || blockType === 'sand' || blockType === 'snow' || blockType === 'grass' || blockType === 'water') {
            let block = BLOCK.get(blockType);
            block.setPosition({
              x,
              y,
              z
            });
            if(blockType === 'water'){
              block.fluidity = 8;
              block.waterfall = false;
            };
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
            if (blockType === 'stone' || blockType === 'ground' || blockType === 'sand' || blockType === 'snow' || blockType === 'water') {
              let block = BLOCK.get(blockType);
              block.setPosition({
                x,
                y,
                z
              });
              if(blockType === 'water'){
                block.fluidity = 8;
              };
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
  updateWaterGeometry,
  recalculateAmbientLight,
};

export {
  WORLD
};
