#ifdef GL_ES
precision highp float;
#endif

uniform float uTime;

varying vec3 vUv;
varying vec3 vN;
varying vec3 vPos;

const float A = 0.15;
const float w = 1.0;
const float p = 1.0;
const float waveMean = 0.46576;

void main() {
  vec3 displacedPosition = position;

  float dzdx = 0.0;
  float dzdy = 0.0;

  for(int i = 0; i < 32; i++) {
    float fi = float(i);

    float waveAmplitude = A * pow(0.82, fi);

    float frequency = w * pow(1.12, fi);

    float phaseSpeed = p * pow(1.12, fi);

    vec2 waveOrigin = vec2(sin(fi * 12.9898) * 6.0, cos(fi * 78.233) * 6.0);

    vec2 offset = position.xy - waveOrigin;

    float distanceToOrigin = length(offset);

    float safeDistance = max(distanceToOrigin, 0.0001);

    vec2 radialDirection = offset / safeDistance;

    float phase = safeDistance * frequency -
      phaseSpeed * uTime;

    float waveHeight = exp(sin(phase) - 1.0);

    float centeredHeight = waveHeight - waveMean;

    displacedPosition.z += waveAmplitude * centeredHeight;

    float waveDerivative = waveHeight * cos(phase);

    dzdx += waveAmplitude *
      waveDerivative *
      frequency *
      radialDirection.x;

    dzdy += waveAmplitude *
      waveDerivative *
      frequency *
      radialDirection.y;
  }

  vec3 tangent = vec3(1.0, 0.0, dzdx);
  vec3 bitangent = vec3(0.0, 1.0, dzdy);

  vec3 objectNormal = normalize(cross(tangent, bitangent));

  vec4 worldPosition = modelMatrix * vec4(displacedPosition, 1.0);

  vPos = worldPosition.xyz;
  vN = normalize(mat3(modelMatrix) * objectNormal);
  vUv = displacedPosition;

  gl_Position = projectionMatrix *
    viewMatrix *
    worldPosition;
}
