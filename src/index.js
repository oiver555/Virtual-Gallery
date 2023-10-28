import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js"
import * as DAT from 'lil-gui'

import * as CANNON from 'cannon-es'
import CannonDebugger from 'cannon-es-debugger';
import { threeToCannon, ShapeType, } from 'three-to-cannon';

import {PointerLockControlsCannon} from './PointerLockControlsCannon.js'


//VARS
const canvas = document.querySelector('canvas.webgl')
let sphereBody
let physicsMaterial
const timeStep = 1 / 60
let lastCallTime = performance.now() / 1000
const clock = new THREE.Clock()
const scene = new THREE.Scene()
const gui = new DAT.GUI()
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
}

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.y = 2
//CANNON WORLD
const cannonPhysics = new CANNON.World({
    gravity: new CANNON.Vec3(0, -9.82, 0)
})

physicsMaterial = new CANNON.Material('physics')
const physics_physics = new CANNON.ContactMaterial(physicsMaterial, physicsMaterial, {
  friction: 0.0,
  restitution: 0.3,
})

// We must add the contact materials to the world
cannonPhysics.addContactMaterial(physics_physics)

const renderer = new THREE.WebGLRenderer({
    canvas
})

const printCamPos = () => {
    console.log("The CAM POS is ", { x: camera.position.x, y: camera.position.y, z: camera.position.z })
}
const printOribitTargetPos = () => {
    console.log("The ORBIT TARGET POS is ", { x: controls.target.x, y: controls.target.y, z: controls.target.z })
}

let debugFunc = {
    printCamPos,
    printOribitTargetPos,
}

gui.add(camera.position, "x").name("Position X")
gui.add(camera.position, "y").name("Position Y")
gui.add(camera.position, "z").name("Position Z")
gui.add(camera.rotation, "x").name("Rotation X")
gui.add(camera.rotation, "y").name("Rotation Y")
gui.add(camera.rotation, "z").name("Rotation Z")
gui.add(debugFunc, "printCamPos").name("Camera Position")
gui.add(debugFunc, "printOribitTargetPos").name("Orbit Target Position")

//LOADERS
const gltfLoader = new GLTFLoader()
const rgbeLoader = new RGBELoader()
const textureLoader = new THREE.TextureLoader()

//TEXTURES
const floorDiff = textureLoader.load('./textures/wood_floor_diff_2k.jpg')
const floorNor = textureLoader.load('./textures/wood_floor_nor_gl_2k.jpg')
const floorRough = textureLoader.load('./textures/wood_floor_rough_2k.jpg')
const floorAO = textureLoader.load('./textures/wood_floor_ao_2k.jpg')
const painting_00_diff = textureLoader.load('./models/gltf/1f1e0f7d-f66e-4267-9f60-5ddd16877d14.jpeg')

const painting_00_Material = new THREE.MeshStandardMaterial({
    map: painting_00_diff
})



