#ifdef GL_ES
precision mediump float;
#endif

uniform vec3 uColor;
uniform float uTime;
uniform vec3 uSun;// direction of the sun
uniform vec3 uCamera;// position of the camera

varying vec3 vUv;
varying vec3 vN;// normal vector of the surface
varying vec3 vPos;// the computed position

const vec3 sun = vec3(-1.0/sqrt(2.0),-1.0/sqrt(2.0),0.0);
const float shininess = 24.0;

void main() {
  vec3 N = normalize(vN);
  vec3 V = normalize(uCamera - vPos);
  vec3 L = normalize(sun);
  vec3 H = normalize(L + V);// halfway vector

  float NdotL = max(0.0, dot(N, L));
  float NdotV = max(0.0, dot(N, V));
  float F0 = 0.4;

  float fresnel = F0 + (1.0 - F0) * pow(1.0 -NdotV, 5.0);

  float specularHighlight = pow(max(dot(N,H), 0.0), shininess); // Blinn-Phong with the halfway vector

  vec3 diffuse = uColor * NdotL * (1.0 - fresnel);
  vec3 specular = vec3(fresnel) * specularHighlight * NdotL;
  vec3 ambiant = uColor * 0.18; // TODO : change this to come from the environement I guess?


  gl_FragColor = vec4(ambiant + diffuse + specular, 1.0);
}