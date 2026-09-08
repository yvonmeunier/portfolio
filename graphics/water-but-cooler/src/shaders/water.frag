#ifdef GL_ES
precision mediump float;
#endif

uniform vec3 uColor;
uniform float uTime;
varying vec2 vUv;
void main() {
  gl_FragColor = vec4(uColor * (0.5 + 0.5 * sin(uTime + vUv.x * 6.28)), 1.0);
}