/** Helper method to output an error message to the screen */
function showError(errorText) {
    const errorBoxDiv = document.getElementById('error-box');
    const errorSpan = document.createElement('p');
    errorSpan.innerText = errorText;
    errorBoxDiv.appendChild(errorSpan);
    console.error(errorText);
}

function helloTriangle() {
    // this is so the IDE shows the type
    /**@type {HTMLCanvasElement|null} */
    // get the canvas element
    const canvas = document.querySelector("#demo-canvas");
    if (!canvas) {
        showError(`Cannot get demo-canvas reference - Check for typos or loading script too early in HTML`);
        return;
    }


    //get the canvas' gl context
    const gl = canvas.getContext('webgl2');
    if (!gl) {
        showError(`This browser doesnt support WebGL 2 - This demo wont work!`);
        return;
    }

    

    // we define our triangle vertices (3 points)
    const triangleVertices = [
        // top middle
        0.0, 0.5,
        // bottom left
        -0.5, -0.5,
        // bottom right
        0.5, -0.5
    ];

    // JS uses 64-bits floats and doesnt guarantee that the numbers are next to each other in memory and we want ONE chunk of data 
    // that represents the vertices of the triangle so we format it in a float32 array
    // this is stored in the RAM
    const triangleVerticesCpuBuffer = new Float32Array(triangleVertices);

    // the GPU doesnt have access to the JS variables so in order to send the data to the gpu we :
    // create a buffer on the gpu
    const triangleGeoBuffer = gl.createBuffer();
    // this doesnt create the memory yet so we have to first attach the buffer handle to a WebGL Attachement Point called the array buffer attachement point
    // this is what is used for vertex information
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleGeoBuffer);
    // then we use a command that says that the thing that is bound to this array buffer attachement point give it this data
    // gl.STATIC_DRAW is a hint to WebGL on how we are going to use this data (read a lot and not really modifying it)
    // it allows the driver to figure out where to put the data (because various memory chips have different purposes)
    gl.bufferData(gl.ARRAY_BUFFER, triangleVerticesCpuBuffer, gl.STATIC_DRAW);

    const vertexShaderSourceCode = `#version 300 es
// precision mediump float is usually what you need, high precision is slower on mobile devices
precision mediump float;
// we use the in keyword to specify that this is an attribute that we are going to be getting from some buffer 
in vec2 vertexPosition;

// The job of the vertex shader is to declare where the vertex should show up on the output image in clip space
void main() {
    // gl_position is an output variable
    // all you need to know is that the XYZ is going to be divided by W before it gets processed in the next stages
    gl_Position = vec4(vertexPosition, 0.0, 1.0);
}`;
    // create the shader on the gpu
    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    // assign the source code to the shader
    gl.shaderSource(vertexShader, vertexShaderSourceCode);
    // compile the shader
    gl.compileShader(vertexShader);

    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        const compileError = gl.getShaderInfoLog(vertexShader);
        showError(`Failed to COMPILE vertex shader - ${compileError}`);
        return;
    }

    const fragmentShaderSourceCode = `#version 300 es
// precision mediump float is usually what you need, high precision is slower on mobile devices
precision mediump float;

// the frag shader outputs by default the first out vec4 to the color channel
out vec4 outputColor;

//  the fragment shader is used to determine what color the pixel is
void main() {
    outputColor = vec4(0.294, 0.0, 0.51, 1.0);
}`;

    // create the shader on the gpu
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    // assign the source code to the shader
    gl.shaderSource(fragmentShader, fragmentShaderSourceCode);
    // compile the shader
    gl.compileShader(fragmentShader);

    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        const compileError = gl.getShaderInfoLog(fragmentShader);
        showError(`Failed to COMPILE fragment shader - ${compileError}`);
        return;
    }

    // you cant use a vertex and frag shader independently
    // you always combine them and use them in a combined object called a webgl program
    const triangleShaderProgram = gl.createProgram();
    gl.attachShader(triangleShaderProgram, vertexShader);
    gl.attachShader(triangleShaderProgram, fragmentShader);
    gl.linkProgram(triangleShaderProgram);
    // check if we have incompatibilities between our shaders
    if (!gl.getProgramParameter(triangleShaderProgram, gl.LINK_STATUS)) {
        const linkError = gl.getProgramInfoLog(triangleShaderProgram);
        showError(`Failed to LINK shaders - ${linkError}`);
        return;
    }
    // this is getting the location of the vertex position attribute in our vertex shader and put it inside that variable
    const vertexPositionAttribLocation = gl.getAttribLocation(triangleShaderProgram, 'vertexPosition');
    if (vertexPositionAttribLocation < 0) {
        showError(`Failed to get attrib location for vertexPosition`);
        return;
    }

    // The order of these doesnt affect functionality but you have to keep in mind that changing state is not so great performance-wise
    // the provided order is what Indigo code personally uses 

    // Output Merger - how to merge the shaded pixel fragment with the existing output image
    // In WebGL this is pretty easy, we just have to make sure that the width and height of the canvas element 
    // are the size of the image we want to draw to
    // client width and height is the size of the element on the screen
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    // by changing the size gl generates a new image (transparent)
    // we need to clear the canvas and replace the transparent image for a dark grey one, otherwise we will still see the red background
    /** 
     * gl has 3 buffers :
     * - Image/Color Buffer : where you draw
     * - Depth Buffer : contains depth info for each pixel in the Color Buffer
     * - Sencil Buffer : for various graphics effects
    */

    // we need to tell WebGL what color we want the clear canvas to be
    // in this case some black
    // RGBA between 0 and 1
    gl.clearColor(0.08, 0.08, 0.08, 1.0);

    // clear the image/color buffer
    gl.clear(gl.COLOR_BUFFER_BIT);
    // clear the depth buffer
    gl.clear(gl.DEPTH_BUFFER_BIT);
    // we can combine both by ORing the 2
    // gl.clear(gl.COLOR_BUFFER_BIT | l.DEPTH_BUFFER_BIT);

    // Rasterizer - which pixels are part of a triangle
    gl.viewport(0,0, canvas.width, canvas.height);
    
    // Set GPU Program (vertex + fragment combo)
    // Vertex Shader - how to place those vertices in clip space
    // Fragment Shader - what color a pixel shoud be
    gl.useProgram(triangleShaderProgram);
    gl.enableVertexAttribArray(vertexPositionAttribLocation);

    // Input Assembler - how to read vertices from our GPU triangle buffer
    // its going to tell WebGL for each input attributes which buffer is it going to read from and how do you read that information into the attribute
    // we specify which buffer we want to use
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleGeoBuffer);

    gl.vertexAttribPointer(
        /* index : which attribute to use */ 
        vertexPositionAttribLocation,
        /* size : number of components in that attribute */ 
        2,
        /* type : data type stored in the GPU Buffer for this attribute */ 
        gl.FLOAT,
        /* normalized : determines how ints are converted to floats */
        false,
        /* stride : how many bytes to move forward in the buffer to find the same attribute for the next vertex*/ 
        2 * Float32Array.BYTES_PER_ELEMENT,
        /* offset : how many bytes should the input assembler skip from the buffer when reading attributes */ 
        0
    );


    
    // Primitive Assembly - how to make triangles from those vertices
    // Draw call (also configures Primitive Assembly)
    gl.drawArrays(gl.TRIANGLES, 0 , 3);
}

try {
    helloTriangle();
} catch (e) {
    showError(`Uncaught JS Exception : ${e}`);
}