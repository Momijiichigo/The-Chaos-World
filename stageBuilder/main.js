var stage = {
    background: "sky",
    block: {
        width: 50,
        height: 50
    },
    blocks: {
        invisible: [
            [1, 0, 1, 20],
            [198, 0, 1, 20]
        ],
        sand: [
            [0, 0, 200, 2]
        ]
    }
}

var manager = document.getElementById("manager-wrapper");
var border = document.getElementById("border");
var managerW = 500;
var borderW = 5;
if (window.innerWidth-managerW < 100) {
    managerW = window.innerWidth - 100;
}
manager.style.width = managerW-borderW+"px";
border.style.width = borderW+"px";
border.style.right = managerW-borderW+"px";

//マネージャータブの切替
var stageBtn = document.getElementById("stage-btn");
var blockBtn = document.getElementById("block-btn");
var stageManager = document.getElementById("stage-manager");
var blockManager = document.getElementById("block-manager");
// ステージタブに切り替え
stageBtn.addEventListener("click",()=>{
    stageBtn.classList.add("selected");
    blockBtn.classList.remove("selected");
    stageManager.style = null;
    blockManager.style.display = "none";
});
// ブロックタブに切り替え
blockBtn.addEventListener("click",()=>{
    stageBtn.classList.remove("selected");
    blockBtn.classList.add("selected");
    stageManager.style.display = "none";
    blockManager.style = null;
});

var typeSelect = document.getElementById("type");
Object.keys(stage.blocks).forEach((value)=>{
    // ブロックタイプ選択フォームの作成
    typeSelect.innerHTML += `<option value="${value}">${value}</option>`;
});

// ブロックタイプの追加
function addType() {
    var blockName = prompt("追加するブロックの名前を入力してください");
    if (blockName) {
        stage.blocks[blockName] = [[0, 0, 1, 1]];
        typeSelect.innerHTML += `<option value="${blockName}" selected>${blockName}</option>`;
        createBlockTable();
        rendering();
    }
}
// ブロックタイプの削除
function deleteType() {
    if (typeSelect.value!="unselected" && confirm(`本当に${typeSelect.value}ブロックをすべて消去しますか？`)) {
        delete stage.blocks[typeSelect.value];
        typeSelect.removeChild(typeSelect.children[typeSelect.selectedIndex]);
        blockList.innerHTML = null;
        rendering();
    }
}

// ブロックタイプが選択されたら
var blockList = document.getElementById("block-list");
typeSelect.addEventListener("input",()=>{
    if (typeSelect.value == "unselected") {
        blockList.innerHTML = null;
    } else {
        createBlockTable();
    }
});

// ブロックのテーブルを作成
function createBlockTable() {
    var blockListHTML = "<table><tr><th>x</th><th>y</th><th>width</th><th>height</th><td class='btn createBlock'>作成</td></tr>";
    stage.blocks[typeSelect.value].forEach((value)=>{
        blockListHTML += `<tr class="blockData"><td><input value="${value[0]}"></td><td><input value="${value[1]}"></td><td><input value="${value[2]}"></td><td><input value="${value[3]}"></td><td class="btn deleteBlock">削除</td></tr>`;
    });
    blockListHTML += "</table>";
    blockList.innerHTML = blockListHTML;
    Array.from(document.querySelectorAll(".blockData input")).forEach((value)=>{
        value.addEventListener("input", saveBlock);
    });
    Array.from(document.querySelectorAll(".createBlock")).forEach((value)=>{
        value.addEventListener("click", createBlock);
    });
    Array.from(document.querySelectorAll(".deleteBlock")).forEach((value)=>{
        value.addEventListener("click", deleteBlock);
    });
}

