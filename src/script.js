import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import gsap from 'gsap' // its an js library for creating 
import gsapCore from 'gsap/gsap-core'


// texture loader
const textureLoader = new THREE.TextureLoader()
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

const geometry = new THREE.PlaneBufferGeometry(1.1,1.5)
for(let i=0; i<=4;i++){
    const material = new THREE.MeshBasicMaterial({
        map: textureLoader.load(`/photographes/${i}.jpg`)
    })

    const img = new THREE.Mesh(geometry, material)
    img.position.set(0.8,i*-2.2)

    scene.add(img)

}

let obj =[]
scene.traverse((Object)=>
{
    if(Object.isMesh){
        obj.push(Object)
    }
})
// Lights

const pointLight = new THREE.PointLight(0xffffff, 0.1)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
scene.add(pointLight)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0
camera.position.y = 0
camera.position.z = 2
scene.add(camera)

gui.add(camera.position,'y').min(-10).max(10)

// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

//mouse

window.addEventListener("wheel",onmousewheel)
let y=0
let position=0

function onmousewheel(event)
{
   y=event.deltaY*0.0007
}

const mouse = new THREE.Vector2() // vector2- it will take x, y value

window.addEventListener('mousemove', (event)=>{
    mouse.x = event.clientX/ sizes.width*2 -1
    mouse.y = -(event.clientY/ sizes.height)*2 +1
})
/**
 * Animate
 */
 const raycaster = new THREE.Raycaster(); // use for any type of  interacting things like hover

const clock = new THREE.Clock()

const tick = () =>
{

    const elapsedTime = clock.getElapsedTime()
    // raycaster
    raycaster.setFromCamera(mouse, camera)
    const intersects = raycaster.intersectObjects(obj)

    for (const intersect of intersects){
       gsap.to(intersect.object.scale, {x: 1.5 , y: 1.5})
       gsap.to(intersect.object.rotation, { y: -0.1})
       gsap.to(intersect.object.position, {z: 0.2})

    }

    for(const object of obj)
    {
        if(!intersects.find(intersect => intersect.object == object)){
            gsap.to(object.scale, {x: 1 , y: 1})
            gsap.to(object.rotation, { y: 0})
            gsap.to(object.position, {z: 0}) 
        }
    }

    // Update objects
    // sphere.rotation.y = .5 * elapsedTime


    position+= y
    y*=0.9


     camera.position.y = -position

      // Update Orbital Controls
    // controls.update()
    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()