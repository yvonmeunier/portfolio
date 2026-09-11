#ifdef GL_ES
precision highp float;
#endif

uniform float uTime;

varying vec3 vUv;
varying vec3 vN;
varying vec3 vPos;

const float amplitude = 0.05;
const float baseFrequency = 1.0;
const float basePhaseSpeed = 1.0;
const float waveMean = 0.46576;

void main() {
    vec3 displacedPosition = position;

    float dydx = 0.0;
    float dydy = 0.0;

    for (int i = 0; i < 32; i++) {
        float fi = float(i);

        float waveAmplitude =
            amplitude * pow(0.82, fi);

        float frequency =
            baseFrequency * pow(1.12, fi);

        float phaseSpeed =
            basePhaseSpeed * pow(1.12, fi);

        vec2 waveOrigin = vec2(
            sin(fi * 12.9898) * 6.0,
            cos(fi * 78.233) * 6.0
        );

        vec2 offset =
            position.xy - waveOrigin;

        float distanceToOrigin =
            length(offset);

        float safeDistance =
            max(distanceToOrigin, 0.0001);

        vec2 radialDirection =
            offset / safeDistance;

        float phase =
            safeDistance * frequency -
            phaseSpeed * uTime;

        float waveHeight =
            exp(sin(phase) - 1.0);

        float centeredHeight =
            waveHeight - waveMean;

        displacedPosition.z +=
            waveAmplitude * centeredHeight;

        float waveDerivative =
            waveHeight * cos(phase);

        dydx += waveAmplitude *
            waveDerivative *
            frequency *
            radialDirection.x;

        dydy += waveAmplitude *
            waveDerivative *
            frequency *
            radialDirection.y;
    }

    vec3 tangent = vec3(1.0, 0.0, dydx);
    vec3 bitangent = vec3(0.0, 1.0, dydy);

    vec3 objectNormal = normalize(
        cross(tangent, bitangent)
    );

    vec4 worldPosition =
        modelMatrix * vec4(displacedPosition, 1.0);

    vPos = worldPosition.xyz;
    vN = normalize(mat3(modelMatrix) * objectNormal);
    vUv = displacedPosition;

    gl_Position =
        projectionMatrix *
        viewMatrix *
        worldPosition;
}
