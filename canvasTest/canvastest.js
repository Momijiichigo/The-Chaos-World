var input_key = new Array();
document.addEventListener('keydown', (e) => {
	input_key[e.key]=true;
})
document.addEventListener('keyup', (e) => {
	input_key[e.key]=false;
})
window.addEventListener('blur',()=>{
	// 配列をクリアする
	input_key.length = 0;
	console.log("event blur");
});
//key recognizing func
var keyIsDown = (key) =>{
	if(input_key[key])return true;
	return false;
}
var canvas = document.getElementById('canvas');
canvas.width=innerWidth-100;
canvas.height=innerHeight-100;
let Jiki = new Image();

var ctx = canvas.getContext('2d');
ctx.globalCompositeOperation="destination-over";
let start = null,x=500,y=500,dir=0;
let draw = timestamp =>{
    var progress = timestamp - start;
    if(progress>50){
        ctx.clearRect(0,0, canvas.width, canvas.height);
        progress=0;
        start = null;
        if(keyIsDown("ArrowRight")){dir=0;x+=10;}
        if(keyIsDown("ArrowLeft")){dir=1;x-=10;}

        //ctx.drawImage(Jiki,~~~,~~~,~~~,~~~,x,y,~~,~~)
    }
    if (!start) start = timestamp;
    
    //ctx.drawImage(charImages, 0, 0);
    window.requestAnimationFrame(draw);
}
window.requestAnimationFrame(draw);