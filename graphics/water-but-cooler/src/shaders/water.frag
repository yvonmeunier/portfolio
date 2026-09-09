#ifdef GL_ES
precision mediump float;
#endif

uniform vec3 uColor;
uniform float uTime;
uniform vec3 uSun;// position of the sun
uniform vec3 uCamera;// position of the camera

varying vec2 vUv;
varying vec3 vN;// normal vector of the surface
varying vec3 vPos;// the computed position

const vec3 sun = vec3(1.0,0.0,0.0);

void main() {
  gl_FragColor = vec4(uColor, 1.0);
}