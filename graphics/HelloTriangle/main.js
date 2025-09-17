const vertexShaderSource = `#version 300 es
 
// an attribute is an input (in) to a vertex shader.
// It will receive data from a buffer
in vec4 a_position;
 
// all shaders have a main function
void main() {
 
  // gl_Position is a special variable a vertex shader
  // is responsible for setting
  gl_Position = a_position;
}
`;

const fragmentShaderSource = `#version 300 es
 
// fragment shaders don't have a default precision so we need
// to pick one. highp is a good default. It means "high precision"
precision highp float;
 
// we need to declare an output for the fragment shader
out vec4 outColor;
 
void main() {
  // Just set the output to a constant reddish-purple
  outColor = vec4(1, 0, 0.5, 1);
}
`;

// get the canvas
var canvas = document.querySelector("#c");
canvas.width = 1080;
canvas.height = 1920;


// get the webgl2 rendering context of the canvas
var gl = canvas.getContext("webgl2");
 if (!gl) {
    alert("WebGL2 not supported");
}

// create those shaders
var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
// create the program
var program = createProgram(gl, vertexShader, fragmentShader);

// the vertex shader only take 1 parameter, the position of the vertex
// to supply data, we must first get the location of the variable
var positionAttributeLocation = gl.getAttribLocation(program, "a_position");
// LOOKING UP LOCATIONS SHOULD BE DURING INITIALIZATION

// attributes get their data from buffers
var positionBuffer = gl.createBuffer();

// Bind points are like global variables
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

// triangle buffer
var positions = [
  -0.5, 0,
  -0.5, 0.5,
  0.25, 0,
];

// copy the values of positions to the positionBuffer on the GPU. We use ARRAY_BUFFER because its bound to positionBuffer
// STATIC_DRAW is just some optimisation 
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

// we now need to tell the attribute how to get data out of it
// collection of attribute state (settings)
var vao = gl.createVertexArray();
// make it our current vertex array
gl.bindVertexArray(vao);
// 
gl.enableVertexAttribArray(positionAttributeLocation);


// we specify how to pull the data out (so type information, cool)
var size = 2;          // 2 components per iteration
var type = gl.FLOAT;   // the data is 32bit floats
var normalize = false; // don't normalize the data
var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
var offset = 0;        // start at the beginning of the buffer
gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);

// we need to tell how to convert the clip space coordinates back to pixels
gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

// Clear the canvas and make it cornflower blue rgb(39.2%,58.4%,92.9%)
gl.clearColor(0.392, 0.584, 0.929, 1);
gl.clear(gl.COLOR_BUFFER_BIT);

// Tell it to use our program (pair of shaders)
gl.useProgram(program);

// Bind the attribute/buffer set we want.
gl.bindVertexArray(vao);

// set the parameters
var primitiveType = gl.TRIANGLES;
var offset = 0;
var count = 3;

// draw triangle
gl.drawArrays(primitiveType, offset, count);


/**
 * Function that creates the shader, upload the source and compile it on the GPU
 * @param {*} gl 
 * @param {*} type 
 * @param {*} source 
 * @returns 
 */
function createShader(gl, type, source) {
  var shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) {
    return shader;
  }
 
  console.log(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
}

/**
 * Links the 2 shaders to a program
 * @param {*} gl 
 * @param {*} vertexShader 
 * @param {*} fragmentShader 
 * @returns 
 */
function createProgram(gl, vertexShader, fragmentShader) {
  var program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  var success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) {
    return program;
  }
 
  console.log(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
}