declare function consoleLog(message: String): void;
//   consoleLog("ABS: " + z.abs().toString() + " z:" + z.toString());

class Complex {
  // a + ib form
  a: f64;
  b: f64;
  constructor(a: f64, b: f64) {
    this.a = a;
    this.b = b;
  }
  add(num: Complex): Complex {
    const real = this.a + num.a;
    const imag = this.b + num.b;
    return new Complex(real, imag);
  }
  square(): Complex {
    const a = this.a;
    const b = this.b;
    return new Complex(a * a - b * b, 2 * a * b);
  }
  abs(): f64 {
    return Math.sqrt(this.a * this.a + this.b * this.b);
  }
  toString(): String {
    return (
      this.a.toString() +
      (this.b < 0 ? "-" : "+") +
      "i" +
      Math.abs(this.b).toString()
    );
  }
}

const mandelBrot = (c: Complex, MAX_ITERATION: number): number => {
  let z = new Complex(0, 0);
  let n = 0;
  while (z.abs() <= 2 && n < MAX_ITERATION) {
    z = z.square().add(c);
    n += 1;
  }
  return n;
};

export function getImage(
  RE_START: f64,
  RE_END: f64,
  IM_START: f64,
  IM_END: f64,
  MAX_ITERATION: number,
  DIM: number
): String[] {
  const image2D: String[] = [];
  for (let x: f64 = 0; x < DIM; x++) {
    for (let y: f64 = 0; y < DIM; y++) {
      const a = IM_START + (y / DIM) * (IM_END - IM_START);
      const b = RE_START + (x / DIM) * (RE_END - RE_START);
      let c = new Complex(a, b);
      const intensity = mandelBrot(c, MAX_ITERATION);
      const normalized: f64 =
        ((MAX_ITERATION - intensity) / MAX_ITERATION) * 255;
      const values: String =
        y.toString() + "," + x.toString() + "," + normalized.toString();
      image2D.push(values);
    }
  }
  return image2D;
}

export function test(): String[] {
  const c = new Complex(7, 3);
  const square = c.square();
  const sum = c.add(c);
  const abs = c.abs();
  return [square.toString(), sum.toString(), abs.toString()];
}
