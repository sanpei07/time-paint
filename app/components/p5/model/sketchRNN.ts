import { SketchRNN } from '@magenta/sketch';
import { LSTMState } from "@magenta/sketch/es5/sketch_rnn/model";
import { MODEL_URL } from '../constants';

export const createModel = async (): Promise<SketchRNN> => {
  const model = new SketchRNN(MODEL_URL);
  if (model && typeof model.initialize === 'function') {
    await model.initialize();
    console.log("モデルの初期化が完了しました。");
  } else {
    console.warn("ms.SketchRNN に model.initialize() メソッドが見つかりません。モデルが完全にロードされる前に setup() が実行される可能性があります。");
  }
  return model;
};

export const updateRNNState = (
  model: SketchRNN,
  dx: number,
  dy: number,
  penDown: number,
  penUp: number,
  penEnd: number,
  rnnState: LSTMState
): LSTMState => {
  return model.update([dx, dy, penDown, penUp, penEnd], rnnState);
};

export const sampleFromModel = (
  model: SketchRNN,
  rnnState: LSTMState,
  temperature: number
) => {
  const pdf = model.getPDF(rnnState, temperature);
  const sample = model.sample(pdf);
  return {
    dx: sample[0],
    dy: sample[1],
    penDown: sample[2],
    penUp: sample[3],
    penEnd: sample[4],
  };
};
