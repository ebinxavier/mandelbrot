import { useEffect, useState } from "react";
import { AsBind } from "as-bind";

export const useWasm = () => {
  const [state, setState] = useState(null);
  useEffect(() => {
    const fetchWasm = async () => {
      try {
        const wasm = await fetch("fractal.wasm");
        const instance = await AsBind.instantiate(wasm, {
          index: {
            consoleLog: (message) => {
              console.log(message);
            },
          },
        });
        setState(instance.exports);
      } catch (e) {
        console.log(`error`, e);
      }
    };
    fetchWasm();
  }, []);
  return state;
};
