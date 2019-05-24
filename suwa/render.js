"use strict";
var canvas = document.getElementById("canvas");
var gl = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

//rendering
let progress,jxvel=null,jyac=null,start;
let draw = timestamp =>{
    if (!start) start = timestamp;
    progress = timestamp - start;
    
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    //emitting
    //if the x-velocity or y-accelaration of jiki has changed, send the position infomation
    if(jxvel!==jiki.posInfo.velx){
        emitPos();
        jxvel=jiki.posInfo.velx;
    }
    if(jyac!==jiki.posInfo.accy){
        emitPos();
        jyac=jiki.posInfo.accy;
    }
    //closePlayers
    for(let pid in closePlayers){
        closePlayers[pid].move();
    }
    //ctx.drawImage(Jiki,~~~,~~~,~~~,~~~,x,y,~~,~~)
    //drawing
    jiki.move();

    //ctx.drawImage(charImages, 0, 0);
    window.requestAnimationFrame(draw);
}


// ウィンドウリサイズ時
window.addEventListener("resize", ()=>{
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});
