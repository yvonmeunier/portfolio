var canvas = document.querySelector("#c");

var vertexShaderSource = document.querySelector("#vertex-shader-2d").text;// raw shader code

var fragmentShaderSource = document.querySelector("#fragment-shader-2d").text;// raw shader code

// get the webgl context of the canvas
var gl = canvas.getContext("webgl");
if (!gl) {
    alert("Cannot get the webgl context from the canvas!");
}



// compile and send those shaders to the GPU
var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

// link them to a shader program
var program = createProgram(gl, vertexShader, fragmentShader);

// Here the vertex shader takes as an input a_position, which is a vec4 representing the position of the vertex in clip space
// Clip space goes from -1 to 1 on the x axis and y axis. So top left is (-1,1), center is (0,0)
// get its location which should be done during initialization, not in the render loop
var positionAttributeLocation = gl.getAttribLocation(program, "a_position");

// we create a buffer on the GPU
var positionBuffer = gl.createBuffer();

// bind the positionBuffer to the ARRAY_BUFFER, which is a buffer on the GPU containing vertex attributes
// This is essentially ARRAY_BUFFER = positionBuffer
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

// triangle to display, data on the CPU
var positions = [
    0, 0, 0, 0,
    0, 0.5, 0, 0,
    0.7, 0, 0, 0,
];


// send the date on the CPU to the GPU, and also convert it to a specific format (32 bits float)
// we also specify what we intend to do with it so it can do some optimization for us
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

// up to this point this was initialization code

// now for code that should be called every draw
// we resize the canvas to the screen size
webglUtils.resizeCanvasToDisplaySize(gl.canvas);



/**
 * This function compiles and put shaders on the GPU
 * @param {*} gl The gl context of the canvas
 * @param {*} type The type of shader being compiled and sent to the GPU
 * @param {*} source The shader source code
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
 * This function tales the compiled shaders and links them to a shader program
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