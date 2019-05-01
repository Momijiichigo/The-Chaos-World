var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var ground_img = new Image();
ground_img.src = "./img/ground.jpg";

var player_img = new Image();
player_img.src = "./img/player.png";

// レンダリング処理
function rendering() {
    if (players) {
        // スクロール処理
        if (players[socket.id].x-stage.scroll < 100) {
            stage.scroll = players[socket.id].x - 100;
        } else if (stage.scroll+canvas.width-players[socket.id].x-players[socket.id].width < 100) {
            stage.scroll = players[socket.id].x + players[socket.id].width + 100 - canvas.width;
        }
        context.clearRect(0, 0, canvas.width, canvas.height);
        // 背景
        switch(stage.background) {
            case "sky":
                context.fillStyle = "#b2f0ff";
                context.fillRect(0, 0, canvas.width, canvas.height);
                break;
        }
        // 地面
        stage.blocks.ground.forEach((path)=>{
            for (var x_num=0; x_num<path[2]; x_num++) {             // x軸の個数
                for (var y_num=1; y_num<=path[3]; y_num++) {        // y軸の個数
                    if (stage.block.width*(path[0]+x_num+1)-stage.scroll>=0 && stage.scroll+canvas.width-stage.block.width*(path[0]+x_num)>=0)
                    context.drawImage(ground_img, stage.block.width*(path[0]+x_num)-stage.scroll, canvas.clientHeight-stage.block.width*(path[1]+y_num), stage.block.width, stage.block.height);
                }
            }
        });
        Object.values(players).forEach((player)=>{
            context.drawImage(player_img, player.x-stage.scroll, canvas.clientHeight-player.height-player.y, player.width, player.height);
            if (player.id == socket.id) {
                // プレイヤーが自分だったら
            }
        });
    }
    renderLoop = requestAnimationFrame(rendering);
}

// ウィンドウリサイズ時
window.addEventListener("resize", ()=>{
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});