#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

const float w = 5.0;// amount of waves
const float phi = 0.0;// initial state
const float A = 0.1;// amplitude of the waves
const float b = 0.3;// min height

const vec4 sky_color = vec4(0.064,0.688,1.000,1.000);
const vec4 water_color = vec4(0.0,0.0,1.0, 1.0);

#include "lygia/generative/pnoise.glsl"


void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    // y(x,t)= A * cos(x + wt)
    // pnoise(xy*c+u_time, coord)* contrast + width
    float noise = pnoise(vec2(st * 2. + u_time), vec2(1.2, 3.4)) * 0.5 + 0.5;
    
    float y = noise * A * cos(2.0*st.x + w*u_time + phi)+ b;

    gl_FragColor = sky_color;
    
	if (st.y < y) {
        	vec4 w_color = mix(water_color, sky_color, 0.3 + st.y);
        	gl_FragColor = w_color;
        	// need some shading
    }
    
}