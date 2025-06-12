#version 300 es
// precision mediump float is usually what you need, high precision is slower on mobile devices
precision mediump float;
// we use the in keyword to specify that this is an attribute that we are going to be getting from some buffer 
in vec2 vertexPosition;

// The job of the vertex shader is to declare where the vertex should show up on the output image in clip space
void main() {
    // gl_position is an output variable
    // all you need to know is that the XYZ is going to be divided by W before it gets processed in the next stages
    gl_Position = vec4(vertexPosition, 0.0, 1.0);
}