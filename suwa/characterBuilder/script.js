"use strict";
const remote = require("electron").remote;
const dialog = remote.dialog;
const fs = require("fs");

let canvas = document.querySelector("canvas");
var ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
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
	//console.log("event blur");
});
let keyIsDown = (key) =>{
	if(input_key[key])return true;
	return false;
}


// ウィンドウリサイズ時
window.addEventListener("resize", ()=>{
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

function handleFileSelect(evt) {
    console.log(evt);
    evt.stopPropagation();
    evt.preventDefault();

    var files = evt.dataTransfer.files; // FileList object.

    // files is a FileList of File objects. List some properties.
    
    var output = [];
    for (var i = 0, f; f = files[i]; i++) {
        if (!files[i] || files[i].type.indexOf('image/') < 0) {
            continue;
        }
          //アップロード処理へ
        loadImg(files[i]);
      
    }
    
    
    
}
let loadImg =(file)=>{
    console.log(file)
}
function handleDragOver(evt) {
evt.stopPropagation();
evt.preventDefault();
evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
}


canvas.addEventListener('dragover', handleDragOver, false);
canvas.addEventListener('drop', handleFileSelect, false);

//---------------------------------------

let projectPath = null;
let saveData =(data)=>{
    if(!projectPath){
        projectPath = dialog.showSaveDialog({
            title: "保存",
            filters: [
                { name: 'JSON', extensions: ['json'] }
            ]
        });
        if (projectPath) {
            fs.writeFile(projectPath, JSON.stringify(data, null, null), "utf8", (err)=>{
                if (err) {
                    // エラー時
                    console.log(err);
                }
            });
        }
    }else{
        fs.writeFile(projectPath, JSON.stringify(stage, null, null), "utf8", (err)=>{
            if (err) {
                // エラー時
                console.log(err);
            }
        });
    }
}

//-----main process--------------

//rendering
let progress,start;
let draw = timestamp =>{
    if (!start) start = timestamp;
    progress = timestamp - start;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if(keyIsDown("Control")&&keyIsDown("s")){
        saveData();
        console.log("saving")
    }
    
    window.requestAnimationFrame(draw);
}
window.requestAnimationFrame(draw);