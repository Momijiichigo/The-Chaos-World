"use strict";
const http = require("http");
const socketio = require("socket.io");
const fs = require("fs");
var path = require('path');
// 読み取るMIMEタイプ
var mime = {
    ".html": "text/html",
    ".css":  "text/css",
    ".js": "text/javascript",
    ".png": "image/png"
};

// サーバーを起動
var server = http.createServer((req, res) => {
    var filePath = req.url;                 // パスを取得
    if (filePath == "/") {
        filePath = "/index.html";
    }
    var fullPath = __dirname + filePath;    // 絶対パスへ変換
    res.writeHead(200, {"Content-Type": mime[path.extname(fullPath)] || "text/plain"});
    fs.readFile(fullPath, (err, data)=>{
        if (err) {
            // エラー時
            console.log(err);
        } else {
            res.end(data, "UTF-8");
        }
    });
}).listen(3456);
console.log("サーバーが起動しました\nhttp://localhost:3456");



// プレイヤーの管理
var players = {};

// サーバーと紐付け
var io = socketio.listen(server);

// 接続時
io.sockets.on("connection", (socket)=>{
    console.log("クライアントと接続されました");
    let player;
    let closePlayers=[];
    // ゲームスタート
    socket.on("gameStart", (data)=>{
        players[socket.id] = data;
        console.log(data);
    });
    
    socket.on("sendMove", (data)=>{
        //io.to(socketid).emit('message', 'whatever');
        let to = data.sendTo;
        for(let receiverId in to){
            io.to(receiverId).emit('updatePos', {from:socket.id,posInfo:data.posInfo});
        }
    });
    socket.on("getPlayers", (data)=>{
        for(let key in players){
            if(key!=socket.id && players[key].posInfo.x<data.x+1000 && players[key].posInfo.x>data.x-1000 && players[key].posInfo.y<data.y+1000 && players[key].posInfo.y>data.y-1000)closePlayers.push(key);
        }
        socket.emit("sendPs", closePlayers);  
    });
    // 切断時
    socket.on("disconnect", ()=>{
        console.log("クライアントと切断されました");
        if (player) {
            delete players[player.id];
            player = null;
        }
    });
});

// 繰り返し処理
/*
setInterval(()=>{
    if (players) {
        Object.values(players).forEach((player)=>{
            player.move();
        });
    }
    io.sockets.emit("state", players);      // プレイヤー情報を送信
}, 20);

*/