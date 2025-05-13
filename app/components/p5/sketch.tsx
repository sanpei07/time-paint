"use client";
import dynamic from 'next/dynamic'

const P5Sketch = dynamic(() => import('./p5canvas'), { ssr: false });

export default P5Sketch;