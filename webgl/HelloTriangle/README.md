# Hello Triangle !
This is the result of this tutorial : https://webgl2fundamentals.org/webgl/lessons/webgl-fundamentals.html
The goal was to learn the basics of WebGL2, a rasterization API for websites.

# So... what did I learn from this?

The first thing I learned was about shaders. Shaders are micro programs executed in parallel on the GPU. So far I've learned about Vertex shaders and Fragment shaders.

## Vertex Shaders

Vertex shaders are programs that processes vertices into clip space vertices. Assuming that I use triangles to represent geometry, every time the shader generates 3 vertices the GPU uses them to make a triangle. It then figures out which pixels corresponds to the 3 points and then rasterizes the triangle aka draws it with pixels. For each pixel, it will call your Fragment shader to determine the pixel's color.

In this tutorial, the provided coordinates are already in clip space.

## But what exactly is Clip Space?
Clip space is a coordinate system where (0,0,0) is the center of the cube and each axis (X,Y and Z) goes from -1 to 1. So a 2x2x2 cube and anything outside this cube is going to get clipped.

## Fragment Shaders
The sole purpose of a Fragment shader is to tell the GPU what color the pixel is.