import { SketchRNN } from '@magenta/sketch';
import { LSTMState } from "@magenta/sketch/es5/sketch_rnn/model";
import p5Types from "p5";

export interface P5CanvasProps {
}

export interface DrawState {
  x: number;
  y: number;
  dx: number;
  dy: number;
  penDown: number;
  penUp: number;
  penEnd: number;
  prevPen: number[];
}

export interface ModelState {
  model?: SketchRNN;
  rnnState?: LSTMState;
  modelLoaded: boolean;
  sketchInitModel: boolean;
}

export interface P5Functions {
  preload: (p5: p5Types) => Promise<void>;
  setup: (p5: p5Types, canvasParentRef: Element) => void;
  draw: (p5: p5Types) => void;
  windowResized: (p5: p5Types) => void;
}
