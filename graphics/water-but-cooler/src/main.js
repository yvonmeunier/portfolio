import * as THREE from './vendor/three/build/three.module.js';

const width = window.innerWidth, height = window.innerHeight;

// init
const loader = new THREE.FileLoader();
const camera = new THREE.PerspectiveCamera( 70, width / height, 0.01, 10 );
camera.position.z = 1;

const scene = new THREE.Scene();

const geometry = new THREE.PlaneGeometry(1,1);

const [vertexShader, fragmentShader] = await Promise.all([
    loader.loadAsync('./src/shaders/water.vert'),
    loader.loadAsync('./src/shaders/water.frag'),
]);


//const material = new THREE.MeshBasicMaterial( { color: 0xffff00, side: THREE.FrontSide } );
const material = new THREE.ShaderMaterial({
	uniforms: {
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(0xffff00) },
    },
	fragmentShader : fragmentShader,
	vertexShader : vertexShader
});

const mesh = new THREE.Mesh( geometry, material );

scene.add( mesh );

const renderer = new THREE.WebGLRenderer( { antialias: true } );
renderer.setSize( width, height );
renderer.setAnimationLoop( animate );
document.body.appendChild( renderer.domElement );

// animation

mesh.rotateX(-Math.PI/4);

function animate( time ) {
	material.uniforms.uTime.value = time / 1000;
	renderer.render( scene, camera );

}