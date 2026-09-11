import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const loader = new THREE.FileLoader();

const camera = new THREE.PerspectiveCamera(
  70,
  window.innerWidth / window.innerHeight,
  0.01,
  1000
);

camera.position.set(0, -15, 20);

const scene = new THREE.Scene();

const geometry = new THREE.PlaneGeometry(100, 100, 2048, 2048);

const [vertexShader, fragmentShader] = await Promise.all([
  loader.loadAsync('./src/shaders/water.vert'),
  loader.loadAsync('./src/shaders/water.frag'),
]);

const material = new THREE.ShaderMaterial({
  uniforms: {
  uTime: { value: 0 },
  uColor: { value: new THREE.Color(0x04BADE) }
},
  vertexShader,
  fragmentShader,
});

const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

const renderer = new THREE.WebGLRenderer({
  antialias: true,
});

renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xf5eab9);
document.body.appendChild(renderer.domElement);

// Camera controls
const controls = new OrbitControls(camera, renderer.domElement);

controls.target.set(0, 0, 0);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// Optional limits
controls.minDistance = 5;
controls.maxDistance = 100;
//controls.maxPolarAngle = Math.PI / 2;

// Required after manually setting the camera position or target
controls.update();

function animate(time) {
  controls.update();

  material.uniforms.uTime.value = time / 1000;

  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

// Handle browser resizing
window.addEventListener('resize', () => {
  const width = window.innerWidth;
  const height = window.innerHeight;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  renderer.setSize(width, height);
});
