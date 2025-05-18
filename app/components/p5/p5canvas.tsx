"use client";
import React from "react";
import Sketch from 'react-p5';
import { useP5Functions } from './hooks/useP5Functions';

export const P5Canvas = () => {
  const [_, __, { preload, setup, draw, windowResized }] = useP5Functions();
  
  return <Sketch 
    preload={preload} 
    setup={setup} 
    draw={draw} 
    windowResized={windowResized} 
  />;
};

export default P5Canvas;
