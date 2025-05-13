"use client";
import React, { useState } from "react";
//import Sketch from "react-p5";
import p5Types from "p5";
import dynamic from 'next/dynamic'
import Sketch from 'react-p5';
import { SketchRNN } from '@magenta/sketch';
import { LSTMState } from "@magenta/sketch/es5/sketch_rnn/model";

let x = 50;
const y = 50;

/*const Sketch = dynamic(import('react-p5'), {
    loading: () => <>..loading</>,
    ssr: false
})*/

const MODEL_URL =
    'https://storage.googleapis.com/quickdraw-models/sketchRNN/models/cat.gen.json';

export const P5Canvas = () => {

    let temperature = 0.45;

    const [model, setModel] = useState<SketchRNN>()
    const [rnnState, setRnnState] = useState<LSTMState>()
    const [modelLoaded, setModelLoaded] = useState(false);
    const [sketchInitModel, setSketchInitModel] = useState(false)

    const [x, setX] = useState(0);
    const [y, setY] = useState(0);
    const [dx, setDx] = useState(0);
    const [dy, setDy] = useState(0);
    const [penDown, setPenDown] = useState(0)
    const [penUp, setPenUp] = useState(0)
    const [penEnd, setPenEnd] = useState(0)
    const [prevPen, setPrevPen] = useState([1, 0, 0])


    const preload = async (p5: p5Types) => {
        console.log("preload")
        let nModel = new SketchRNN(MODEL_URL)
        setModel(nModel);
        console.log(model)
        if (nModel && typeof nModel.initialize === 'function') { // モデルと initialize メソッドの存在確認
            await nModel.initialize(); // モデルの非同期初期化処理を待ち合わせる
            console.log("モデルの初期化が完了しました。"); // 初期化完了のログ
            setModelLoaded(true)
            //model.setPixelFactor(3.0);
        } else { // initialize メソッドが存在しない場合
            console.warn("ms.SketchRNN に model.initialize() メソッドが見つかりません。モデルが完全にロードされる前に setup() が実行される可能性があります。"); // 警告ログ
        }
    };

    // 初期処理
    const setup = (p5: p5Types, canvasParentRef: Element) => {
        //ペンの初期位置
        setX(p5.windowWidth / 2.0)
        setY(p5.windowHeight / 3.0)

        // 背景の大きさ設定
        // First, let's try a fixed size to see if it displays.
        p5.createCanvas(p5.windowWidth, p5.windowHeight).parent(canvasParentRef);
        //p5.createCanvas(400, 400).parent(canvasParentRef);
        //console.log("p5.js setup: Canvas created with 400x400");

        // 背景色設定
        p5.background(0);

        // オブジェクトの色設定 (図形描画より前に設定)
        p5.fill(255, 255, 0);

        // オブジェクトの設置
        // Display a 50px circle in the center of the fixed-size canvas.
        p5.ellipse(200, 200, 50); // Center of 400x400 canvas is 200,200
    };

    // 1フレームごとの処理
    const draw = (p5: p5Types) => {
        // No continuous drawing needed for this static sketch yet
        if (modelLoaded && !sketchInitModel) {
            console.log("Draw: モデルがロードされたので、スケッチの初期化を行います。"); // 初期化開始のログ
            model!.setPixelFactor(3.0); // モデルの出力するストロークの長さを画面ピクセルに変換する際の倍率を設定
            let modelZero = model!.zeroInput()
            setDx(modelZero[0])
            setDy(modelZero[1])
            setPenDown(modelZero[2])
            setPenUp(modelZero[3])
            setPenEnd(modelZero[4])
            let nRnnState = model!.zeroState();
            setRnnState(nRnnState)

            setPrevPen([1, 0, 0])

            setSketchInitModel(true)
            p5.background(255);
        }

        if (sketchInitModel) {
            // 前のペンの状態と現在のRNNの隠れ状態を使って、次のRNNの隠れ状態を取得する
            // この処理は特に大きなモデルの場合、CPUパワーを最も消費する部分
            let nRnnState = model!.update([dx, dy, penDown, penUp, penEnd], rnnState!); // モデルの状態を更新

            // 更新されたRNNの隠れ状態と温度パラメータから、確率分布(pdf)のパラメータを取得する
            let pdf = model!.getPDF(nRnnState, temperature); // 次のストロークの確率分布を取得

            // 取得した確率分布から、次のペンの状態（移動量、上下状態）をサンプリング（ランダムに選択）する
            let dDx = model!.sample(pdf)[0];
            let dDy = model!.sample(pdf)[1];
            let dPenDown = model!.sample(pdf)[2];
            let dPenUp = model!.sample(pdf)[3];
            let dPenEnd = model!.sample(pdf)[4];

            // 前のフレームでペンが紙に接していた場合（prev_pen[0] が 1 の場合）のみ線を描画する
            if (prevPen[0] == 1) { // prev_pen[0] は pen_down フラグ
                p5.stroke(p5.color(255, 0, 0)); // 線の色を設定
                p5.strokeWeight(3.0); // 線の太さを3.0ピクセルに設定
                p5.line(x, y, x + dDx, y + dDy); // 現在のペン位置 (x,y) から、移動量 (dx,dy) だけ動いた新しい位置まで線を描画
            }

            // ペンの絶対座標を、サンプリングされたオフセット (dx, dy) を使って更新する
            setX(x + dDx)
            setY(y + dDy)

            // 「前のペンの状態」を、今回サンプリングされた現在のペンの状態に更新する
            setPrevPen([dPenDown, dPenUp, dPenEnd])
            setRnnState(nRnnState)
            setDx(dDx)
            setDy(dDy)
            setPenDown(dPenDown)
            setPenUp(dPenUp)
            setPenEnd(dPenEnd)
        }

        if (sketchInitModel && prevPen[2] == 1) { // prev_pen[2] は pen_end フラグ
            console.log("Draw End")
            p5.noLoop(); // draw 関数のループを停止する
            return; // draw 関数の残りの処理をスキップ
        }
    };

    // コンポーネントのレスポンシブ化
    const windowResized = (p5: p5Types) => {
        // Since we're using a fixed size for now, we can comment this out or adjust later.
        // p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
        console.log("p5.js windowResized: Triggered, but canvas is fixed size for now.");
    };

    return <Sketch preload={preload} setup={setup} draw={draw} windowResized={windowResized} />;
}

export default P5Canvas;