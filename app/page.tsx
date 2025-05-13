
//import P5Canvas from "@/app/components/p5/p5canvas";
import P5Sketch from "@/app/components/p5/sketch";
import Script from 'next/script';

//const MySketch = dynamic(() => import('./components/p5canvas'), { ssr: false });

export default function Home() {
  return (
    <>
      <div style={{ padding: "20px" }}>
        canvas
        {/* This div will act as a visible container for P5Canvas */}
        <div style={{ marginTop: "10px", border: "2px solid green", width: "404px", height: "404px", padding: "1px" }}>
          {/* P5Canvas will create a 400x400 canvas inside this green-bordered div */}
          <P5Sketch />
        </div>
      </div>
    </>
  );
}