// ブロックの変更を保存
function saveBlock(e) {
    if (Number.isInteger(Number(e.target.value)) || e.target.value=="-") {
        e.target.dataset.beforeNum = e.target.value;
        var inputIndex = Array.from(document.querySelectorAll(".blockData input")).indexOf(e.target);
        stage.blocks[typeSelect.value][Math.floor(inputIndex/4)][inputIndex%4] = e.target.value=="-" ? 0 : Number(e.target.value);
        rendering();
    } else {
        if ("beforeNum" in e.target.dataset) {
            e.target.value = e.target.dataset.beforeNum;
        } else {
            e.target.value = e.target.defaultValue;
        }
        alert("整数を入力してください");
    }
}
// ブロックを作成
function createBlock(e) {
    stage.blocks[typeSelect.value].push([0, 0, 1, 1]);
    createBlockTable();
    rendering();
}
// ブロックを削除
function deleteBlock(e) {
    if (confirm("本当に削除しますか？")) {
        stage.blocks[typeSelect.value].splice(Array.from(document.querySelectorAll(".deleteBlock")).indexOf(e.target), 1);
        createBlockTable();
        rendering();
    }
}

var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
canvas.width = window.innerWidth-managerW;
canvas.height = window.innerHeight;

// ウィンドウリサイズ時
window.addEventListener("resize", ()=>{
    if (window.innerWidth-managerW < 100) {
        managerW = window.innerWidth - 100;
        manager.style.width = managerW-borderW+"px";
        border.style.right = managerW-borderW+"px";
    }
    canvas.width = window.innerWidth-managerW;
    canvas.height = window.innerHeight;
    rendering();
});
// canvasリサイズ
var resizing = false
border.addEventListener("mousedown", ()=>{
    resizing = true;
    document.body.style.cursor = "col-resize";
});
document.addEventListener("mousemove", (e)=>{
    if (resizing) {
        managerW = window.innerWidth - e.pageX;
        manager.style.width = managerW-borderW+"px";
        border.style.right = managerW-borderW+"px";
        canvas.width = window.innerWidth-managerW;
        canvas.height = window.innerHeight;
        rendering();
    }
});
document.addEventListener("mouseup", ()=>{
    resizing = false;
    document.body.style.cursor = null;
});

var sand_img = new Image();
sand_img.src = "../server/img/sand.jpg";
sand_img.onload = rendering;

var scroll = {
    x: 0,
    y: 0
};

// レンダリング処理
function rendering() {
    if (stage) {
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
                            case "sand":                                // 砂
                                context.drawImage(sand_img, stage.block.width*(path[0]+x_num)-scroll.x, canvas.height-stage.block.height*(path[1]+y_num)+scroll.y, stage.block.width, stage.block.height);
                                break;
                        }
                    }
                }
                context.strokeStyle = "#f00";
                context.lineWidth = 5;
                context.strokeRect(path[0]*stage.block.width-scroll.x, canvas.height-path[1]*stage.block.height+scroll.y, path[2]*stage.block.width, -path[3]*stage.block.height);
            });
        });
        // マス目
            context.strokeStyle = "#555";
            context.lineWidth = 1;
            context.font = "20px 'Meiryo'";
            context.fillStyle = "#555";
            context.textAlign = "center";
            context.textBaseline = "middle";
        for (var x=0; x<=canvas.width; x+=stage.block.width) {
            context.beginPath();
            context.moveTo(x, 0);
            context.lineTo(x, canvas.height);
            context.stroke();
            if (x > 0) {
                context.fillText((x+scroll.x)/stage.block.width, x+stage.block.width/2, canvas.height-stage.block.height/2);
            }
        }
        for (var y=0; y<=canvas.height; y+=stage.block.height) {
            context.beginPath();
            context.moveTo(0, canvas.height-y);
            context.lineTo(canvas.width, canvas.height-y);
            context.stroke();
            if (y > 0) {
                context.fillText((y+scroll.y)/stage.block.height, stage.block.width/2, canvas.height-y-stage.block.height/2);
            }
        }
    }
}

document.addEventListener("keydown", (e)=>{
    if (e.target == document.body) {
        // スクロール処理
        switch(e.keyCode) {
            case 37:
                scroll.x -= stage.block.width;
                break;
            case 38:
                scroll.y += stage.block.height;
                break;
            case 39:
                scroll.x += stage.block.width;
                break;
            case 40:
                scroll.y -= stage.block.height;
                break;
        }
        rendering();
    }
});