(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (factory());
}(this, (function () { 'use strict';

  /* global AFRAME, THREE */
  const PMREMGenerator = require('./lib/PMREMGenerator');
  const PMREMCubeUVPacker = require('./lib/PMREMCubeUVPacker');

  if (typeof AFRAME === 'undefined') {
    throw new Error('Component attempted to register before AFRAME was available.');
  }

  AFRAME.registerComponent('environment-map', {
    schema: {
      position: {type: 'vec3'}
    },

    multiple: false,

    init: function () {
      this.el.sceneEl.addEventListener('camera-set-active', () => {
        this.generateEnvMap();
        this.applyEnvMap();
      });

      this.el.sceneEl.addEventListener('object3dset', () => {
        this.applyEnvMap();
      });
    },

    getEnvironmentComponent: function() {
      const entity = document.querySelector('[environment]');
      if (!entity) {
          return
      }
      return entity.components.environment
    },

    generateEnvMap: function() {
      const environmentComponent = this.getEnvironmentComponent();
      if (!environmentComponent) {
          return;
      }
      const renderer = this.el.sceneEl.renderer;
      const camera = new THREE.CubeCamera(1, 100000, 512);
      const envmapScene = new THREE.Scene();
      debugger
      envmapScene.add(environmentComponent.el.object3D);
      camera.update(renderer, envmapScene);
      const generator = new THREE.PMREMGenerator( camera.renderTarget.texture);
      generator.update(renderer);

      const packer = new THREE.PMREMCubeUVPacker(generator.cubeLods);
      packer.update(renderer);
      this.envMap = packer.CubeUVRenderTarget.texture;
      this.el.sceneEl.add(environmentComponent.el);
    },

    applyEnvMap: function() {
      if (!this.envMap) {
          return;
      }
      const scene = this.el.sceneEl.object3D;
      const environmentComponent = this.getEnvironmentComponent();
      const environmentObject3d = environmentComponent.el.object3D;
      const environmentParent = environmentObject3d.parent;
      environmentParent.remove(environmentObject3d);
      scene.traverse(o => {
        if (o.material) {
          o.material.envMap = this.envMap;
          o.material.needsUpdate = true;
        }
      });
      environmentParent.add(environmentObject3d);
    }
  });

})));
