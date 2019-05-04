"use strict";
var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
//rendering
let progress,jxvel=null,jyac=null;
let draw = timestamp =>{
    progress = timestamp - start;
    
    ctx.clearRect(0,0, canvas.width, canvas.height);
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

        //ctx.drawImage(Jiki,~~~,~~~,~~~,~~~,x,y,~~,~~)
        //drawing
        jiki.move();
    if (!start) start = timestamp;
    
    //ctx.drawImage(charImages, 0, 0);
    window.requestAnimationFrame(draw);
}


// ウィンドウリサイズ時
window.addEventListener("resize", ()=>{
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});
