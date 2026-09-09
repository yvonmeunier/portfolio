#ifdef GL_ES
precision mediump float;
#endif

uniform vec3 uColor;
uniform float uTime;
varying vec2 vUv;
varying vec3 dx;

const vec3 sun = vec3(1.0,0.0,0.0);

void main() {
  gl_FragColor = vec4(uColor * dot(dx,sun), 1.0);
}