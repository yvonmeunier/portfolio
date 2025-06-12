#version 300 es
// precision mediump float is usually what you need, high precision is slower on mobile devices
precision mediump float;

// the frag shader outputs by default the first out vec4 to the color channel
out vec4 outputColor;

//  the fragment shader is used to determine what color the pixel is
void main() {
    outputColor = vec4(0.294, 0.0, 0.51, 1.0);
}