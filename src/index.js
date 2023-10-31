import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js"
import * as DAT from 'lil-gui'

import * as CANNON from 'cannon-es'
import CannonDebugger from 'cannon-es-debugger';
import { threeToCannon, ShapeType, } from 'three-to-cannon';

import { PointerLockControlsCannon } from './PointerLockControlsCannon.js'


//VARS
const canvas = document.querySelector('canvas.webgl')
let bench_grp
let white_wall_grp
let color_wall_grp
let light_grp
let stands_grp
let floor_grp
let iron_grid_grp
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

// gui.add(camera.position, "x").name("Position X")
// gui.add(camera.position, "y").name("Position Y")
// gui.add(camera.position, "z").name("Position Z")
// gui.add(camera.rotation, "x").name("Rotation X")
// gui.add(camera.rotation, "y").name("Rotation Y")
// gui.add(camera.rotation, "z").name("Rotation Z")
// gui.add(debugFunc, "printCamPos").name("Camera Position")
// gui.add(debugFunc, "printOribitTargetPos").name("Orbit Target Position")

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


const toggleWireframe = (groups) => {
    groups.forEach(group => {
        group.traverse(item => {
            if (item.isMesh) {
                item.material = wireframeMaterial
            }
        })
    })


}

// MATERIALS
const wireframeMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x00ff00, 
    wireframe: true, 
});

//MODELS
gltfLoader.load('./models/gltf/Azul_24_scene.gltf', (gltf) => {

    gltf.scene.traverse(group => {
        if (group.name.includes("Bench")) {
            bench_grp = group
        } else if (group.name.includes("White")) {
            white_wall_grp = group
        } else if (group.name.includes("Color")) {
            color_wall_grp = group
        } else if (group.name.includes("Light")) {
            light_grp = group
        } else if (group.name.includes("Stands")) {
            stands_grp = group
        } else if (group.name.includes("Floor")) {
            floor_grp = group
        } else if (group.name.includes("Iron")) {
            iron_grid_grp = group
        }
    })

    toggleWireframe([bench_grp, bench_grp, white_wall_grp, color_wall_grp, light_grp, stands_grp, floor_grp, iron_grid_grp])
    scene.add(bench_grp, white_wall_grp, color_wall_grp, light_grp, stands_grp, floor_grp, iron_grid_grp)

    const floorBody = new CANNON.Body({
        type: CANNON.Body.STATIC,
        shape: new CANNON.Plane,

    })
    floorBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0)
    cannonPhysics.addBody(floorBody)


    return
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

    floorBody = new CANNON.Body({
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