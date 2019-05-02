var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// ウィンドウリサイズ時
window.addEventListener("resize", ()=>{
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// 画像読み込み
var img = {};
img.sand = new Image();
img.sand.src = "./img/sand.jpg";
img.player = new Image();
img.player.src = "./img/player.png";

// レンダリング処理
function rendering() {
    if (socket.id in players && stage) {
        // スクロール処理
        /*if (players[socket.id].x-stage.scroll < 100) {
            stage.scroll = players[socket.id].x - 100;
        } else if (stage.scroll+canvas.width-players[socket.id].x-players[socket.id].width < 100) {
            stage.scroll = players[socket.id].x + players[socket.id].width + 100 - canvas.width;
        }*/
        stage.scroll = players[socket.id].x+(players[socket.id].width-canvas.width)/2
        context.clearRect(0, 0, canvas.width, canvas.height);
        // 背景
        switch(stage.background) {
            case "sky":
                context.fillStyle = "#b2f0ff";
                context.fillRect(0, 0, canvas.width, canvas.height);
                break;
        }
        Object.keys(stage.blocks).forEach((type)=>{
            stage.blocks[type].forEach((path)=>{
                for (var x_num=0; x_num<path[2]; x_num++) {             // x軸の個数
                    for (var y_num=1; y_num<=path[3]; y_num++) {        // y軸の個数
                        switch(type) {
                            case "sand":                              // 地面
                                context.drawImage(img.sand, stage.block.width*(path[0]+x_num)-stage.scroll, canvas.height-stage.block.height*(path[1]+y_num), stage.block.width, stage.block.height);
                                break;
                        }
                    }
                }
            });
        });
        Object.values(players).forEach((player)=>{
            if (player.id != socket.id) {                           // プレイヤーが自分以外だったら
                context.drawImage(img.player, player.x-stage.scroll, canvas.height-player.height-player.y, player.width, player.height);
            }
        });
        // 自分を最後に（最前面に）描画
        var player = players[socket.id];
        context.drawImage(img.player, player.x-stage.scroll, canvas.height-player.height-player.y, player.width, player.height);
    }
    renderLoop = requestAnimationFrame(rendering);
}