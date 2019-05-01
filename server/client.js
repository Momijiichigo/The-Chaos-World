// サーバーに接続
var socket = io.connect("http://localhost:3000");
var renderLoop;
var stage;
var players = {};

// 接続時
socket.on("connect", ()=>{
    console.log("サーバーに接続されました");
    socket.emit("gameStart");                               // ゲームスタート
    renderLoop = requestAnimationFrame(rendering);
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
socket.on("players", (data)=>{
    players = data;
});

var downKeys = [];

function emitRun() {
    if (socket.connected) {                     // サーバに接続中なら
        var angle = 0;                          // プレイヤーの向き
        if (downKeys.indexOf(37) >= 0) {
            angle -= 1;                         // 左向き
        } else if (downKeys.indexOf(39) >= 0) {
            angle += 1;                         // 右向き
        }
        socket.emit("run", {value: angle});     // 移動方向を送信
    }
}

document.addEventListener("keydown", (e)=>{
    switch(e.keyCode) {
        case 37:    // 左矢印キーが押されたら
            if (downKeys.indexOf(37) < 0) {
                downKeys.push(37);
                emitRun();
            }
            break;
        case 39:    // 右矢印キーが押されたら
            if (downKeys.indexOf(39) < 0) {
                downKeys.push(39);
                emitRun();
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