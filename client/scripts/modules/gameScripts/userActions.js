import * as THREE from '../../../ThreeJsLib/build/three.module.js';
import {
  MAIN
} from '../../main.js';
import {BLOCK} from './block.js';


const user = {
  selectedBlock:'grass',
  mouseOnButtons:false,
}
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
    if(!user.mouseOnButtons){
      const mouseRaycast = new THREE.Vector2();
      mouseRaycast.x = (x / window.innerWidth) * 2 - 1;
      mouseRaycast.y = -(y / window.innerHeight) * 2 + 1;
      raycaster.setFromCamera(mouseRaycast, MAIN.render.camera);
      const intersects = raycaster.intersectObjects(MAIN.render.mouseBoxes.children);
      if(intersects[0]){
        for (let i = 0; i < intersects.length; i++) {
          const checkedBlock = intersects[i].object.userData.block;
          if (!checkedBlock.config.liquid) {
            MAIN.game.world.map.removeBlock(checkedBlock);
            return;
          };
        };
      };
    };
  };

  function buildBlock(x,y){
    // console.log('build')



    if(user.selectedBlock === 'bucket'){
      const mouseRaycast = new THREE.Vector2();
      mouseRaycast.x = (x / window.innerWidth) * 2 - 1;
      mouseRaycast.y = -(y / window.innerHeight) * 2 + 1;
      raycaster.setFromCamera(mouseRaycast, MAIN.render.camera);

      const intersects = raycaster.intersectObjects(MAIN.render.mouseBoxes.children);
      if(intersects[0]){
        const checkedBlock = intersects[0].object.userData.block;
        if(checkedBlock.config.liquid){
          MAIN.game.world.map.removeBlock(checkedBlock);
        };
      };
      return;
    };
    if(!user.mouseOnButtons){
      const mouseRaycast = new THREE.Vector2();
      mouseRaycast.x = (x / window.innerWidth) * 2 - 1;
      mouseRaycast.y = -(y / window.innerHeight) * 2 + 1;
      raycaster.setFromCamera(mouseRaycast, MAIN.render.camera);
      const intersects = raycaster.intersectObjects(MAIN.render.mouseBoxes.children);
      if(intersects[0]){
        for (let i = 0; i < intersects.length; i++) {
          const checkedBlock = intersects[i].object.userData.block;
          if (!checkedBlock.config.liquid) {

            //если блоки с обычной или подкорректированой геометрией (полублоки и тд)
            let direction = [0,0,0]
            if(checkedBlock.config.geometry === 0 || checkedBlock.config.geometry === 1 ){
              let faceIndex = Math.floor(intersects[i].faceIndex / 2);
              if(faceIndex === 0){
                direction[0] = 1;
              };
              if(faceIndex === 1){
                direction[0] = -1;
              };
              if(faceIndex === 2){
                direction[1] = 1;
              };
              if(faceIndex === 3){
                direction[1] = -1;
              };
              if(faceIndex === 4){
                direction[2] = 1;
              };
              if(faceIndex === 5){
                direction[2] = -1;
              };

              const blockPosition = {x:checkedBlock.position.x + direction[0],y:checkedBlock.position.y + direction[1],z:checkedBlock.position.z + direction[2]};

              const firstPosition = checkedBlock.position;
              const cameraPosition = MAIN.render.camera.position;



              //так как я знаю, под каким углом находится камера к игровому полю то исходя из этого будет считаться поворот блока;

              let rotation;
              // против часовой стрелки начиная с востока
              //0 - блок лицом на восток
              //1 - блок лицом на север
              //2 - блок лицом на запад
              //3 - блок лицом на юг
              // разбиваем окружность по секторам (вместо ⊕ используем ⊗)
              if(MAIN.render.cameraPosition.deg > 315 && MAIN.render.cameraPosition.deg <= 360 || MAIN.render.cameraPosition.deg >= 0 && MAIN.render.cameraPosition.deg < 45){
                rotation = 0;
              }else if(MAIN.render.cameraPosition.deg >= 45 && MAIN.render.cameraPosition.deg < 135){
                rotation = 1;
              }else if(MAIN.render.cameraPosition.deg >= 135 && MAIN.render.cameraPosition.deg < 225){
                rotation = 2;
              }else if(MAIN.render.cameraPosition.deg >= 225 && MAIN.render.cameraPosition.deg < 315){
                rotation = 3;
              }

              let rotationConfig = {
                faceIndex,
                rotation,
              }


              const block = BLOCK.get(user.selectedBlock);
              if(block.name === 'water'){
                block.fluidity = 8;
                block.waterfall = false;
              }
              if(block.name === 'lava'){
                block.fluidity = 4;
                block.waterfall = false;
              };
              block.setPosition(blockPosition);
              block.rotateBlock(rotationConfig);



              //если блок на который нажали емеет специальную функцию прикрепления, то идет по его правилам
              if(checkedBlock.config.uniqueAttachment){
                const config = {
                  block,
                  faceIndex,
                };
                if(checkedBlock.config.uniqueAttachmentFunction(config)){
                  addBlock();
                };
              }else{
                addBlock();
              };


              function addBlock(){
                //если блок который нужно добавить емеет специальную функцию добавления
                if(block.config.uniqueAdd){
                  const config = {
                    checkedBlock,
                    faceIndex,
                  };
                  if(block.config.uniqueAddFunction(block,config)){
                    if(checkedBlock.mapCeil.crossNeighbors[faceIndex].contant === null){
                      MAIN.game.world.map.addBlock(block);
                    };
                    if(checkedBlock.mapCeil.crossNeighbors[faceIndex].contant.config.liquid){
                      if(!block.config.destroyedByLiquid){
                        MAIN.game.world.map.addBlock(block);
                      };
                    };
                  };
                }else{
                  if(checkedBlock.mapCeil.crossNeighbors[faceIndex]){
                    if(checkedBlock.mapCeil.crossNeighbors[faceIndex].contant === null){
                      MAIN.game.world.map.addBlock(block);
                    };
                    if(checkedBlock.mapCeil.crossNeighbors[faceIndex].contant.config.liquid){
                      if(!block.config.destroyedByLiquid){
                        MAIN.game.world.map.addBlock(block);
                      };
                    };
                  };
                };
              };
            };
            return;
          };
        };
      };
    };

  };








  const MOUSE_CEAPER = document.querySelector('#mouseCeaper');


  MOUSE_CEAPER.addEventListener('mousemove', function(event) {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
  });


  MOUSE_CEAPER.addEventListener('mousedown', function(event) {

    if (!event.sourceCapabilities.firesTouchEvents) { //отключить клик на телефоне
      //указываем, что мышка нажата
      mouse.down = true;
      checkMouseDownMove();
    };
  });

  MOUSE_CEAPER.addEventListener('mouseup', function(event) {
    if (!event.sourceCapabilities.firesTouchEvents) { //отключить клик на телефоне
      mouse.down = false;
    };
  });

  MOUSE_CEAPER.addEventListener('wheel', function(event) {
    if (event.deltaY > 0) {
      updateCameraZoom(true)
    } else {
      updateCameraZoom(false)
    }
  });


  MOUSE_CEAPER.addEventListener('keydown',function(e){
    if(e.key === 'b'){
      const mouseRaycast = new THREE.Vector2();
      mouseRaycast.x = (mouse.x / window.innerWidth) * 2 - 1;
      mouseRaycast.y = -(mouse.y / window.innerHeight) * 2 + 1;
      raycaster.setFromCamera(mouseRaycast, MAIN.render.camera);
      const intersects = raycaster.intersectObjects(MAIN.render.mouseBoxes.children);
      for (let i = 0; i < intersects.length; i++) {
        // console.log(intersects[i].object);
        // if (intersects[i].object.gameBlock.name != 'water') {
        //   intersects[i].object.gameBlock.removeBlock();
        //   return
        // };

        intersects[i].object.userData.block.mapCeil.closeNeighbors.forEach((neighbor, i) => {
          if(neighbor){
            if(neighbor.contant){
                MAIN.game.world.map.removeBlock(neighbor.contant);
            }
          }
        });
        MAIN.game.world.map.removeBlock(intersects[i].object.userData.block);
      return;
      }
    };
  })








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
      requestAnimationFrame(function(){
        checkMoveValue(thisX, thisY);
      });
      if (thisX != lastX || thisY != lastY) {
        updateCameraPosition(lastX - thisX, lastY - thisY);
      };
    };
  };













  MOUSE_CEAPER.addEventListener('touchmove', function(event) {
    mouse.touchX = Math.round(event.touches[0].clientX);
    mouse.touchY = Math.round(event.touches[0].clientY);
  });

  MOUSE_CEAPER.addEventListener('touchstart', function(event) {
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
              buildBlock(lastX,lastY)
            }
          }
      }, 350);
    }
  });




  MOUSE_CEAPER.addEventListener('touchend', function(event) {
    mouse.touchDown = false;
  });


  function checkTouchMoveValue(lastX, lastY) {
    const thisX = mouse.touchX;
    const thisY = mouse.touchY;

    if (mouse.touchDown) {
      requestAnimationFrame(function(){
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
    //MAIN.render.cameraPosition.deg+90 --- +90 чтобы сделать 0 градусов на восток;
    MAIN.render.camera.position.x = Math.sin((MAIN.render.cameraPosition.deg+90) * Math.PI / 180) * MAIN.render.cameraPosition.radius + 12;
    MAIN.render.camera.position.z = Math.cos((MAIN.render.cameraPosition.deg+90) * Math.PI / 180) * MAIN.render.cameraPosition.radius + 12;



    ;

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
  user,
};

export {
  USER_ACTIONS
};
