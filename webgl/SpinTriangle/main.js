
const canvas = document.getElementById('c');
// set the render output to 1080p
canvas.width = 1080;
canvas.height = 1920;

// get the render context
const gl = canvas.getContext('webgl2');
if (!gl) {
    alert('WebGL2 not supported');
}

// Vertex shader source
const vertexShaderSource = `
            attribute vec3 a_position; // the position of the vertex
            attribute vec3 a_color; // the color associated to the vertex, passed as a parameter from the JS code
            uniform mat3 u_transform; // the transformation (rotation in this sample) matrix
            varying vec3 v_color; // the color passed to the frag shader
            
            void main() {
                vec3 transformed = u_transform * a_position;
                vec3 testColor = a_color;
                gl_Position = vec4(transformed.xyz,1.0);
                v_color = testColor;
            }
        `;

// Fragment shader source
const fragmentShaderSource = `
            precision mediump float;
            varying vec3 v_color;
            
            void main() {
                gl_FragColor = vec4(v_color, 1.0);
            }
        `;

// Create shader function
function createShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader compile error:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }
    return shader;
}

// Create program function
function createProgram(gl, vertexShader, fragmentShader) {
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('Program link error:', gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
        return null;
    }
    return program;
}

// Create shaders and program
const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
const program = createProgram(gl, vertexShader, fragmentShader);

// Get attribute and uniform locations
const positionLocation = gl.getAttribLocation(program, 'a_position');
const colorLocation = gl.getAttribLocation(program, 'a_color');
const transformLocation = gl.getUniformLocation(program, 'u_transform');

// Triangle vertices
let vertices = new Float32Array([
    0.0, 0.5,0.0,    // Top vertex
    -0.5, -0.5,0.0,    // Bottom left
    0.5, -0.5,0.0     // Bottom right
]);

// Colors for each vertex (r, g, b)
let colors = new Float32Array([
    1.0, 0.0, 0.0,  // Red
    0.0, 1.0, 0.0,  // Green
    0.0, 0.0, 1.0   // Blue
]);

// Create buffers
const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

const colorBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);

// Animation variables
let rotation = 0;
let isRotating = true;
let lastTime = 0;

// creates a rotation matrix on the Z axis
function createRotationMatrixZ(angle) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return new Float32Array([
        cos, -sin, 0,
        sin, cos, 0,
        0, 0, 1
    ]);
}
// creates a rotation matrix on the Y axis
function createRotationMatrixY(angle) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return new Float32Array([
        cos, 0, sin,
        0, 1, 0,
        -sin, 0, cos
    ]);
}

// creates a rotation matrix on the Y axis
function createRotationMatrixX(angle) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return new Float32Array([
        1, 0, 0,
        0, cos, -sin,
        0, sin, cos
    ]);
}

// creates a rotation matrix that appies yaw(Z) then pitch(Y) then roll(X)
function createRotationMatrix(yaw, pitch, roll) {
    const cosA = Math.cos(yaw);
    const sinA = Math.sin(yaw);

    const cosB = Math.cos(pitch);
    const sinB = Math.sin(pitch);

    const cosG = Math.cos(roll);
    const sinG = Math.sin(roll);


    return new Float32Array([
        (cosA*cosB), 
        (sinA*cosB), 
        -sinB,
        
        (cosA*sinB*sinG - sinA*cosG), 
        (sinA*sinB*sinG + cosA*cosG), 
        (cosB*sinG),
        
        (cosA*sinB*cosG + sinA*sinG), 
        (sinA*sinB*cosG - cosA*sinG), 
        (cosB*cosG)
    ]);
}

// creates a rotation matrix that applies roll(X) then pitch(Y) then yaw(Z)
function createRotationMatrixEuler(roll, pitch, yaw) {
    const cosA = Math.cos(yaw);
    const sinA = Math.sin(yaw);

    const cosB = Math.cos(pitch);
    const sinB = Math.sin(pitch);

    const cosG = Math.cos(roll);
    const sinG = Math.sin(roll);


     return new Float32Array([

        (cosB*cosG), 
        (cosB*sinG), 
        -sinB,
        
        (sinA*sinB*cosG - cosA*sinG), 
        (sinA*sinB*sinG + cosA*cosG), 
        (sinA*cosB),

        (cosA*sinB*cosG + sinA*sinG), 
        (cosA*sinB*sinG - sinA*cosG), 
        (cosA*cosB)
    ]);
}

function createScaleMatrix(sx, sy) {
    return new Float32Array([
        sx, 0, 0,
        0, sy, 0,
        0, 0, 1
    ]);
}

// Render function
function render(currentTime) {
    currentTime *= 0.001; // Convert to seconds
    const deltaTime = currentTime - lastTime;
    lastTime = currentTime;

    rotation += deltaTime * 2; // 2 radians per second

    // Clear canvas
    gl.clearColor(0.1, 0.1, 0.1, 1.0); // this gives a dark background
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Use our shader program
    gl.useProgram(program);

    // create a rotation matrix
    const rotMatrix = createRotationMatrix(0, 0, rotation);

    // For this simple case, we'll just use rotation
    gl.uniformMatrix3fv(transformLocation, false, rotMatrix);

    // Bind position buffer and set up attribute
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);

    // Bind color buffer and set up attribute
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.enableVertexAttribArray(colorLocation);
    gl.vertexAttribPointer(colorLocation, 3, gl.FLOAT, false, 0, 0);

    // Draw the triangle
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    requestAnimationFrame(render);
}

// Set viewport and start rendering
gl.viewport(0, 0, canvas.width, canvas.height);
// start the loop
requestAnimationFrame(render);
