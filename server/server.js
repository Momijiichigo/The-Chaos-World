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
}).listen(3000);
console.log("サーバーが起動しました\nhttp://localhost:3000");

// プレイヤークラス
class Player {
    constructor(id) {
        this.id = id;
        this.width = 50;
        this.height = 100;
        this.x = 100;
        this.y = 100;
        this.angle = 0;
        this.speed = 5;
        this.jump = false;
        this.jumpAngle = 0;
        this.jumpPower = 20
        this.jumpSpeed = this.jumpPower;
        this.gravity = 1;
    }
    move() {
        if (this.jump && this.y>=100) {
            // ジャンプ時
            this.y += this.jumpSpeed;           // ジャンプ
            this.jumpSpeed -= this.gravity;     // 重力
            this.x += this.speed * this.jumpAngle;  // 左右へ移動
            // 着地したら
            if (this.y < 100) {
                this.y = 100;
                this.jump = false;
                this.jumpSpeed = this.jumpPower;
            }
        } else {
            this.x += this.speed * this.angle;  // 左右へ移動
        }
    }
};

// プレイヤーの管理
var players = {};

// サーバーと紐付け
var io = socketio.listen(server);

// 接続時
io.sockets.on("connection", (socket)=>{
    console.log("クライアントと接続されました");
    var player;
    // ゲームスタート
    socket.on("gameStart", ()=>{
        player = new Player(socket.id);
        players[player.id] = player;
    });
    // 移動方向
    socket.on("run", (data)=>{
        if (player) {
            player.angle = data.value;
        }
    });
    // ジャンプ
    socket.on("jump", ()=>{
        if (player && !player.jump) {
            player.jump = true;
            player.jumpAngle = player.angle;    // ジャンプ方向
        }
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
setInterval(()=>{
    if (players) {
        Object.values(players).forEach((player)=>{
            player.move();
        });
    }
    io.sockets.emit("state", players);      // プレイヤー情報を送信
}, 20);