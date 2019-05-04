"use strict";
// サーバーに接続
var socket = io.connect("http://localhost:3456");

class creature {
    constructor(id){
        //pos,x-speed,y-speed,y-acceleration
        //this.x,this.y,this.velx,this.vely,this.accy;
        this.posInfo={
            x:0,y:0,
            velx:0,vely:0,
            accy:0
        }
    }
    move(){
        this.posInfo.x+=this.posInfo.velx;
        this.posInfo.y+=this.posInfo.vely;
        this.posInfo.vely+=this.posInfo.accy;
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
            for(pid in this.closePlayers){
                
            }
            //check for closer player
            if (socket.connected) {                     // サーバに接続中なら                         // プレイヤーの向き
                socket.emit("getPlayers",{x:this.posInfo[x],y:this.posInfo[y]});     // を送信
            }
            
        },500);
        socket.on("sendPs", (data)=>{
            console.log(data);
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
    socket.emit("gameStart",{posInfo:jiki.posInfo});                               // ゲームスタート
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


function emitPos() {
    if (socket.connected) {                     // サーバに接続中なら                       
        socket.emit("sendMove", {sendTo:jiki.closePlayers,posInfo:jiki.posInfo});     // を送信
    }
}