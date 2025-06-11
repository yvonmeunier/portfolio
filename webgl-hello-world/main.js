// vertex shader code
const vertexShaderSource = `#version 300 es
void main()
{
    gl_PointSize = 150.0;
    gl_Position = vec4(0.0, 0.0, 0.0, 1.0);
}`;

// fragment shader code
const fragmentShaderSource = `#version 300 es

precision mediump float;

out vec4 fragColor;

void main()
{
   fragColor = vec4(1.0,0.0,0.0,1.0);
}`;

// we get the canvas from the page
const canvas = document.querySelector('canvas');
// we get the rendering context from the canvas
const gl = canvas.getContext('webgl2');

// create the program
const program = gl.createProgram();

// create the shader
const vertexShader = gl.createShader(gl.VERTEX_SHADER);
// set the shader source
gl.shaderSource(vertexShader, vertexShaderSource);
// compile the shader
gl.compileShader(vertexShader);
// attach the shader to the program
gl.attachShader(program, vertexShader);

// create the shader
const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
// set the shader source
gl.shaderSource(fragmentShader, fragmentShaderSource);
// compile the shader
gl.compileShader(fragmentShader);
// attach the shader to the program
gl.attachShader(program, fragmentShader);

// link the program
gl.linkProgram(program);


// debugging
if(!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.log(vertexShader);
    console.log(fragmentShader);
}

// set the rendering context's program to program
gl.useProgram(program);


// we are drawing a point to a static location and only once
gl.drawArrays(gl.POINTS, 0, 1);
