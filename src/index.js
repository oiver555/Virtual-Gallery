import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js';

import { OrbitControls } from 'https://unpkg.com/three-orbitcontrols@2.110.3/OrbitControls.js'
 
import { GLTFLoader } from 'https://cdn.rawgit.com/mrdoob/three.js/master/examples/js/loaders/GLTFLoader.js'


//VARS
const canvas = document.querySelector('canvas.webgl')
const clock = new THREE.Clock()
const scene = new THREE.Scene()
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
}
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
const renderer = new THREE.WebGLRenderer({
    canvas
})


//LOADERS
const gltfLoader = new GLTFLoader()
const textureLoader = new THREE.TextureLoader()

//TEXTURES
const floorDiff = textureLoader.load('./static/textures/wood_floor_diff_2k.jpg')
const floorNor = textureLoader.load('./static/textures/wood_floor_nor_gl_2k.jpg')
const floorRough = textureLoader.load('./static/textures/wood_floor_rough_2k.jpg')
const floorAO = textureLoader.load('./static/textures/wood_floor_ao_2k.jpg')

//MODELS
gltfLoader.load('./static/models/gltf/Scene_05.gltf', (gltf) => {
    const gltfScene = gltf.scene
    let floor
    let wall_00
    let light_00
    let light_01
    let light_02
    let roof
    let painting_00
    let painting_01
    let painting_02
    let painting_03
    let painting_04
    let painting_05
    let painting_06
    let title_00
    let title_01
    let title_02
    let title_03
    let title_04
    let title_05
    let title_06
    gltfScene.traverse(item => {
    //    console.log("No way", item.name)
        if (item.name === 'Floor') {
             console.log(item.name)
            floor = item
        }
        else if (item.name === 'Wall_00') {
             console.log(item.name)
            wall_00 = item
        }
        else if (item.name === 'light_00') {
             console.log(item.name)
            light_00 = item
        }
        else if (item.name === 'light_01') {
             console.log(item.name)
            light_01 = item
        }
        else if (item.name === 'light_02') {
             console.log(item.name)
            light_02 = item
        }
        else if (item.name === 'roof') {
             console.log(item.name)
            roof = item
        }
        else if (item.name === 'painting_00') {
             console.log(item.name)
            painting_00 = item
        }
        else if (item.name === 'painting_01') {
             console.log(item.name)
            painting_01 = item
        }
        else if (item.name === 'painting_02') {
             console.log(item.name)
            painting_02 = item
        }
        else if (item.name === 'painting_03') {
             console.log(item.name)
            painting_03 = item
        }
        else if (item.name === 'painting_04') {
             console.log(item.name)
            painting_04 = item
        }
        else if (item.name === 'painting_05') {
             console.log(item.name)
            painting_05 = item
        }
        else if (item.name === 'painting_06') {
             console.log(item.name)
            painting_06 = item
        }
        else if (item.name === 'title_00') {
             console.log(item.name)
            title_00 = item
        }
        else if (item.name === 'title_01') {
             console.log(item.name)
            title_01 = item
        }
        else if (item.name === 'title_02') {
             console.log(item.name)
            title_02 = item
        }
        else if (item.name === 'title_03') {
             console.log(item.name)
            title_03 = item
        }
        else if (item.name === 'title_04') {
             console.log(item.name)
            title_04 = item
        }
        else if (item.name === 'title_05') {
             console.log(item.name)
            title_05 = item
        }
        else if (item.name === 'title_06') {
             console.log(item.name)
            title_06 = item
        }

    })

    scene.add(floor, wall_00,
        light_00,
        light_01,
        light_02,
        roof,
        painting_00,
        painting_01,
        painting_02,
        painting_03,
        painting_04,
        painting_05,
        painting_06,
        title_00,
        title_01,
        title_02,
        title_03,
        title_04,
        title_05,
        title_06,
    )

})

// ORBIT CONTROLS
const controls = new OrbitControls(camera, canvas)
controls.target.y = 3.5
controls.enableDamping = true

//LIGHTS
const ambLight = new THREE.AmbientLight()
scene.add(ambLight)

renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

window.addEventListener('resize', () => {

    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
}
tick()