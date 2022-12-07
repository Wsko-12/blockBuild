import {
  MAIN
} from '../../main.js';
import {
  BLOCKS_BASE
} from '../bases/blocks_base.js';

function init() {
  const interfaceLayout = `
    <div id="interface_center" style="display:none">
      <div id="menu_container" class="blur_background">
        <div id="menu_container-inner">
          <div id="menu_container-top">
            <div id="menu_container-tabs">
              <div class="menu_tab menu_tab-selected">
                <div class="menu_tab-title">
                  Blocks
                </div>
              </div>
              <div class="menu_tab">
                <div class="menu_tab-title">
                  Settings
                </div>
              </div>
            </div>
            <div id="menu_container-close">

              <div id="menu_container-closeIcon">✖</div>
            </div>
          </div>

          <div id="menu_container-contantContainer">
            <div id="menu_inventary" class="menu_contant">
              <div id="menu_inventary-top">
                <div id="menu_inventary-resent_container">

                </div>
              </div>
              <div id="menu_inventary-bottom">
                <div id="menu_inventary-all_container">

                </div>

              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  `

  const interfaceFooter = `
  <div id="interface_footer" style="pointer-events:none">
    <div id="current_container" class="blur_background" style="pointer-events:auto">
      <div id="current_imagebox">
        <img id="current_image" src="textures/inventary/${MAIN.game.userActions.user.selectedBlock}.png">
      </div>
    </div>
    <div id="staticCamera_container" class="blur_background" style="pointer-events:auto;display:none">
      <div id="staticCamera_imagebox">
        <img id="staticCamera_image" src="textures/inventary/cameraCross.png">
      </div>
    </div>
  </div>
  `

  document.querySelector('#interface').insertAdjacentHTML('beforeEnd', interfaceLayout);
  document.querySelector('#mouseCeaper_section').insertAdjacentHTML('beforeEnd', interfaceFooter);


  function openMenu(open) {
    if (!open) {
      document.querySelector('#interface_center').style.display = 'none';
      document.querySelector('#mouseCeaper_section').style.pointerEvents = 'auto';
    } else {
      document.querySelector('#interface_center').style.display = 'flex';
      document.querySelector('#mouseCeaper_section').style.pointerEvents = 'none';
    };
  };

  document.querySelector('#menu_container-close').addEventListener('click', function() {
    openMenu(false);
  });

  document.querySelector('#current_container').addEventListener('click', function() {
    openMenu(true);
  });

  document.querySelector('#staticCamera_container').addEventListener('click', function() {
    enableStaticCamera(false);
  });




  const inventary = document.querySelector('#menu_inventary-all_container');
  for (let block in BLOCKS_BASE) {
    // console.log(block);
    if (block != 'init') {
      let blockDiv = `
      <div class="menu_inventary-ceil" id="inventaryCeil-${block}" data-name="${block}">
        <img class="menu_inventary-ceil-image" src="textures/inventary/${block}.png">
      </div>`

      let blockDivResent = `
        <div class="menu_inventary-ceil" id="inventaryCeil-${block}_resent" data-name="${block}">
          <img class="menu_inventary-ceil-image" src="textures/inventary/${block}.png">
        </div>
      `
      inventary.insertAdjacentHTML('beforeEnd', blockDiv);
      document.querySelector(`#inventaryCeil-${block}`).onclick = function() {
        const resent = document.querySelector('#menu_inventary-resent_container');
        resent.childNodes.forEach((child, i) => {
          if(child.nodeName === 'DIV'){
            if(child.dataset.name === block){
              resent.removeChild(child)
            };
          };
        });
        MAIN.game.userActions.user.selectedBlock = block;
        document.querySelector(`#current_image`).src = `textures/inventary/${block}.png`;
        resent.insertAdjacentHTML('afterBegin',blockDivResent);
        document.querySelector(`#inventaryCeil-${block}_resent`).onclick = function() {
          MAIN.game.userActions.user.selectedBlock = block;
          document.querySelector(`#current_image`).src = `textures/inventary/${block}.png`;
        };
      };
    };
  };
};



function enableStaticCamera(bool){
  const button = document.querySelector('#staticCamera_container');
  if(bool){
    button.style.display = 'flex';
    MAIN.render.camera.fov = 80;
    MAIN.render.camera.updateProjectionMatrix();
  }else{
    button.style.display = 'none';
    MAIN.render.camera.fov = 10;
    MAIN.render.camera.updateProjectionMatrix();
    MAIN.game.userActions.user.staticCamera = false;
    MAIN.game.userActions.updateCameraPosition(0,0);
  };
};


const GAME_INTERFACE = {
  init,
  enableStaticCamera,

};

export {
  GAME_INTERFACE
};
