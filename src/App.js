/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useRef, useState } from "react";
import "./App.css";
import { plotImage, plotBox, getMousePosition } from "./plot";
import { getImage } from "./mandelbrot";
import { debounce } from "lodash";
import { useWasm } from "./useWasm";

const MAX_ITERATION = 30;
const DIM = 300;

function App() {
  const canvasRef = useRef(null);
  const [image2D, setImage2D] = useState([]);
  const [loading, setLoading] = useState(true);
  const [clip, setClip] = useState({
    RE_START: -1.5,
    RE_END: 1.5,
    IM_START: -2.2,
    IM_END: 0.8,
  });
  const [mouseCoordinates, setMouseCoordinates] = useState();
  const [timeTaken, setTimeTaken] = useState();
  const [enableWASM, setEnableWASM] = useState(false);
  const [ITR, setITR] = useState(MAX_ITERATION);

  const wasm = useWasm();

  const draw = (ctx) => {
    plotImage(ctx, image2D);
    if (mouseCoordinates) plotBox(ctx, mouseCoordinates, DIM);
  };

  const handleMouseMove = useCallback(
    debounce((event) => {
      const { x, y } = getMousePosition(canvasRef.current, event);
      setTimeout(() => {
        setMouseCoordinates({ x, y });
      });
    }, 10),
    []
  );
  const zoomImage = (event) => {
    const { x, y } = getMousePosition(canvasRef.current, event);
    const { RE_START, IM_START, IM_END } = clip;
    let X = (x - DIM / 8) / DIM; // Finds left top of box
    let Y = (y - DIM / 8) / DIM;
    const D = IM_END - IM_START; // current complex window dimension
    X *= D; // Scale to complex plane
    Y *= D;
    X += IM_START;
    Y += RE_START;
    const W = D / 4;
    const newClip = { RE_START: Y, RE_END: Y + W, IM_START: X, IM_END: X + W };
    setClip(newClip);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    let animationFrameId;
    draw(context);

    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [mouseCoordinates, image2D]);

  useEffect(() => {
    if (!clip) return;
    setLoading(true);
    if (enableWASM && wasm) {
      const start = performance.now();
      const image = wasm?.getImage(
        clip.RE_START,
        clip.RE_END,
        clip.IM_START,
        clip.IM_END,
        ITR,
        DIM
      );
      const image2D = image.map((pixel) => {
        const [x, y, intensity] = pixel.split(",");
        return { x: Number(x), y: Number(y), intensity: Number(intensity) };
      });
      setImage2D(image2D);
      setLoading(false);
      setTimeTaken(((performance.now() - start) / 1000).toFixed(2));
      console.log("Using WASM");
      setITR(ITR + 5);
    }
    if (!enableWASM) {
      setTimeout(() => {
        getImage(clip, ITR, DIM).then(({ image2D, delta }) => {
          setImage2D(image2D);
          setLoading(false);
          setTimeTaken(delta);
          console.log("Using JS");
        });
        setITR(ITR + 5);
      });
    }
  }, [clip, wasm]);

  return (
    <div style={{ padding: "0 20px", textAlign: "center" }}>
      <h1>Mandelbrot Fractal </h1>
      <p>Select area to zoom in</p>
      <br />
      <div
        style={{
          padding: 10,
          border: "1px solid #555555",
          display: "inline-block",
        }}
      >
        <canvas
          onMouseMove={handleMouseMove}
          onClick={zoomImage}
          ref={canvasRef}
          width={DIM}
          height={DIM}
        />
      </div>
      <div>
        {loading ? (
          <span style={{ fontSize: 15 }}>Rendering...</span>
        ) : (
          timeTaken && (
            <span style={{ fontSize: 15 }}>
              Last render time: {timeTaken} Sec
            </span>
          )
        )}
        <br />
        <br />
        <button onClick={() => window.location.reload()}>RESET</button>
      </div>
    </div>
  );
}

export default App;
