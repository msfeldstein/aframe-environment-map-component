/* global AFRAME, THREE */
const PMREMGenerator = require('./lib/PMREMGenerator')
const PMREMCubeUVPacker = require('./lib/PMREMCubeUVPacker')

if (typeof AFRAME === 'undefined') {
  throw new Error('Component attempted to register before AFRAME was available.');
}

AFRAME.registerComponent('environment-map', {
  schema: {
    position: {type: 'vec3', default: '0 1 0'},
    target: {type: 'string', default: '.environment'}
  },

  multiple: false,

  init: function () {
    this.el.sceneEl.addEventListener('camera-set-active', () => {
      this.generateEnvMap();
      this.applyEnvMap();
    })

    this.el.sceneEl.addEventListener('object3dset', () => {
      this.applyEnvMap();
    })
  },

  // Apply an action function where either only the environment objects
  // are visible, or only the non environment objects are visible.
  // We set envObjects to true when we want to generate the envmap, and 
  // only have environment objects visible for that, and we set envObjects
  // to false when we want to have only the non environment objects visible so we can
  // apply the envmap to them, but not to the environment meshes
  applyToEnvironmentObjects: function(action, envObjects) {
    const scene = this.el.sceneEl.object3D
    const oldVisibilities = {}
    // First set everything to visible if we weant to use non env objects,
    // or invisible if we only want to target env objects
    scene.traverse(o => {
      oldVisibilities[o.uuid] = o.visible
      o.visible = !envObjects || o.type === 'Scene'
    })
    console.log(this.data.target)
    // Now iterate through all the env objects and either hide or show them
    document.querySelectorAll(this.data.target).forEach(el => {
      el.object3D.traverse(o => {
        o.visible = envObjects
      })
    })
    action()
    scene.traverse(o => {
       o.visible = oldVisibilities[o.uuid]
    })
  },

  generateEnvMap: function() {
    this.applyToEnvironmentObjects(_ => {
      const renderer = this.el.sceneEl.renderer
      const scene = this.el.sceneEl.object3D
      const camera = new THREE.CubeCamera(1, 100000, 512)
      console.log(this.data.position)
      camera.position.copy(this.data.position)
      camera.update(renderer, scene)
      const generator = new THREE.PMREMGenerator( camera.renderTarget.texture)
      generator.update(renderer)
      const packer = new THREE.PMREMCubeUVPacker(generator.cubeLods)
      packer.update(renderer)
      this.envMap = packer.CubeUVRenderTarget.texture
    }, true)
    
  },

  applyEnvMap: function() {
    if (!this.envMap) {
        return;
    }
    this.applyToEnvironmentObjects(_ => {
      const scene = this.el.sceneEl.object3D
      scene.traverse(o => {
        if (o.visible && o.material) {
          o.material.envMap = this.envMap
          o.material.needsUpdate = true
        }
      })
    }, false)
  }
});
