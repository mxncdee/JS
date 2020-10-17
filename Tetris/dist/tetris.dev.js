"use strict";

console.log("TETRIS.JS LOADED");
var screen = document.getElementById('screen');
var ctx = screen.getContext('2d');
ctx.scale(20, 20);
ctx.fillStyle = '#000';
ctx.fillRect(0, 0, screen.width, screen.height);
ctx.fillStyle = 'green';
ctx.fillRect(5, 5, 1, 1);