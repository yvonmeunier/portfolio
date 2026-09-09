#ifdef GL_ES
precision mediump float;
#endif

uniform vec3 uColor;
uniform float uTime;
varying vec2 vUv;
void main() {
  gl_FragColor = vec4(uColor, 1.0);
}