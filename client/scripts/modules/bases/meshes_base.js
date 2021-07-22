import * as THREE from '../../../ThreeJsLib/build/three.module.js';
import {
  TEXTURES_BASE
} from './textures_base.js';
import {
  GEOMETRY_BASE
} from './geometry_base.js';

const loader = new THREE.ObjectLoader();



function init() {

  MESHES_BASE.test = {
    G: 'block',
    M: [
      //ewtbsn
      new THREE.MeshBasicMaterial({
        map: TEXTURES_BASE.atlas.east,
      }),
      new THREE.MeshBasicMaterial({
        map: TEXTURES_BASE.atlas.west,
      }),
      new THREE.MeshBasicMaterial({
        map: TEXTURES_BASE.atlas.top,
      }),
      new THREE.MeshBasicMaterial({
        map: TEXTURES_BASE.atlas.bottom,
      }),
      new THREE.MeshBasicMaterial({
        map: TEXTURES_BASE.atlas.south,
      }),
      new THREE.MeshBasicMaterial({
        map: TEXTURES_BASE.atlas.north,
      }),
    ],
  };

  MESHES_BASE.stone = {
    G: 'block',
    M: [
      //ewtbsn
      new THREE.MeshBasicMaterial({
        map: TEXTURES_BASE.atlas.stone,
      }),
      new THREE.MeshBasicMaterial({
        map: TEXTURES_BASE.atlas.stone,
      }),
      new THREE.MeshBasicMaterial({
        map: TEXTURES_BASE.atlas.stone,
      }),
      new THREE.MeshBasicMaterial({
        map: TEXTURES_BASE.atlas.stone,
      }),
      new THREE.MeshBasicMaterial({
        map: TEXTURES_BASE.atlas.stone,
      }),
      new THREE.MeshBasicMaterial({
        map: TEXTURES_BASE.atlas.stone,
      }),
    ],
  };
  MESHES_BASE.ground = {
    G: 'block',
    M: [
      //ewtbsn
      new THREE.MeshBasicMaterial({
        map: TEXTURES_BASE.atlas.ground,
      }),
      new THREE.MeshBasicMaterial({
        map: TEXTURES_BASE.atlas.ground,
      }),
      new THREE.MeshBasicMaterial({
        map: TEXTURES_BASE.atlas.ground,
      }),
      new THREE.MeshBasicMaterial({
        map: TEXTURES_BASE.atlas.ground,
      }),
      new THREE.MeshBasicMaterial({
        map: TEXTURES_BASE.atlas.ground,
      }),
      new THREE.MeshBasicMaterial({
        map: TEXTURES_BASE.atlas.ground,
      }),
    ],
  };

  MESHES_BASE.sand = {
    G: 'block',
    M: [
      //ewtbsn
      new THREE.MeshBasicMaterial({
        map: TEXTURES_BASE.atlas.sand,
      }),
      new THREE.MeshBasicMaterial({
        map: TEXTURES_BASE.atlas.sand,
      }),
      new THREE.MeshBasicMaterial({
        map: TEXTURES_BASE.atlas.sand,
      }),
      new THREE.MeshBasicMaterial({
        map: TEXTURES_BASE.atlas.sand,
      }),
      new THREE.MeshBasicMaterial({
        map: TEXTURES_BASE.atlas.sand,
      }),
      new THREE.MeshBasicMaterial({
        map: TEXTURES_BASE.atlas.sand,
      }),
    ],
  };

  MESHES_BASE.snow = {
    G: 'block',
    M: [
      //ewtbsn
      new THREE.MeshBasicMaterial({
        map: TEXTURES_BASE.atlas.snow,
      }),
      new THREE.MeshBasicMaterial({
        map: TEXTURES_BASE.atlas.snow,
      }),
      new THREE.MeshBasicMaterial({
        map: TEXTURES_BASE.atlas.snow,
      }),
      new THREE.MeshBasicMaterial({
        map: TEXTURES_BASE.atlas.snow,
      }),
      new THREE.MeshBasicMaterial({
        map: TEXTURES_BASE.atlas.snow,
      }),
      new THREE.MeshBasicMaterial({
        map: TEXTURES_BASE.atlas.snow,
      }),
    ],
  };

  //newBlockHere

  MESHES_BASE.grass = {
    G: 'block',
    M: [
      //ewtbsn
      new THREE.MeshBasicMaterial({
        map: TEXTURES_BASE.atlas.grass_side,
      }),
      new THREE.MeshBasicMaterial({
        map: TEXTURES_BASE.atlas.grass_side,
      }),
      new THREE.MeshBasicMaterial({
        map: TEXTURES_BASE.atlas.grass_top,
      }),
      new THREE.MeshBasicMaterial({
        map: TEXTURES_BASE.atlas.ground,
      }),
      new THREE.MeshBasicMaterial({
        map: TEXTURES_BASE.atlas.grass_side,
      }),
      new THREE.MeshBasicMaterial({
        map: TEXTURES_BASE.atlas.grass_side,
      }),
    ],
  };

  MESHES_BASE.water = {
    G: 'block',
    M: [
      //ewtbsn
      new THREE.MeshBasicMaterial({
        map: TEXTURES_BASE.atlas.water_0,
        transparent: true,
      }),
      new THREE.MeshBasicMaterial({
        map: TEXTURES_BASE.atlas.water_0,
        transparent: true,
      }),
      new THREE.MeshBasicMaterial({
        map: TEXTURES_BASE.atlas.water_0,
        transparent: true,
      }),
      new THREE.MeshBasicMaterial({
        map: TEXTURES_BASE.atlas.water_0,
        transparent: true,
      }),
      new THREE.MeshBasicMaterial({
        map: TEXTURES_BASE.atlas.water_0,
        transparent: true,
      }),
      new THREE.MeshBasicMaterial({
        map: TEXTURES_BASE.atlas.water_0,
        transparent: true,
      }),
    ],
  };
  MESHES_BASE.lava = {
    G: 'block',
    M: [
      //ewtbsn
      new THREE.MeshBasicMaterial({
        map: TEXTURES_BASE.atlas.lava,
      }),
      new THREE.MeshBasicMaterial({
        map: TEXTURES_BASE.atlas.lava,
      }),
      new THREE.MeshBasicMaterial({
        map: TEXTURES_BASE.atlas.lava,
      }),
      new THREE.MeshBasicMaterial({
        map: TEXTURES_BASE.atlas.lava,
      }),
      new THREE.MeshBasicMaterial({
        map: TEXTURES_BASE.atlas.lava,
      }),
      new THREE.MeshBasicMaterial({
        map: TEXTURES_BASE.atlas.lava,
      }),
    ],
  };


  MESHES_BASE.cobblestone = {
    G: 'block',
    M: [
      //ewtbsn
      new THREE.MeshBasicMaterial({
        map: TEXTURES_BASE.atlas.cobblestone,
      }),
      new THREE.MeshBasicMaterial({
        map: TEXTURES_BASE.atlas.cobblestone,
      }),
      new THREE.MeshBasicMaterial({
        map: TEXTURES_BASE.atlas.cobblestone,
      }),
      new THREE.MeshBasicMaterial({
        map: TEXTURES_BASE.atlas.cobblestone,
      }),
      new THREE.MeshBasicMaterial({
        map: TEXTURES_BASE.atlas.cobblestone,
      }),
      new THREE.MeshBasicMaterial({
        map: TEXTURES_BASE.atlas.cobblestone,
      }),
    ],
  };

  MESHES_BASE.obsidian = {
    G: 'block',
    M: [
      //ewtbsn
      new THREE.MeshBasicMaterial({
        map: TEXTURES_BASE.atlas.obsidian,
      }),
      new THREE.MeshBasicMaterial({
        map: TEXTURES_BASE.atlas.obsidian,
      }),
      new THREE.MeshBasicMaterial({
        map: TEXTURES_BASE.atlas.obsidian,
      }),
      new THREE.MeshBasicMaterial({
        map: TEXTURES_BASE.atlas.obsidian,
      }),
      new THREE.MeshBasicMaterial({
        map: TEXTURES_BASE.atlas.obsidian,
      }),
      new THREE.MeshBasicMaterial({
        map: TEXTURES_BASE.atlas.obsidian,
      }),
    ],
  };

  MESHES_BASE.furnace = {
    G: 'block',
    M: [
      //ewtbsn
      new THREE.MeshBasicMaterial({
        map: TEXTURES_BASE.atlas.furnace_main,
      }),
      new THREE.MeshBasicMaterial({
        map: TEXTURES_BASE.atlas.furnace_side,
      }),
      new THREE.MeshBasicMaterial({
        map: TEXTURES_BASE.atlas.furnace_top,
      }),
      new THREE.MeshBasicMaterial({
        map: TEXTURES_BASE.atlas.furnace_top,
      }),
      new THREE.MeshBasicMaterial({
        map: TEXTURES_BASE.atlas.furnace_side,
      }),
      new THREE.MeshBasicMaterial({
        map: TEXTURES_BASE.atlas.furnace_side,
      }),
    ],
  };

  MESHES_BASE.oak_log = {
    G: 'block',
    M: [
      //ewtbsn
      new THREE.MeshBasicMaterial({
        map: TEXTURES_BASE.atlas.oak_log_side,
      }),
      new THREE.MeshBasicMaterial({
        map: TEXTURES_BASE.atlas.oak_log_side,
      }),
      new THREE.MeshBasicMaterial({
        map: TEXTURES_BASE.atlas.oak_log_top,
      }),
      new THREE.MeshBasicMaterial({
        map: TEXTURES_BASE.atlas.oak_log_top,
      }),
      new THREE.MeshBasicMaterial({
        map: TEXTURES_BASE.atlas.oak_log_side,
      }),
      new THREE.MeshBasicMaterial({
        map: TEXTURES_BASE.atlas.oak_log_side,
      }),
    ],

    M_R_1: [
      new THREE.MeshBasicMaterial({
        map: TEXTURES_BASE.atlas.oak_log_top,
      }),
      new THREE.MeshBasicMaterial({
        map: TEXTURES_BASE.atlas.oak_log_top,
      }),
      new THREE.MeshBasicMaterial({
        map: TEXTURES_BASE.atlas.oak_log_side_rotated,
      }),
      new THREE.MeshBasicMaterial({
        map: TEXTURES_BASE.atlas.oak_log_side_rotated,
      }),
      new THREE.MeshBasicMaterial({
        map: TEXTURES_BASE.atlas.oak_log_side_rotated,
      }),
      new THREE.MeshBasicMaterial({
        map: TEXTURES_BASE.atlas.oak_log_side_rotated,
      }),
    ],
  };

  MESHES_BASE.oak_leaves = {
    G: 'blockDoubleSided',
    M: [
      //ewtbsn
      new THREE.MeshBasicMaterial({
        map: TEXTURES_BASE.atlas.oak_leaves,
        alphaTest: 0.9,
        side: THREE.DoubleSide,
      }),
      new THREE.MeshBasicMaterial({
        map: TEXTURES_BASE.atlas.oak_leaves,
        alphaTest: 0.9,
        side: THREE.DoubleSide,
      }),
      new THREE.MeshBasicMaterial({
        map: TEXTURES_BASE.atlas.oak_leaves,
        alphaTest: 0.9,
        side: THREE.DoubleSide,
      }),
      new THREE.MeshBasicMaterial({
        map: TEXTURES_BASE.atlas.oak_leaves,
        alphaTest: 0.9,
        side: THREE.DoubleSide,
      }),
      new THREE.MeshBasicMaterial({
        map: TEXTURES_BASE.atlas.oak_leaves,
        alphaTest: 0.9,
        side: THREE.DoubleSide,
      }),
      new THREE.MeshBasicMaterial({
        map: TEXTURES_BASE.atlas.oak_leaves,
        alphaTest: 0.9,
        side: THREE.DoubleSide,
      }),
    ],
  };


  MESHES_BASE.cactus = {
    G: 'unique',
    M: [
      //ewtbsn
      new THREE.MeshBasicMaterial({
        map: TEXTURES_BASE.atlas.cactus_side,
        alphaTest: 0.9,
        side: THREE.DoubleSide,
      }),
      new THREE.MeshBasicMaterial({
        map: TEXTURES_BASE.atlas.cactus_side,
        alphaTest: 0.9,
        side: THREE.DoubleSide,
      }),
      new THREE.MeshBasicMaterial({
        map: TEXTURES_BASE.atlas.cactus_top,
        alphaTest: 0.9,
        side: THREE.DoubleSide,
      }),
      new THREE.MeshBasicMaterial({
        map: TEXTURES_BASE.atlas.cactus_top,
        alphaTest: 0.9,
        side: THREE.DoubleSide,
      }),
      new THREE.MeshBasicMaterial({
        map: TEXTURES_BASE.atlas.cactus_side,
        alphaTest: 0.9,
        side: THREE.DoubleSide,
      }),
      new THREE.MeshBasicMaterial({
        map: TEXTURES_BASE.atlas.cactus_side,
        alphaTest: 0.9,
        side: THREE.DoubleSide,
      }),
    ],

    G_F: function() {
      const geometry = new THREE.BoxGeometry(1, 1, 1);
      geometry.attributes.position.array = Float32Array.from([
        //east
        0.4375, 0.5, 0.5,
        0.4375, 0.5, -0.5,
        0.4375, -0.5, 0.5,
        0.4375, -0.5, -0.5,

        -0.4375, 0.5, -0.5,
        -0.4375, 0.5, 0.5,
        -0.4375, -0.5, -0.5,
        -0.4375, -0.5, 0.5,

        -0.5, 0.5, -0.5,
        0.5, 0.5, -0.5,
        -0.5, 0.5, 0.5,
        0.5, 0.5, 0.5,

        -0.5, -0.5, 0.5,
        0.5, -0.5, 0.5,
        -0.5, -0.5, -0.5,
        0.5, -0.5, -0.5,

        -0.5, 0.5, 0.4375,
        0.5, 0.5, 0.4375,
        -0.5, -0.5, 0.4375,
        0.5, -0.5, 0.4375,

        0.5, 0.5, -0.4375,
        -0.5, 0.5, -0.4375,
        0.5, -0.5, -0.4375,
        -0.5, -0.5, -0.4375
      ]);
      const vertexShadow = [];

      for (let i = 0; i < geometry.attributes.position.count; i++) {
        vertexShadow.push(1, 1, 1);
      }
      const vertexShadow32 = new Float32Array(
        vertexShadow
      );

      geometry.setAttribute('vertexShadow', new THREE.BufferAttribute(vertexShadow32, 3));

      return geometry;
    },
  };
};



