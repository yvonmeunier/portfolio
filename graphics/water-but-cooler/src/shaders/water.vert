#ifdef GL_ES
precision mediump float;
#endif

uniform float uTime;
uniform vec3 uSun;
uniform vec3 uCamera;

varying vec2 vUv;

varying vec3 vN;// normal vector of the surface
varying vec3 vPos;// the computed position

const float a = 0.25;
const float w = 1.0;
const float p = 1.0;

// y is depth
// x is width
// z is height

void main() {

  // y(x,z,t) = A * sin(dot(d,position.xz)*w + t*p) + A * sin(y*w + t*p)
  // dydx = a * w * cos(x*w + t*p)
  // dydz = a * w * cos(y*w + t*p)
  vec3 newPosition = position;
  float dydx;
  float dydz;

  vUv = uv;

  for(int i = 0; i < 16; i++) {
    float fi = float(i);
    vec2 d = vec2(0.707, 0.707); // v0 : +left-right, v1 : +back-front

    // with a direction vector d
    newPosition.z += a*pow(0.82, fi) * sin(dot(d, position.xy) * w*pow(1.12, fi) + p*pow(1.12, fi) * uTime);
    dydx += a*pow(0.82, fi)* w*pow(1.12, fi) * d.x * cos(dot(d, position.xy) * w*pow(1.12, fi) + p*pow(1.12, fi) * uTime);
    dydz += a*pow(0.82, fi) * w*pow(1.12, fi) * d.y * cos(dot(d, position.xy) * w*pow(1.12, fi) + p*pow(1.12, fi) * uTime);

  }

  vec3 tangent = vec3(1.0, 0.0, dydx);
  vec3 binormal = vec3(0.0, 1.0, dydz);
  vN = normalize(cross(tangent, binormal));

  gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}
