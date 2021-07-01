import * as THREE from '../../../ThreeJsLib/build/three.module.js';
import {
  MAIN
} from '../../main.js';
import {BLOCK} from './block.js';



const mouse = {
  x: 0,
  y: 0,
  down: false,
  downMoved: false,
  shake: 1, // допустимое дрожание мыши в px

  touchX: 0,
  touchY: 0,
  touchDown: false,
  touchMoved: false,
  touchShake: 1,



};



const init = function() {

  const raycaster = new THREE.Raycaster();

  function removeBlock(x, y) {
    console.log('remove')
    const mouseRaycast = new THREE.Vector2();
    mouseRaycast.x = (x / window.innerWidth) * 2 - 1;
    mouseRaycast.y = -(y / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouseRaycast, MAIN.render.camera);
    const intersects = raycaster.intersectObjects(MAIN.render.mouseBoxes.children);
    for (let i = 0; i < intersects.length; i++) {
      // console.log(intersects[i].object);
      // if (intersects[i].object.gameBlock.name != 'water') {
      //   intersects[i].object.gameBlock.removeBlock();
      //   return
      // };

      MAIN.game.world.map.removeBlock(intersects[i].object.userData.block);

      return;
    };
  };








  const body = document.querySelector('body');


  body.addEventListener('mousemove', function(event) {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
  });


  body.addEventListener('mousedown', function(event) {

    if (!event.sourceCapabilities.firesTouchEvents) { //отключить клик на телефоне
      //указываем, что мышка нажата
      mouse.down = true;
      checkMouseDownMove();
    };
  });

  body.addEventListener('mouseup', function(event) {
    if (!event.sourceCapabilities.firesTouchEvents) { //отключить клик на телефоне
      mouse.down = false;
    };
  });

  body.addEventListener('wheel', function(event) {
    if (event.deltaY > 0) {
      updateCameraZoom(true)
    } else {
      updateCameraZoom(false)
    }
  });

  function buildBlock(x,y){
    console.log('build')
    const mouseRaycast = new THREE.Vector2();
    mouseRaycast.x = (x / window.innerWidth) * 2 - 1;
    mouseRaycast.y = -(y / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouseRaycast, MAIN.render.camera);
    const intersects = raycaster.intersectObjects(MAIN.render.mouseBoxes.children);
    // console.log(intersects);
        const positionShift = {
          x: intersects[0].point.x - intersects[0].object.position.x,
          y: intersects[0].point.y - intersects[0].object.position.y,
          z: intersects[0].point.z - intersects[0].object.position.z,
        }

        for(let key in positionShift){
          if(positionShift[key] % 0.5 === 0){
            positionShift[key] = positionShift[key]*2
          }else{
            positionShift[key] = 0;
          }
        }

        const position = {
          x : Math.round(intersects[0].object.position.x + positionShift.x),
          y : Math.round(intersects[0].object.position.y + positionShift.y),
          z : Math.round(intersects[0].object.position.z + positionShift.z),
        }

        if(position.x >= MAIN.game.world.size.width || position.x < 0) return;
        if(position.z >= MAIN.game.world.size.width || position.z < 0) return;
        if(position.y >= MAIN.game.world.size.heigh || position.y < 0) return;
        if(MAIN.game.world.map[position.x][position.z][position.y].contant != null)return;


        const block = BLOCK.get('test');
        block.setPosition(position);
        MAIN.game.world.map.addBlock(block);








    // for (let i = 0; i < intersects.length; i++) {

    //   if (intersects[i].object.gameBlock.name != 'water') {
    //     const geom = new THREE.BoxBufferGeometry(1,1,1);
    //     const material = new THREE.MeshBasicMaterial({color:0xe40e0e});
    //     const mesh = new THREE.Mesh(geom,material);
    //
    //
    //     const positionShift = {
    //       x: intersects[i].point.x - intersects[i].object.position.x,
    //       y: intersects[i].point.y - intersects[i].object.position.y,
    //       z: intersects[i].point.z - intersects[i].object.position.z,
    //     }
    //
    //     for(let key in positionShift){
    //       if(positionShift[key] % 0.5 === 0){
    //         positionShift[key] = positionShift[key]*2
    //       }else{
    //         positionShift[key] = 0;
    //       }
    //     }
    //
    //     const position = {
    //       x : Math.round(intersects[i].object.position.x + positionShift.x),
    //       y : Math.round(intersects[i].object.position.y + positionShift.y),
    //       z : Math.round(intersects[i].object.position.z + positionShift.z),
    //     }
    //
    //
    //
    //     if(position.x >= GAME.generations.mapSizes.mapWidth || position.x < 0) return;
    //     if(position.z >= GAME.generations.mapSizes.mapWidth || position.z < 0) return;
    //     if(position.y >= GAME.generations.mapSizes.mapHeight || position.y < 0) return;
    //     if(GAME.gameWorld.world[position.x][position.z][position.y].contain.length > 0)return;
    //
    //
    //
    //     GAME.blocks.addBlock(position,'sand');;
    //     return
    //   };
    //
    // };
  };






  function checkMouseDownMove() {
    //сохраняем позиции мышки во время клика
    const x = mouse.x;
    const y = mouse.y;

    //через задержку перепроверяем
    setTimeout(function() {
      if (Math.abs(x - mouse.x) > mouse.shake || Math.abs(y - mouse.y) > mouse.shake) {
        //если мышка достаточно сдвинулась, то крутим камеру
        checkMoveValue(x, y);
      } else {
        if (mouse.down) {
          //если мышка до сих пор зажата и не сдвинута, то убираем блок
          removeBlock(x, y);
        } else {
          //если мышка к этому моменту отжата, то строим блок
          buildBlock(x,y)
        }
      }
    }, 300);
  };

  function checkMoveValue(lastX, lastY) {
    //из-за того, что тут мышка должна быть нажата при прокрутке камеры, то эта функция нужна
    const thisX = mouse.x;
    const thisY = mouse.y;
    if (mouse.down) {
      setTimeout(function() {
        checkMoveValue(thisX, thisY);
      });
      if (thisX != lastX || thisY != lastY) {
        updateCameraPosition(lastX - thisX, lastY - thisY);
      };
    };
  };









  const clientInfoDiv = `<div id='userInfo' style="position:fixed;left:10px;bottom:0px;z-index:100;color:rgb(0, 56, 255);font-size:20px"></div>`

  body.insertAdjacentHTML('beforeEnd', clientInfoDiv);


  body.addEventListener('touchmove', function(event) {
    mouse.touchX = Math.round(event.touches[0].clientX);
    mouse.touchY = Math.round(event.touches[0].clientY);
  });

  body.addEventListener('touchstart', function(event) {
    //сохраняем корды, потому что так просто они не апдейтятся
    mouse.touchX = Math.round(event.touches[0].clientX);
    mouse.touchY = Math.round(event.touches[0].clientY);
    mouse.touchDown = true;
    //сохраняем корды до задержки
    const lastX = mouse.touchX;
    const lastY = mouse.touchY;


    //если касание в левой части экрана (10%), то это зумирование
    if(mouse.touchX < window.innerWidth * 0.1){
      // function touchZoom(firstY){
      //   if(mouse.touchDown ){
      //     setTimeout(function(){
      //       if(lastY<mouse.touchY){
      //         updateCameraZoom(true)
      //       }else{
      //         updateCameraZoom(false)
      //       }
      //       touchZoom(firstY)
      //     },10);
      //   }
      // }
      // touchZoom(lastY);

      function touchZoom2(){
        if(mouse.touchDown){
          setTimeout(function(){
            const zoomValue = mouse.touchY/window.innerHeight;
            updateCameraZoom(zoomValue);
            touchZoom2()
          });
        };
      };
      touchZoom2()





    }else{
      setTimeout(function() {
        mouse.touchCount = event.touches.length;
          // mouse.touchMove  = Math.abs(mouse.touchX - lastX)>mouse.touchShake || Math.abs(mouse.touchY - lastY)>mouse.touchShake? true:false;
          //если палец сдвинулся, то двигаем камеру
          if (Math.abs(mouse.touchX - lastX) > mouse.touchShake || Math.abs(mouse.touchY - lastY) > mouse.touchShake) {
            checkTouchMoveValue(lastX, lastY)
          } else {
            //если все еще зажата, то убираем блок
            if (mouse.touchDown) {
              removeBlock(lastX, lastY)
            } else {
              //палец отжал, значит строим блок
              console.log('build block')
            }
          }
      }, 350);
    }
  });




  body.addEventListener('touchend', function(event) {
    mouse.touchDown = false;
  });


  function checkTouchMoveValue(lastX, lastY) {
    const thisX = mouse.touchX;
    const thisY = mouse.touchY;

    if (mouse.touchDown) {
      setTimeout(function() {
        checkTouchMoveValue(thisX, thisY);
      });
      if (thisX != lastX || thisY != lastY) {
        // /2 чтобы замедлить
        updateCameraPosition((lastX - thisX)/2, (lastY - thisY)/2);
      };
    };
  };






  function updateCameraPosition(xValue, yValue) {
    //360-значит, что если проведет от начала экрана до конца, то камера прокрутится на 360
    //xValue*100/window.innerWidth - на сколько сдвинулось: 1 -- от начала до конца экрана
    const degChange = 360 * xValue / window.innerWidth * window.devicePixelRatio;

    MAIN.render.cameraPosition.deg += degChange;
    if (MAIN.render.cameraPosition.deg >= 360) {
      MAIN.render.cameraPosition.deg -= 360;
    }
    if (MAIN.render.cameraPosition.deg < 0) {
      MAIN.render.cameraPosition.deg += 360;
    }
    // console.log(MAIN.render.cameraPosition.deg);
    MAIN.render.camera.position.x = Math.sin(MAIN.render.cameraPosition.deg * Math.PI / 180) * MAIN.render.cameraPosition.radius + 7;
    MAIN.render.camera.position.z = Math.cos(MAIN.render.cameraPosition.deg * Math.PI / 180) * MAIN.render.cameraPosition.radius + 7;

    const heighChange = 64 * (-yValue / window.innerWidth * window.devicePixelRatio);
    MAIN.render.cameraPosition.heigh += heighChange;
    if (MAIN.render.cameraPosition.heigh > 64 + MAIN.render.cameraPosition.cameraTargetHeigh) {
      MAIN.render.cameraPosition.heigh = 64 + MAIN.render.cameraPosition.cameraTargetHeigh;
    }
    if (MAIN.render.cameraPosition.heigh < 0) {
      MAIN.render.cameraPosition.heigh = 0;
    }

    MAIN.render.camera.position.y = MAIN.render.cameraPosition.heigh;

    MAIN.render.camera.lookAt(MAIN.game.world.size.width/2 - 1, MAIN.render.cameraPosition.heigh - MAIN.render.cameraPosition.cameraTargetHeigh, MAIN.game.world.size.width/2 - 1);
  };

  updateCameraPosition(0, 0);



  function updateCameraZoom(bool) {
    const maxZoom = 300;
    const minZoom = 10;
    if(typeof bool === 'boolean'){
      if (bool) {
        if (MAIN.render.cameraPosition.radius < maxZoom) {
          MAIN.render.cameraPosition.radius += 1
        }
      } else {
        if (MAIN.render.cameraPosition.radius > minZoom) {
          MAIN.render.cameraPosition.radius -= 1
        }
      }
    }else{

      bool > 1 ? bool = 1:false;
      bool < 0 ? bool = 0:false;

      let zoomValue = Math.round(maxZoom*bool)+minZoom;
      if(zoomValue > maxZoom){
        zoomValue = maxZoom
      }else if(zoomValue<minZoom){
        zoomValue = minZoom
      }
      MAIN.render.cameraPosition.radius = zoomValue;
    }
    updateCameraPosition(0, 0);
  }
};




const USER_ACTIONS = {
  mouse,
  init,
};

export {
  USER_ACTIONS
};
