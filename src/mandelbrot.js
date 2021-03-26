import { complex, abs, add, pow } from "mathjs";
export const MAX_ITERATION = 30;
const mandelBrot = (c, MAX_ITERATION) => {
  let z = 0;
  let n = 0;
  while (abs(z) <= 2 && n < MAX_ITERATION) {
    z = add(pow(z, 2), c);
    n += 1;
  }
  return n;
};

export const DIM = 200;
let W = 0;
export const getImage = async ({ RE_START, RE_END, IM_START, IM_END }) => {
  const ITR = MAX_ITERATION + W;
  W += 10;
  const image2D = [];
  const startTime = performance.now();
  for (let x = 0; x < DIM; x++) {
    for (let y = 0; y < DIM; y++) {
      let c = complex(
        IM_START + (y / DIM) * (IM_END - IM_START),
        RE_START + (x / DIM) * (RE_END - RE_START)
      );
      const intensity = mandelBrot(c, ITR);
      image2D.push({
        y: x,
        x: y,
        color: { a: ((ITR - intensity) / ITR) * 255 },
      });
    }
  }

  return {
    image2D,
    delta: ((performance.now() - startTime) / 1000).toFixed(2),
  };
};
