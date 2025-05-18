import p5Types from "p5";
import { DrawState } from '../types';

export const drawLine = (
  p5: p5Types, 
  x: number, 
  y: number, 
  dx: number, 
  dy: number, 
  color: p5Types.Color
) => {
  p5.stroke(color);
  p5.strokeWeight(3.0);
  p5.line(x, y, x + dx, y + dy);
};

export const setupCanvas = (
  p5: p5Types, 
  canvasParentRef: Element
) => {
  p5.createCanvas(p5.windowWidth, p5.windowHeight).parent(canvasParentRef);
  p5.background(0);
  p5.fill(255, 255, 0);
  p5.ellipse(200, 200, 50);
};

export const initializeDrawing = (
  p5: p5Types,
  x: number, 
  y: number
): { lines: { dx: number, dy: number, pen: number[] }[], currentX: number, currentY: number } => {
  const lines = [
    { dx: 50, dy: 20, pen: [1, 0, 0] },
    { dx: -30, dy: 40, pen: [1, 0, 0] }
  ];
  
  let currentX = x;
  let currentY = y;
  
  p5.stroke(p5.color(0, 0, 255));
  p5.strokeWeight(3.0);
  p5.line(currentX, currentY, currentX + lines[0].dx, currentY + lines[0].dy);
  
  currentX += lines[0].dx;
  currentY += lines[0].dy;
  
  p5.stroke(p5.color(0, 255, 0));
  p5.strokeWeight(3.0);
  p5.line(currentX, currentY, currentX + lines[1].dx, currentY + lines[1].dy);
  
  currentX += lines[1].dx;
  currentY += lines[1].dy;
  
  return { lines, currentX, currentY };
};
