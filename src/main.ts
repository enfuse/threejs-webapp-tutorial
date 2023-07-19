import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import * as dat from 'dat.gui';
import modelUrl from '../models/final.glb'
import meshUrl from '../models/cave-mesh.fbx' 


const scene = new THREE.Scene();

const ambientLight = new THREE.AmbientLight(0x404040, 2.0); 
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 1);
directionalLight.position.set(1, 1, 1).normalize(); 
scene.add(directionalLight);

const camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 1.5, 2000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});

let model = null;
let mixer = null;
let action = null;

const gltfLoader = new GLTFLoader();
gltfLoader.load(modelUrl, function (gltf) {
    model = gltf.scene;
    model.position.y = -3;
    scene.add(gltf.scene);

    mixer = new THREE.AnimationMixer(model);
    action = mixer.clipAction(gltf.animations[0]);
    action.play();

    const gui = new dat.GUI();
    const animationsFolder = gui.addFolder('Animations');
    animationsFolder.add({ Animation: 0 }, 'Animation', { 'Dance': 0, 'Idle': 1, 'Tpose': 2, 'Walk': 3 })
        .onChange(function (val) {
            if (action) action.stop();
            action = mixer.clipAction(gltf.animations[val]);
            action.play();
        });
    animationsFolder.open();

}, undefined, function (error) {
    console.error(error);
});

const fbxLoader = new FBXLoader();
fbxLoader.load(meshUrl, function (fbx) {
    scene.add(fbx);
}, undefined, function (error) {
    console.error(error);
});

function animate() {
    requestAnimationFrame(animate);

    if (model) {
        const time = Date.now() * 0.001; 
        const a = 2; 
        const b = 1;
        model.rotation.y += 0.01;
        model.position.x = a * Math.cos(time);
        model.position.z = b * Math.sin(time);
    }

    if (mixer) {
        mixer.update(0.01);
    }

    renderer.render(scene, camera);
}

animate();
