#ifdef GL_ES
precision mediump float;
#endif

uniform float uTime;
uniform vec3 uSun;
uniform vec3 uCamera;

varying vec2 vUv;

varying vec3 vN;// normal vector of the surface
varying vec3 vPos;// the computed position

const float a = 0.025;
const float w = 1.5;
const float p = 6.0;

void main() {

  // y(x,t)= A * sin(x*w + t*p)
  vUv = uv;
  float z = 0.0;

  for(int i = 0; i < 32; i++) {
    z += a * sin(position.x * w + uTime * p);
    // d/dx = w[i] * a[i] * vec3(-1.0,0.0) * cos(position.x * w[i] + uTime * p[i])
    vN += w/(float(i)+1.0) * a/(float(i)+1.0) * vec3(-1.0,0,0) * cos(position.x * w/(float(i)+1.0) + uTime * p);
  }

  vPos = vec3(position.x,position.y, z);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(vPos, 1.0);
}