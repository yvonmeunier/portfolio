#ifdef GL_ES
precision highp float;
#endif

uniform vec3 uColor;

varying vec3 vN;
varying vec3 vPos;

const vec3 sunDirection = normalize(vec3(-0.45, -0.55, 1.0));
const float shininess = 96.0;

void main() {
    vec3 N = normalize(vN);
    vec3 V = normalize(cameraPosition - vPos);
    vec3 L = normalize(sunDirection);
    vec3 H = normalize(L + V);

    float NdotL = max(dot(N, L), 0.0);
    float NdotV = max(dot(N, V), 0.0);

    float F0 = 0.9;
    float fresnel = F0 + (1.0 - F0) * pow(1.0 - NdotV, 5.0);

    float specularHighlight = pow(
        max(dot(N, H), 0.0),
        shininess
    );

    vec3 ambient = uColor * 0.18;
    vec3 diffuse = uColor * NdotL;
    vec3 specular = vec3(1.0) * fresnel * specularHighlight * NdotL * 2.0;
    gl_FragColor = vec4(ambient + diffuse + specular, 1.0);
}
