"use strict";
// サーバーに接続
var socket = io.connect("http://localhost:3456");
var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
class creature {
    constructor(id){
        //pos,x-speed,y-speed,y-acceleration
        this.x,this.y,this.velx,this.vely,this.accy;

    }
    run(){

    }

}
class Player {
    constructor(id){
        super(id);

    }
}
class Jiki extends Player {
    constructor(){
        super();
        //closer player's id (will be used to send its pos info to closer players)
        this.closePlayers=[];
        this.getInfo = setInterval(()=>{
            //check for closer player
            if (socket.connected) {                     // サーバに接続中なら                         // プレイヤーの向き
                socket.emit("getPlayers",{x:this.x,y:this.y});     // 移動方向を送信
            }
            
        },500);
        socket.on("sendPs", (data)=>{
            this.closePlayers=data;
        })
    }
    die(){
        clearInterval(this.getInfo);
    }
}

var renderLoop;
var stage;
var players = {};
let jiki = new jiki();
// 接続時
socket.on("connect", ()=>{
    console.log("サーバーに接続されました");
    socket.emit("gameStart",{x:jiki.x,y:jiki.y});                               // ゲームスタート
    renderLoop = requestAnimationFrame(draw);
});
// 切断時
socket.on("disconnect", ()=>{
    console.log("サーバーと切断されました");
    cancelAnimationFrame(renderLoop);
    players = {};
});

// ステージを受信
socket.on("stage", (data)=>{
    stage = data;
});
// プレイヤー情報を受信
/*
socket.on("players", (data)=>{
    players = data;
});
*/
var downKeys = [];

function emitPos() {
    if (socket.connected) {                     // サーバに接続中なら                         // プレイヤーの向き
        socket.emit("run", {sendTo:jiki.closePlayers,});     // 移動方向を送信
    }
}


//rendering
let progress;
let draw = timestamp =>{
    progress = timestamp - start;
    
    ctx.clearRect(0,0, canvas.width, canvas.height);
    

        //ctx.drawImage(Jiki,~~~,~~~,~~~,~~~,x,y,~~,~~)
    
    if (!start) start = timestamp;
    
    //ctx.drawImage(charImages, 0, 0);
    window.requestAnimationFrame(draw);
}
window.requestAnimationFrame(draw);

// ウィンドウリサイズ時
window.addEventListener("resize", ()=>{
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

document.addEventListener("keydown", (e)=>{
    switch(e.keyCode) {
        case 37:    // 左矢印キーが押されたら
            if (downKeys.indexOf(37) < 0) {
                downKeys.push(37);
                emitPos();
            }
            break;
        case 39:    // 右矢印キーが押されたら
            if (downKeys.indexOf(39) < 0) {
                downKeys.push(39);
                emitPos();
            }
            break;
        case 32:    // スペースキーが押されたら
            if (downKeys.indexOf(32) < 0) {
                if (socket.connected) {         // サーバに接続中なら
                    socket.emit("jump");        // ジャンプを送信
                }
                downKeys.push(32);
            }
            break;
    }
});

document.addEventListener("keyup", (e)=>{
    switch(e.keyCode) {
        case 37:    // 左矢印キーが離されたら
            downKeys.splice(downKeys.indexOf(37), 1);
            emitRun();
            break;
        case 39:    // 右矢印キーが離されたら
            downKeys.splice(downKeys.indexOf(39), 1);
            emitRun();
            break;
        case 32:    // スペースキーが離されたら
            downKeys.splice(downKeys.indexOf(32), 1);
            break;
    }
});