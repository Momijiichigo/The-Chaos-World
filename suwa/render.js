"use strict";
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

//rendering
let progress,jxvel=null,jyac=null,start;
let draw = timestamp =>{
    if (!start) start = timestamp;
    progress = timestamp - start;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);

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
