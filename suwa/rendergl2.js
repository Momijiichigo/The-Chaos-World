"use strict";
var canvas = document.getElementById("canvas");
var gl = canvas.getContext("webgl2");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
(async function main() {
    //codes below are just copied from https://sbfl.net/blog/2017/06/23/webgl2-2d-graphics/
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


    // 操作対象のバッファをbindしてから作業をする。
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

    // 各頂点情報の位置。
    const vtxAttrLocation      = gl.getAttribLocation(program, 'vertexPosition');
    const textureCoordLocation = gl.getAttribLocation(program, 'textureCoord');

    // 各頂点情報の有効化。
    gl.enableVertexAttribArray(vtxAttrLocation);
    gl.enableVertexAttribArray(textureCoordLocation);

    // 各頂点情報の情報指定。
    gl.vertexAttribPointer(vtxAttrLocation, POSITION_SIZE, gl.FLOAT, false, STRIDE, 0);
    gl.vertexAttribPointer(textureCoordLocation, TEXTURE_SIZE, gl.FLOAT, false, STRIDE, TEXTURE_OFFSET);

    //
    // シェーダのuniform変数の設定。
    //

    // デフォルトの状態だとxy座標ともに[-1.0, 1.0]が表示されるので、
    // 2Dグラフィックスで一般的な[0.0, width or height]座標に変換する。
    const xScale = 2.0/CANVAS_WIDTH;
    const yScale = -2.0/CANVAS_HEIGHT; // 上下逆

    const scalingMatrix = new Float32Array([
        xScale, 0.0   , 0.0, 0.0,
        0.0   , yScale, 0.0, 0.0,
        0.0   , 0.0   , 1.0, 0.0,
        0.0   , 0.0   , 0.0, 1.0
    ]);

    // (0, 0)が中心になってしまうので左上に持ってきてやる。
    const translationMatrix = new Float32Array([
        1.0, 0.0 , 0.0, 0.0,
        0.0, 1.0 , 0.0, 0.0,
        0.0, 0.0 , 1.0, 0.0,
        -1.0, 1.0 , 0.0, 1.0
    ]);

    const scalingLocation = gl.getUniformLocation(program, 'scaling');
    const translationLocation = gl.getUniformLocation(program, 'translation');
    gl.uniformMatrix4fv(translationLocation, false, translationMatrix);
    gl.uniformMatrix4fv(scalingLocation, false, scalingMatrix);

    //
    // テクスチャの転送。
    //

    const texture = gl.createTexture();     // テクスチャの作成
    gl.bindTexture(gl.TEXTURE_2D, texture); // テクスチャのバインド
    gl.texImage2D(gl.TEXTURE_2D, 0,
                    gl.RGBA, gl.RGBA,
                    gl.UNSIGNED_BYTE, textureData); // テクスチャデータの転送
    gl.generateMipmap(gl.TEXTURE_2D); // ミップマップの作成

    // 使用するテクスチャの指定。
    const textureLocation = gl.getUniformLocation(program, 'tex');
    gl.uniform1i(textureLocation, 0);

    //
    // アルファブレンドを有効にする。
    //
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.enable(gl.BLEND);
})();

//rendering
let progress,jxvel=null,jyac=null,start;
let draw = timestamp =>{
    if (!start) start = timestamp;
    progress = timestamp - start;
    
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
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
