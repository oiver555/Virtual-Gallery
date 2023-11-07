import * as THREE from 'three';


import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import * as DAT from 'lil-gui'

import * as CANNON from 'cannon-es'
import CannonDebugger from 'cannon-es-debugger';

import { PointerLockControlsCannon_Modified } from './PointerLockControlsCannon_Modified.js'


//VARS
const canvas = document.querySelector('canvas.webgl')
let bench_grp
let white_wall_grp
let color_wall_grp
let light_grp
let stands_grp
let floor_grp
let trim_grp
let iron_grid_grp
let sphereBody
let physicsMaterial
let originialMaterial0
let originialMaterial1
let originialMaterial2
let originialMaterial3
let originialMaterial4
let originialMaterial5
let originialMaterial6
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
camera.position.y = 4
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



//LOADERS
const gltfLoader = new GLTFLoader()
const textureLoader = new THREE.TextureLoader()

//TEXTURES
const bench_lightmap_00 = textureLoader.load('./models/gltf/Azul_36/Azul_36__Bench_grp_bench_00_bench_00Shape.jpg')
const bench_lightmap_01 = textureLoader.load('./models/gltf/Azul_36/Azul_36__Bench_grp_bench_01_bench_01Shape.jpg')
const bench_lightmap_02 = textureLoader.load('./models/gltf/Azul_36/Azul_36__Bench_grp_bench_02_bench_02Shape.jpg')
const bench_lightmap_03 = textureLoader.load('./models/gltf/Azul_36/Azul_36__Bench_grp_bench_03_bench_03Shape.jpg')
const bench_lightmap_04 = textureLoader.load('./models/gltf/Azul_36/Azul_36__Bench_grp_bench_04_bench_04Shape.jpg')
const bench_lightmap_05 = textureLoader.load('./models/gltf/Azul_36/Azul_36__Bench_grp_bench_05_bench_05Shape.jpg')
const bench_lightmap_06 = textureLoader.load('./models/gltf/Azul_36/Azul_36__Bench_grp_bench_06_bench_06Shape.jpg')


let original = false

const toggleBenchShaders = () => {

    original ?
        bench_grp.traverse((bench) => {
            if (bench.name === "bench_00PIV") {
                bench.material = originialMaterial0;
            } else if (bench.name === "bench_01PIV") {
                bench.material = originialMaterial1;
            } else if (bench.name === "bench_02PIV") {
                bench.material = originialMaterial2;
            } else if (bench.name === "bench_03PIV") {
                bench.material = originialMaterial3;
            } else if (bench.name === "bench_04PIV") {
                bench.material = originialMaterial4;
            } else if (bench.name === "bench_05PIV") {
                bench.material = originialMaterial5;
            } else if (bench.name === "bench_06PIV") {
                bench.material = originialMaterial6;
            }
        })
        :
        bench_grp.traverse((bench) => {
            if (bench.name === "bench_00PIV") {
                bench.material.map = bench_lightmap_00;
            } else if (bench.name === "bench_01PIV") {
                bench.material.map = bench_lightmap_01;
            } else if (bench.name === "bench_02PIV") {
                bench.material.map = bench_lightmap_02;
            } else if (bench.name === "bench_03PIV") {
                bench.material.map = bench_lightmap_03;
            } else if (bench.name === "bench_04PIV") {
                bench.material.map = bench_lightmap_04;
            } else if (bench.name === "bench_05PIV") {
                bench.material.map = bench_lightmap_05;
            } else if (bench.name === "bench_06PIV") {
                bench.material.map = bench_lightmap_06;
            }
        });

    original = !original
    console.log(original)
}

const log = () => {
    console.log(originialMaterial0)
}


let debugFunc = {toggleBenchShaders,log}
gui.add(debugFunc, "toggleBenchShaders")
gui.add(debugFunc, "log")

//MODELS
gltfLoader.load('./models/gltf/Azul_36/Azul_01.gltf', (gltf) => {
    gltf.scene.traverse(group => {
        if (group.name === "Bench_grp") {
            bench_grp = group

            group.traverse(mesh => {
                if (mesh.isMesh) {

                }
            })
        } else if (group.name === "White_Wall_grp") {
            white_wall_grp = group
        } else if (group.name === "Color_Wall_grp") {
            color_wall_grp = group
        } else if (group.name === "Lights_grp") {
            light_grp = group
        } else if (group.name === "Stands_grp") {
            stands_grp = group
        } else if (group.name === "Floor_grp") {
            floor_grp = group
        } else if (group.name === "Iron_Grid_grp") {
            iron_grid_grp = group
        } else if (group.name === "Trim_grp") {
            trim_grp = group
        }
    })

    bench_grp.traverse((bench) => {
        if (bench.name === "bench_00PIV") {
            originialMaterial0 = bench.material.clone()
        } else if (bench.name === "bench_01PIV") {
            originialMaterial1 = bench.material.clone()
        } else if (bench.name === "bench_02PIV") {
            originialMaterial2 = bench.material.clone()
        } else if (bench.name === "bench_03PIV") {
            originialMaterial3 = bench.material.clone()
        } else if (bench.name === "bench_04PIV") {
            originialMaterial4 = bench.material.clone()
        } else if (bench.name === "bench_05PIV") {
            originialMaterial5 = bench.material.clone()
        } else if (bench.name === "bench_06PIV") {
            originialMaterial6 = bench.material.clone()
        }
    });

    scene.add(iron_grid_grp, bench_grp, white_wall_grp, color_wall_grp, light_grp, stands_grp, floor_grp, trim_grp)
    const floorBody = new CANNON.Body({
        type: CANNON.Body.STATIC,
        shape: new CANNON.Plane,
    })
    floorBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0)
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


const controls = new PointerLockControlsCannon_Modified(camera, sphereBody, canvas)
// const controls = new PointerLockControlsCannon(camera, sphereBody)
controls.enabled = true

controls.unlock()
scene.add(controls.getObject())


// CANNON DEBUGGER
const cannonDebugger = new CannonDebugger(scene, cannonPhysics)

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
        cannonPhysics.step(timeStep, dt)

    }
    cannonDebugger.update()

    // cannonPhysics.fixedStep()
    controls.update(dt)
    renderer.render(scene, camera)

    window.requestAnimationFrame(tick)
}
tick()