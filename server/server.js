const http = require("http");
const socketio = require("socket.io");
const fs = require("fs");
var path = require('path');
// 読み取るMIMEタイプ
var mime = {
    ".html": "text/html",
    ".css":  "text/css",
    ".js": "text/javascript",
    ".png": "image/png",
    ".jpg": "image/jpeg"
};

// サーバーを起動
var server = http.createServer((req, res) => {
    var filePath = req.url;                         // パスを取得
    if (filePath == "/") {
        filePath = "/index.html";
    }
    var fullPath = __dirname + filePath;            // 絶対パスへ変換
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
        this.jumpPower = 20
        this.gravity = 1;
    }
    move() {
        if (this.jump) {                                                // ジャンプ時
            this.x += this.touch("x", this.speed*this.jumpAngle)[1];    // 左右へ移動
            var touch_y = this.touch("y", this.jumpSpeed);
            this.y += touch_y[1]                                        // ジャンプ
            if (touch_y[0] && this.jumpSpeed<0) {                       // 着地したら
                this.jump = false;
            }
            this.jumpSpeed -= this.gravity;                             // 重力
        } else {
            this.x += this.touch("x", this.speed*this.angle)[1];        // 左右へ移動
            if (!this.touch("y", -this.gravity)[0]) {
                this.jump = true;                                       // 降りる
                this.jumpAngle = this.angle;
                this.jumpSpeed = -this.gravity;
            }
        }
    }
    // 衝突判定
    touch(axis, move) {
        var thisCenter = {
            x: this.x + this.width/2,
            y: this.y + this.height/2
        };
        if (axis == "x") {
            thisCenter.x += move;
        } else {
            thisCenter.y += move;
        }
        var touch = false;
        var justMove = move;
        Object.values(stage.blocks).forEach((blocks)=>{
            blocks.forEach((path)=>{
                var block = {
                    x: (path[0] + path[2]/2) * stage.block.width,
                    y: (path[1] + path[3]/2) * stage.block.height,
                    width: path[2] * stage.block.width,
                    height: path[3] * stage.block.height
                }
                if (Math.abs(thisCenter.x-block.x) < (this.width+block.width)/2 && Math.abs(thisCenter.y-block.y) < (this.height+block.height)/2) {
                    touch = true;
                    if (axis=="x" && move>0) {
                        justMove = path[0]*stage.block.width - this.x - this.width;
                    } else if (axis=="x") {
                        justMove = (path[0]+path[2])*stage.block.width - this.x;
                    } else if (move>0) {
                        justMove = path[1]*stage.block.height - this.y - this.height;
                    } else {
                        justMove = (path[1]+path[3])*stage.block.height - this.y;
                    }
                }
            });
        });
        return [touch, justMove];
    }
};


// ステージ読み込み
var stage;
fs.readFile("./stage.json", (err, data)=>{
    if (err) {
        // エラー時
        console.log(err);
    } else {
        stage = JSON.parse(data);
    }
});

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
        socket.emit("stage", stage);                // ステージ送信
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
            player.jumpAngle = player.angle;        // ジャンプ方向
            player.jumpSpeed = player.jumpPower;
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
    if (Object.values(players).length) {
        Object.values(players).forEach((player)=>{
            player.move();
        });
        io.sockets.emit("players", players);          // プレイヤー情報を送信
    }
}, 20);