function getMesh(name) {
  let geometry;
  if (MESHES_BASE[name].G === 'block') {
    geometry = new THREE.BoxBufferGeometry(1, 1, 1);
    const vertexShadow = [];

    for (let i = 0; i < geometry.attributes.position.count; i++) {
      vertexShadow.push(1, 1, 1);
    }
    const vertexShadow32 = new Float32Array(
      vertexShadow
    );

    geometry.setAttribute('vertexShadow', new THREE.BufferAttribute(vertexShadow32, 3));
  };

  if (MESHES_BASE[name].G === 'blockDoubleSided') {
    geometry = new THREE.BoxBufferGeometry(0.999, 0.999, 0.999);
    const vertexShadow = [];

    for (let i = 0; i < geometry.attributes.position.count; i++) {
      vertexShadow.push(1, 1, 1);
    }
    const vertexShadow32 = new Float32Array(
      vertexShadow
    );

    geometry.setAttribute('vertexShadow', new THREE.BufferAttribute(vertexShadow32, 3));
  };

  if (MESHES_BASE[name].G === 'unique') {
    geometry = MESHES_BASE[name].G_F();
  };



  let material = MESHES_BASE.getMeshMaterial(name);
  return new THREE.Mesh(geometry, material);
};


function updateShaders(material){
  material.forEach((side, i) => {
    side.onBeforeCompile = function(shader){

      const token_vs = `#include <clipping_planes_pars_vertex>`
      const vs = `
      #include <clipping_planes_pars_vertex>
      attribute  vec3 vertexShadow;
      varying vec3 vShadow;
      `

      shader.vertexShader = shader.vertexShader.replace(token_vs,vs);
      const token_vs_2 = `#include <begin_vertex>`

      const vs_2 = `
      vShadow = vertexShadow;
      #include <begin_vertex>`
      shader.vertexShader = shader.vertexShader.replace(token_vs_2,vs_2);



      const token_fs = `#include <clipping_planes_pars_fragment>`;
      const fs = `
        #include <clipping_planes_pars_fragment>
        varying vec3 vShadow;`
      shader.fragmentShader = shader.fragmentShader.replace(token_fs,fs);

      const token_fs_2 = `gl_FragColor = vec4( outgoingLight, diffuseColor.a );`;
      const fs_2 = `gl_FragColor = vec4( outgoingLight, diffuseColor.a )*vec4(vShadow,1);`
      shader.fragmentShader = shader.fragmentShader.replace(token_fs_2,fs_2);

    };

  });
}







function getMeshMaterial(name) {
  const stockMaterial = MESHES_BASE[name].M;
  const newMaterial = [];
  stockMaterial.forEach((side, i) => {
    newMaterial.push(side.clone())
  });

  if(name != 'water' &&  name != 'lava'){
    updateShaders(newMaterial);
  }
  return newMaterial;
};

function getMeshMaterial_Rotated_1(name) {
  const stockMaterial = MESHES_BASE[name].M_R_1;
  const newMaterial = [];
  stockMaterial.forEach((side, i) => {
    newMaterial.push(side.clone())
  });
  updateShaders(newMaterial);
  return newMaterial;
};




const MESHES_BASE = {
  init,
  getMesh,
  getMeshMaterial,
  getMeshMaterial_Rotated_1,
};








export {
  MESHES_BASE
};
