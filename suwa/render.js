"use strict";
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("webgl2");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
//below is just copied from https://sbfl.net/blog/2017/06/23/webgl2-2d-graphics/
const vertexShaderSource = await fetch('vertex_shader.glsl').then((response) => response.text());
const fragmentShaderSource = await fetch('fragment_shader.glsl').then((response) => response.text());
const textureData = await fetch('player.png')
        .then((response) => response.blob())
        .then((blob) => createImageBitmap(blob));
// シェーダのコンパイル。
const vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, vertexShaderSource);
gl.compileShader(vertexShader);

const vShaderCompileStatus = gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS);
if(!vShaderCompileStatus) {
    const info = gl.getShaderInfoLog(vertexShader);
    console.log(info);
}

const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader, fragmentShaderSource);
gl.compileShader(fragmentShader);

const fShaderCompileStatus = gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS);
if(!fShaderCompileStatus) {
    const info = gl.getShaderInfoLog(fragmentShader);
    console.log(info);
}
// シェーダプログラムの作成。
const program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);

const linkStatus = gl.getProgramParameter(program, gl.LINK_STATUS);
if(!linkStatus) {
    const info = gl.getProgramInfoLog(program);
    console.log(info);
}

// プログラムの使用。
gl.useProgram(program);

//
// バッファの作成。
//

// 頂点バッファ：[座標(vec2)][テクスチャ座標(vec2)]
const vertexBuffer = gl.createBuffer();

// インデックスバッファ
const indexBuffer = gl.createBuffer();

// 頂点バッファ。頂点ごとの情報を保存する。
// 今回は2次元座標しか扱わないので座標のsizeは2。
// strideは頂点情報のサイズなのでvec2+vec2で4。
// offsetはstride内での位置なので各々計算する。
// strideもoffsetもバイト数で指定する。
const STRIDE               = Float32Array.BYTES_PER_ELEMENT * 4;
const TEXTURE_OFFSET       = Float32Array.BYTES_PER_ELEMENT * 2;

const POSITION_SIZE      = 2;
const TEXTURE_SIZE       = 2;
//rendering
let progress,jxvel=null,jyac=null,start;
let draw = timestamp =>{
    if (!start) start = timestamp;
    progress = timestamp - start;
    
    ctx.clearRect(0,0, canvas.width, canvas.height);
        //emitting
        //if the x-velocity or y-accelaration of jiki has changed, send the position infomation
        if(jxvel!==jiki.posInfo.velx){
            emitPos();
            jxvel=jiki.posInfo.velx;
        }
        if(jyac!==jiki.posInfo.accy){
            emitPos();
            jyac=jiki.posInfo.accy;
        }
        //closePlayers
        for(let pid in closePlayers){
            closePlayers[pid].move();
        }
        //ctx.drawImage(Jiki,~~~,~~~,~~~,~~~,x,y,~~,~~)
        //drawing
        jiki.move();
    
    //ctx.drawImage(charImages, 0, 0);
    window.requestAnimationFrame(draw);
}


// ウィンドウリサイズ時
window.addEventListener("resize", ()=>{
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});
