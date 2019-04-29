// サーバーに接続
var socket = io.connect("http://localhost:3000");

// 接続時
socket.on("connect", ()=>{
    console.log("サーバーに接続されました");
    socket.emit("gameStart");                               // ゲームスタート
    requestAnimationFrame(rendering);
});
// 切断時
socket.on("disconnect", ()=>{
    console.log("サーバーと切断されました");
});

var angle = 0;      // プレイヤーの向き
var downKeys = []
var players;

document.addEventListener("keydown", (e)=>{
    switch(e.keyCode) {
        case 37:    // 左矢印キーが押されたら
            if (downKeys.indexOf(37) < 0) {
                angle -= 1;
                socket.emit("run", {value: angle});     // 移動方向を送信
                downKeys.push(37);
            }
            break;
        case 39:    // 右矢印キーが押されたら
            if (downKeys.indexOf(39) < 0) {
                angle += 1;
                socket.emit("run", {value: angle});     // 移動方向を送信
                downKeys.push(39);
            }
            break;
        case 32:    // スペースキーが押されたら
            if (downKeys.indexOf(32) < 0) {
                socket.emit("jump");                    // ジャンプを送信
                downKeys.push(32);
            }
            break;
    }
});

document.addEventListener("keyup", (e)=>{
    switch(e.keyCode) {
        case 37:    // 左矢印キーが離されたら
            angle += 1;
            socket.emit("run", {value: angle});         // 移動方向を送信
            downKeys.splice(downKeys.indexOf(37), 1);
            break;
        case 39:    // 右矢印キーが離されたら
            angle -= 1;
            socket.emit("run", {value: angle});         // 移動方向を送信
            downKeys.splice(downKeys.indexOf(39), 1);
            break;
        case 32:    // スペースキーが離されたら
            downKeys.splice(downKeys.indexOf(32), 1);
            break;
    }
});

// 受信時
socket.on("state", (remotePlayers)=>{
    players = remotePlayers;
});