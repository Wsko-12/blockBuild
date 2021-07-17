import * as THREE from '../../ThreeJsLib/build/three.module.js';
import {
  MAIN
} from '../main.js';

// import {OrbitControls} from '../../ThreeJsLib/examples/jsm/controls/OrbitControls.js';
// const controls = new OrbitControls( camera, renderer.domElement );
import Stats from '../../ThreeJsLib/examples/jsm/libs/stats.module.js';
const stats = new Stats();
let renderStarted = false;
const mouseBoxes = new THREE.Group();
const blocks = new THREE.Group();
const renderer = new THREE.WebGLRenderer();
const camera = new THREE.PerspectiveCamera(10, 2, 1, 1000);
const scene = new THREE.Scene();
const config = {
  textureSize:16,
  softShadows:true,
  helpers:{},
  clearHelper: function(name){
    if(name){
      this.helpers[name].clear();
    }else{
      for(let name in this.helpers){
        this.helpers[name].clear();
      };
    };
  },
};
const cameraPosition = {
  deg:0,//угол на окружности xz
  radius:80,//радиус круга по xz
  heigh:45, //высота на y
  cameraTargetHeigh:40
}








const setSizes = function(){
   const windowWidth = document.body.clientWidth;
   const windowHeight = document.body.clientHeight;
   const pixelRatio = window.devicePixelRatio;
   renderer.setSize(windowWidth * pixelRatio, windowHeight * pixelRatio, true);
   renderer.domElement.style.position = 'fixed';
   renderer.domElement.style.width = windowWidth + 'px';
   renderer.domElement.style.height = windowHeight + 'px';
   camera.aspect = windowWidth / windowHeight;
   camera.updateProjectionMatrix();
   renderer.domElement.showContextMenu = function(e){
     e.preventDefault();
   }
};


const init = function() {
  scene.add(mouseBoxes);
  scene.add(blocks);


	document.querySelector('#render').appendChild( stats.dom );
  if(document.body.clientWidth < document.body.clientHeight){
    stats.domElement.childNodes.forEach((canvas, i) => {
      canvas.style.width = '20vw';
      canvas.style.height = '12vw';
    });
  };




  document.querySelector('#render').appendChild(renderer.domElement);
  camera.position.set(50,20,50);
  camera.lookAt(0,0,0);
  renderer.domElement.style.position = 'fixed';
  scene.background = new THREE.Color(0xb8d6ff);
  window.addEventListener("resize", setSizes);
  setSizes();
};


const render = function(){
  // controls.update();
  renderStarted = true;
  stats.update();
  renderer.render(scene, camera);
  requestAnimationFrame(render);
};


const RENDER = {
  mouseBoxes,
  renderer,
  scene,
  camera,
  init,
  render,
  config,
  blocks,
  cameraPosition,
};

export {
  RENDER
}
