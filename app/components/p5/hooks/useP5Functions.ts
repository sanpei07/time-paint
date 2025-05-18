import { useState } from 'react';
import p5Types from "p5";
import { SketchRNN } from '@magenta/sketch';
import { LSTMState } from "@magenta/sketch/es5/sketch_rnn/model";
import { DrawState, ModelState, P5Functions } from '../types';
import { MODEL_URL, TEMPERATURE } from '../constants';
import { createModel, updateRNNState, sampleFromModel } from '../model/sketchRNN';
import { setupCanvas, initializeDrawing, drawLine } from '../utils/drawing';

export const useP5Functions = (): [ModelState, DrawState, P5Functions] => {
  const [model, setModel] = useState<SketchRNN>();
  const [rnnState, setRnnState] = useState<LSTMState>();
  const [modelLoaded, setModelLoaded] = useState(false);
  const [sketchInitModel, setSketchInitModel] = useState(false);

  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [dx, setDx] = useState(0);
  const [dy, setDy] = useState(0);
  const [penDown, setPenDown] = useState(0);
  const [penUp, setPenUp] = useState(0);
  const [penEnd, setPenEnd] = useState(0);
  const [prevPen, setPrevPen] = useState([1, 0, 0]);

  const preload = async (p5: p5Types) => {
    console.log("preload");
    try {
      const nModel = await createModel();
      setModel(nModel);
      setModelLoaded(true);
    } catch (error) {
      console.error("モデルの読み込み中にエラーが発生しました。", error);
    }
  };

  const setup = (p5: p5Types, canvasParentRef: Element) => {
    setX(p5.windowWidth / 2.0);
    setY(p5.windowHeight / 3.0);
    setupCanvas(p5, canvasParentRef);
  };

  const draw = (p5: p5Types) => {
    if (modelLoaded && !sketchInitModel && model) {
      console.log("Draw: モデルがロードされたので、スケッチの初期化を行います。");
      p5.background(255);
      model.setPixelFactor(3.0);

      const { lines, currentX, currentY } = initializeDrawing(p5, x, y);
      
      let currentRnnState = model.zeroState();
      
      currentRnnState = model.update(
        [lines[0].dx, lines[0].dy, lines[0].pen[0], lines[0].pen[1], lines[0].pen[2]], 
        currentRnnState
      );
      
      currentRnnState = model.update(
        [lines[1].dx, lines[1].dy, lines[1].pen[0], lines[1].pen[1], lines[1].pen[2]], 
        currentRnnState
      );

      setX(currentX);
      setY(currentY);
      setDx(lines[1].dx);
      setDy(lines[1].dy);
      setPenDown(lines[1].pen[0]);
      setPenUp(lines[1].pen[1]);
      setPenEnd(lines[1].pen[2]);
      setPrevPen(lines[1].pen);
      setRnnState(currentRnnState);
      
      setPrevPen([1, 0, 0]);
      setSketchInitModel(true);
      p5.stroke(p5.color(255, 0, 0));
    }

    if (sketchInitModel && model && rnnState) {
      const nRnnState = updateRNNState(
        model, dx, dy, penDown, penUp, penEnd, rnnState
      );

      const sample = sampleFromModel(model, nRnnState, TEMPERATURE);
      
      if (prevPen[0] === 1) {
        drawLine(p5, x, y, sample.dx, sample.dy, p5.color(255, 0, 0));
      }

      setX(x + sample.dx);
      setY(y + sample.dy);
      setPrevPen([sample.penDown, sample.penUp, sample.penEnd]);
      setRnnState(nRnnState);
      setDx(sample.dx);
      setDy(sample.dy);
      setPenDown(sample.penDown);
      setPenUp(sample.penUp);
      setPenEnd(sample.penEnd);
    }

    if (sketchInitModel && prevPen[2] === 1) {
      console.log("Draw End");
      p5.noLoop();
      return;
    }
  };

  const windowResized = (p5: p5Types) => {
    console.log("p5.js windowResized: Triggered, but canvas is fixed size for now.");
  };

  const modelState: ModelState = {
    model,
    rnnState,
    modelLoaded,
    sketchInitModel,
  };

  const drawState: DrawState = {
    x,
    y,
    dx,
    dy,
    penDown,
    penUp,
    penEnd,
    prevPen,
  };

  const p5Functions: P5Functions = {
    preload,
    setup,
    draw,
    windowResized,
  };

  return [modelState, drawState, p5Functions];
};
