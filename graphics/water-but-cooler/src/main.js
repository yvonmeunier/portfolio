import * as THREE from './vendor/three/build/three.module.js';

const width = window.innerWidth, height = window.innerHeight;

// init
const loader = new THREE.FileLoader();
const camera = new THREE.PerspectiveCamera( 70, width / height, 0.01, 1000 );
camera.position.z = 50;
camera.position.y = 5;

const scene = new THREE.Scene();

const geometry = new THREE.PlaneGeometry(20,20,512,512);


const [vertexShader, fragmentShader] = await Promise.all([
    loader.loadAsync('./src/shaders/water.vert'),
    loader.loadAsync('./src/shaders/water.frag'),
]);


const material = new THREE.ShaderMaterial({
	uniforms: {
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(0x0000FF) },
      uCamera : {value : camera.position}
    },
	fragmentShader : fragmentShader,
	vertexShader : vertexShader
});

const mesh = new THREE.Mesh( geometry, material );

scene.add( mesh );

const renderer = new THREE.WebGLRenderer( { antialias: true } );
renderer.setSize( width, height );
renderer.setAnimationLoop( animate );
renderer.setClearColor(0xF5EAB9);
document.body.appendChild( renderer.domElement );

// animation

mesh.rotateX(-Math.PI/4);

function animate( time ) {
	material.uniforms.uTime.value = time / 1000;
	renderer.render( scene, camera );

}