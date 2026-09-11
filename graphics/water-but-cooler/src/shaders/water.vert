#ifdef GL_ES
precision mediump float;
#endif

uniform float uTime;
uniform vec3 uSun;
uniform vec3 uCamera;

varying vec2 vUv;

varying vec3 vN;// normal vector of the surface
varying vec3 vPos;// the computed position

const float a = 0.82;
const float w = 1.12;
const float p = 1.0;

void main() {

  // z(x,y,t) = A * sin(x*w + t*p) + A * sin(y*w + t*p)
  // dzdx = a * w * cos(x*w + t*p)
  // dzdy = a * w * cos(y*w + t*p)
  vec3 newPosition = position;
  float dzdx;
  float dzdy;

  vUv = uv;
  for(int i = 0; i < 8; i++) {
    newPosition.z += a * sin(position.x * w + p * uTime) + a * sin(position.y * w + p * uTime);
    dzdx += a * w * cos(position.x * w + p * uTime);
    dzdy += a * w * cos(position.y * w + p * uTime);
  }

  vN = normalize(vec3(-dzdx, -dzdy, 1.0));

  gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}