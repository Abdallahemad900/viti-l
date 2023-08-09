import * as THREE from 'three';
// import { GUI } from 'dat.gui'
// import { Mesh, AnimationMixer } from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';
import * as dat from 'dat.gui';
// import { ShadowMapViewer } from 'three/addons/utils/ShadowMapViewer.js';

const monkeyUrl = new URL('./hh.fbx', import.meta.url);


const renderer = new THREE.WebGLRenderer();

renderer.shadowMap.enabled = true;

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(45,
window.innerWidth / window.innerHeight,
    0.1,
    1000
);
//world color

renderer.setClearColor(0x404040);
renderer.shadowMap.enabled = true;
const orbit = new OrbitControls(camera, renderer.domElement);


// camera

camera.position.set(1, 30, 20);

orbit.update();


// light

const ambientlight =new THREE.AmbientLight(0x333333,7)
scene.add(ambientlight)

// const directionalLight = new THREE.DirectionalLight(0xffffff, 5);
// directionalLight.position.set(-30, 50, 0);
// directionalLight.castShadow = true ;
// scene.add(directionalLight);
// directionalLight.angle=0.2;

// const dLightHelper = new THREE.DirectionalLightHelper(directionalLight,8)
// scene.add(dLightHelper);

// const dLightShadowHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
// scene.add(dLightShadowHelper);

// //mtkrr
// directionalLight.shadow.camera.bottom=-12;


const spotLight = new THREE.SpotLight(0xFFFFFF ,10000 );
scene.add(spotLight);
spotLight.position.set(-50,30,0);
spotLight.castShadow=true;
spotLight.angle=0.2;

const spotLightHelper = new THREE.SpotLightHelper(spotLight);
scene.add(spotLightHelper);

// Fog

scene.fog = new THREE.Fog(0xffffff,0,200);
// scene.fog=new THREE.FogExp2(0xFFFFFF,0.01);



// gui

const geometry = new THREE.BoxGeometry( 1, 1, 1 );
// MeshStandardMaterial is affected by light
const material = new THREE.MeshStandardMaterial( { color: 0x00ff00 
 ,wireframe:false } );
  
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );
cube.position.set(-10,10,0)
cube.castShadow =true;


const gui =new dat.GUI();
// camera.lookAt(cube.position)
const cubeFolder = gui.addFolder('Cube')
cubeFolder.add(cube.rotation, 'x', 0, Math.PI * 2)
cubeFolder.add(cube.rotation, 'y', 0, Math.PI * 2)
cubeFolder.add(cube.rotation, 'z', 0, Math.PI * 2)
cubeFolder.open()
const cameraFolder = gui.addFolder('Camera')
cameraFolder.add(camera.position, 'x', -50, 50)
cameraFolder.add(camera.position, 'y', -50, 50)
cameraFolder.add(camera.position, 'z', -50, 50)
cameraFolder.open()


const options ={
	cubeColor : '#ffea00' ,
  wireframe:false 
  ,speed : 0.01
  ,angle:0.06
  ,penumber:0
  ,intensity:5000
  // ,spotLight:false
};


gui.addColor(options, 'cubeColor').onChange(function(e){
	cube.material.color.set(e)
});


gui.add(options, 'wireframe').onChange(function(e){
cube.material.wireframe =e;
});


gui.add(options, 'speed' , -0.1, 0.1);


gui.add(options, 'angle' , -1, 1);
gui.add(options, 'penumber' , -1, 1);
gui.add(options, 'intensity' , -500, 100000);



let step=0;
// let speed = 0.01;




//loaders

// const assetLoader = new GLTFLoader();
const assetLoader = new FBXLoader();
let mixer;
assetLoader.load(monkeyUrl.href, function(object) {
	
    const model = object.scene;
    scene.add(model);
    mixer = new THREE.AnimationMixer(model);
    const clips = object.animations;

    // model.position.set(1,3,1);

    // hint all codes below to activate fbx

    object.castShadow = true ;
    object.traverse(function(node) {
        if(node.isMesh)
        node.castShadow = true ;
    });
    //in fbx use these below

	scene.add( object );
	// object.rotation.set (4.7,0,0)
	object.scale.set(0.01,0.01,0.01 )

    // Play a certain animation
    // const clip = THREE.AnimationClip.findByName(clips, 'HeadAction');
    // const action = mixer.clipAction(clip);
    // action.play();

    // Play all animations at the same time
    clips.forEach(function(clip) {
        const action = mixer.clipAction(clip);
        action.play();
    });
	
}, undefined, function(error) {
    console.error(error);
});




const clock = new THREE.Clock();

function animate() {

  if(mixer)
        mixer.update(clock.getDelta());
    renderer.render(scene, camera);


  
	cube.rotation.x += 0.01;
	cube.rotation.y += 0.01;

  step+=options.speed;
  cube.position.y=10*Math.abs(Math.sin(step));

// directionalLight.angle= options.angle;
// directionalLight.penumbra= options.penumber;
// directionalLight.intensity= options.intensity;
// dLightHelper.update();


spotLight.angle= options.angle;
spotLight.penumbra= options.penumber;
spotLight.intensity= options.intensity;
spotLightHelper.update();


  renderer.render(scene, camera);
    
}

renderer.setAnimationLoop(animate);



// grid

// const grid = new THREE.GridHelper(30, 30);
// scene.add(grid);


//window resize

window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// //plane

const PlaneGeometry =new THREE.PlaneGeometry (100,100);
const planeMaterial = new THREE.MeshPhongMaterial({color:0xFFFFFF 
	,side : THREE.DoubleSide,  dithering:true });
	// remove 3 double side if u want to see throw walls
const plane = new THREE.Mesh(PlaneGeometry,planeMaterial);
scene.add(plane);
plane.rotation.x = -0.5* Math.PI;

plane.receiveShadow=true;










