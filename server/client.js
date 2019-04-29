//　サーバーに接続
var socket = io.connect("http://localhost:3000");

//　接続時
socket.on("connect", ()=>{
    console.log("サーバーに接続されました");
    socket.emit("c_s", {value:"hoge"});     //　サーバーに送信
    console.log("サーバーに送信しました");
});
//　受信時
socket.on("s_c", (data)=>{
    console.log("サーバーから受信しました");
    console.log(data.value);
});
//　切断時
socket.on("disconnect", ()=>{
    console.log("サーバーと切断されました");
});