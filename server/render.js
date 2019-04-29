var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var player_img = new Image();
player_img.src = "./img/player.png";

// レンダリング処理
function rendering() {
    if (players) {
        Object.values(players).forEach((player)=>{
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.drawImage(player_img, player.x, canvas.clientHeight-player.height-player.y, player.width, player.height);
            if (player.id == socket.id) {
                // プレイヤーが自分だったら
            }
        });
    }
    requestAnimationFrame(rendering);
}