"use strict";
// サーバーに接続
var socket = io.connect("http://localhost:3456");
//list holds playerObj
//var players = {};
var input_key = new Array();
document.addEventListener('keydown', (e) => {
	input_key[e.key]=true;
})
document.addEventListener('keyup', (e) => {
	input_key[e.key]=false;
})
window.addEventListener('blur',()=>{
	// 配列をクリアする
	input_key.length = 0;
	console.log("event blur");
});
var keyIsDown = (key) =>{
	if(input_key[key])return true;
	return false;
}
class Creature {
    constructor(){
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
class Player extends Creature{
    constructor(){
        super();
        
    }
}
let closePlayers={};
class Jiki extends Player {
    constructor(){
        super();
        //closer player's id (will be used to send its pos info to closer players)
        
        this.getInfo = setInterval(()=>{
            /*
            Object.values(players).forEach((player)=>{
                let exist=false;
                //this.closePlayers
                //if(player.id==)
            });
            */
            //check for closer player
            if (socket.connected) {                     // サーバに接続中なら                         // プレイヤーの向き
                socket.emit("getPlayers",{x:this.posInfo.x,y:this.posInfo.y});     // を送信
            }
            
        },500);
        socket.on("sendPs", (data)=>{
            console.log(closePlayers);
            for(let pid of data){
                if(!closePlayers[pid]){
                    closePlayers[pid]=new Player();
                }
            }
            //this.closePlayers=data;
        })
    }
    die(){
        clearInterval(this.getInfo);
    }
    move(){
        if(keyIsDown("ArrowRight")){
            this.posInfo.velx=5;
        }
        if(keyIsDown("ArrowRight")){
            this.posInfo.velx=-5;
        }
        super.move();
    }
}

var renderLoop;
var stage;


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
    closePlayers = {};
    clearInterval(jiki.getInfo);
    //players = {};
});

// ステージを受信
socket.on("stage", (data)=>{
    stage = data;
});
let jiki = new Jiki();
socket.on("updatePos", (data)=>{
    closePlayers[data.from].posInfo=data.posInfo;
});

function emitPos() {
    if (socket.connected) {                     // サーバに接続中なら                       
        socket.emit("sendMove", {sendTo:jiki.closePlayers,posInfo:jiki.posInfo});     // を送信
        console.log("emit pos info");
    }
}