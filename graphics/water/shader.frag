#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

const float w = 3.0;// amount of waves
const float phi = 0.0;// initial state
const float A = 0.2;// amplitude of the waves
const float b = 0.3;// min height

const vec4 sky_color = vec4(0.53,0.81,92,1.000);
const vec4 water_color = vec4(0.0, 0.35, 0.37, 1.0);
const vec4 transparent_water_color = vec4(0.0, 1.0, 0.85, 1.0);


#include "lygia/generative/pnoise.glsl"


void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    // y(x,t)= A * cos(x + wt)
    // pnoise(xy*c+u_time, coord)* contrast + width
    float noise = pnoise(vec2(st * 2. + u_time), vec2(1.2, 3.4)) * 0.5 + 0.5;
    
    float y = noise * A * cos(2.0*st.x + w*u_time + phi)+ b;

    gl_FragColor = sky_color;
    
    if ((st.y == y || st.y < y + 0.001) && y > A) {
        gl_FragColor = vec4(1.);
    }

	if (st.y < y) {
        // transparency
        gl_FragColor = mix(water_color, transparent_water_color, y);
    }
    
}