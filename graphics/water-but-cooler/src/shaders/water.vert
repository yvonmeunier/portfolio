#ifdef GL_ES
precision highp float;
#endif

uniform float uTime;

varying vec3 vN;
varying vec3 vPos;
varying vec3 vUv;

const float a = 0.35;
const float w = 1.0;
const float p = 1.0;

void main() {
  float dydx = 0.0;
  float dydz = 0.0;

  vec3 displacedPosition = position;

  for(int i = 0; i < 32; i++) {
    float fi = float(i);

    vec2 d = normalize(vec2(0.707, 0.707));

    float amplitude = a * pow(0.82, fi);
    float frequency = w * pow(1.12, fi);
    float phase = p * pow(1.12, fi);

    float wave = dot(d, position.xy) * frequency +
      phase * uTime;

    displacedPosition.z += amplitude * sin(wave);

    dydx += amplitude * frequency * d.x * cos(wave);
    dydz += amplitude * frequency * d.y * cos(wave);
  }

  vec3 tangent = vec3(1.0, 0.0, dydx);
  vec3 bitangent = vec3(0.0, 1.0, dydz);

  vec3 objectNormal = normalize(cross(tangent, bitangent));

  vec4 worldPosition = modelMatrix * vec4(displacedPosition, 1.0);

  vPos = worldPosition.xyz;

  vN = normalize(mat3(modelMatrix) * objectNormal);

  vUv = displacedPosition;

  gl_Position = projectionMatrix * viewMatrix * worldPosition;
}