//MODELS
gltfLoader.load('./models/gltf/Scene_05.gltf', (gltf) => {
    const gltfScene = gltf.scene
    let wall_1
    let wall_2
    let wall_3
    let wall_4
    let roof
    let floor
    let light_00
    let light_01
    let light_02
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
    let window

    gltfScene.traverse(item => {
        // console.log(item.name)
        if (item.name === 'Floor') {
            floor = item
            // floor.rotation.x = Math.PI
        }
        else if (item.name === 'window') {
            window = item
        }
        else if (item.name === 'wall_1') {
            // console.log(item)
              wall_1 = item
        }
        else if (item.name === 'wall_2') {
            //  console.log(item)
              wall_2 = item
        }
        else if (item.name === 'wall_3') {
        //    console.log(item)
              wall_3 = item
        }
        else if (item.name === 'wall_4') {
            // console.log(item)
            wall_4 = item
        }
        else if (item.name === 'light_00') {
            light_00 = item
        }
        else if (item.name === 'light_01') {
            light_01 = item
        }
        else if (item.name === 'light_02') {
            light_02 = item
        }
        else if (item.name === 'roof') {
            roof = item
        }
        else if (item.name === 'painting_00') {
            painting_00 = item
            painting_00.material = painting_00_Material
            painting_00.scale.y = -1 * painting_00.scale.y
        }
        else if (item.name === 'painting_01') {
            painting_01 = item
        }
        else if (item.name === 'painting_02') {
            painting_02 = item
        }
        else if (item.name === 'painting_03') {
            painting_03 = item
        }
        else if (item.name === 'painting_04') {
            painting_04 = item
        }
        else if (item.name === 'painting_05') {
            painting_05 = item
        }
        else if (item.name === 'painting_06') {
            painting_06 = item
        }
        else if (item.name === 'title_00') {
            title_00 = item
        }
        else if (item.name === 'title_01') {
            title_01 = item
        }
        else if (item.name === 'title_02') {
            title_02 = item
        }
        else if (item.name === 'title_03') {
            title_03 = item
        }
        else if (item.name === 'title_04') {
            title_04 = item
        }
        else if (item.name === 'title_05') {
            title_05 = item
        }
        else if (item.name === 'title_06') {
            title_06 = item
        }

    })

    scene.add(floor,
        wall_1,
        wall_2,
        wall_3,
        wall_4,
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
        window
    )

    //CONVERT SHAPES
    //WALL 1
    const wallConverted1 = threeToCannon(wall_1, { type: ShapeType.BOX });
    const { shape: wallShape1, offset: wallOffset1, } = wallConverted1;
    const wallBody1 = new CANNON.Body({
        type: CANNON.Body.STATIC,
        shape: wallShape1,
        position: wall_1.position
    })
    wallBody1.shapeOffsets = [wallOffset1]
    cannonPhysics.addBody(wallBody1)

    //WALL 2
    const wallConverted2 = threeToCannon(wall_2, { type: ShapeType.BOX });
    const { shape: wallShape2, offset: wallOffset2, } = wallConverted2;
    const wallBody2 = new CANNON.Body({
        type: CANNON.Body.STATIC,
        shape: wallShape2,
        position: wall_2.position
    })
    wallBody2.shapeOffsets = [wallOffset2]
    cannonPhysics.addBody(wallBody2)
    
    //WALL 3
    const wallConverted3 = threeToCannon(wall_3, { type: ShapeType.BOX });
    const { shape: wallShape3, offset: wallOffset3, } = wallConverted3;
    const wallBody3 = new CANNON.Body({
        type: CANNON.Body.STATIC,
        shape: wallShape3,
        position: wall_3.position
    })
    wallBody3.shapeOffsets = [wallOffset3]
    cannonPhysics.addBody(wallBody3)

    //WALL 4 
    const wallConverted4 = threeToCannon(wall_4, { type: ShapeType.BOX });
    const { shape: wallShape4, offset: wallOffset4, } = wallConverted4;
    const wallBody4 = new CANNON.Body({
        type: CANNON.Body.STATIC,
        shape: wallShape4,
        position: wall_4.position
    })
    // wallBody4.shapeOffsets = [wallOffset4]
    console.log(wall_4, 'n', wallOffset4)
    cannonPhysics.addBody(wallBody4)   

    //FLOOR
    const floorConverted = threeToCannon(floor, { type: ShapeType.BOX });
    const { shape: floorShape, offset: floorOffset, } = floorConverted;

    const floorBody = new CANNON.Body({
        type: CANNON.Body.STATIC,
        shape: floorShape,
        position: floor.position, 
        material: physicsMaterial
    })

    floorBody.shapeOffsets = [floorOffset]
    floorBody.collisionResponse = true;
    cannonPhysics.addBody(floorBody)


   

})


sphereBody = new CANNON.Body({
    mass: 5,
    shape: new CANNON.Sphere(.5),
    position: new CANNON.Vec3(9, 3, -9),
    material: physicsMaterial
})
sphereBody.linearDamping = 0.9
cannonPhysics.addBody(sphereBody)

const controls = new PointerLockControlsCannon(camera, sphereBody, canvas)
controls.enabled = true
scene.add(controls.getObject())

// CANNON DEBUGGER
const cannonDebugger = new CannonDebugger(scene, cannonPhysics)


// ORBIT CONTROLS
// controls.listenToKeyEvents(window);
// controls.enableDamping = true
// controls.dampingFactor = 0.05;
// controls.screenSpacePanning = false;

// controls.maxPolarAngle = Math.PI / 2;
// controls.minPolarAngle = Math.PI / 4;

// controls.target.set(camera.position.x + 2, camera.position.y, camera.position.z)


const axesHelper = new THREE.AxesHelper(100);

scene.add(axesHelper)

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
    const time = performance.now() / 1000
    const dt = time - lastCallTime
    lastCallTime = time


    if (controls.enabled) {
        // console.log(controls)
        cannonPhysics.step(timeStep, dt)
    
    }
    cannonDebugger.update()

    // cannonPhysics.fixedStep()
    controls.update(dt)
    renderer.render(scene, camera)

    window.requestAnimationFrame(tick)
}
tick()