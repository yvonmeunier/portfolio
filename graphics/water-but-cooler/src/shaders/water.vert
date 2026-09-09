#ifdef GL_ES
precision mediump float;
#endif

uniform float uTime;
uniform vec3 uSun;
uniform vec3 uCamera;

varying vec2 vUv;

varying vec3 vN;// normal vector of the surface
varying vec3 vPos;// the computed position

const float a[4] = float[4](0.3,0.25,0.2,0.2); // amplitudes
const float w[4] = float [4](1.0,1.5,0.5,0.2); // frequencies
const float p[4] = float[4](6.0,2.7*2.0,5.0,3.5); // phases

void main() {

  // y(x,t)= A * sin(x*w + t*p)
  vUv = uv;
  float z = 0.0;

  for(int i = 0; i < a.length(); i++) {
    z += a[i] * sin(position.x * w[i] + uTime * p[i]);
    // d/dx = w[i] * a[i] * vec3(-1.0,0.0) * cos(position.x * w[i] + uTime * p[i])
    vN += w[i] * a[i] * vec3(-1.0,0,0) * cos(position.x * w[i] + uTime * p[i]);
  }

  vPos = vec3(position.x,position.y, z);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(vPos, 1.0);
}