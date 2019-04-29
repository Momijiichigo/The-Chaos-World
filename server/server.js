const http = require("http");
const socketio = require("socket.io");
const fs = require("fs");
var path = require('path');
//　読み取るMIMEタイプ
var mime = {
    ".html": "text/html",
    ".css":  "text/css",
    ".js": "text/javascript"
};

//　サーバーを起動
var server = http.createServer((req, res) => {
    var filePath = req.url;                 //　パスを取得
    if (filePath == "/") {
        filePath = "/index.html";
    }
    var fullPath = __dirname + filePath;    //　絶対パスへ変換
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

//　サーバーと紐付け
var io = socketio.listen(server);

//　接続時
io.sockets.on("connection", (socket)=>{
    console.log("クライアントと接続されました");
    //　受信時
    socket.on("c_s", (data)=>{
        console.log("クライアントから受信しました");
        console.log(data.value);
        socket.emit("s_c", {value:data.value+"hoge"});  //　サーバーに送信
        console.log("クライアントに送信しました");
    });
    //　切断時
    socket.on("disconnect", ()=>{
        console.log("クライアントと切断されました");
    });
});