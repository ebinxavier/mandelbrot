import gradient from "tinygradient";

export const plotImage = (ctx, imageArray = []) => {
  // imageArray[] = {x,y,color:{r,g,b,a}}[]
  ctx.fillStyle = "rgba(255,255,255,255)";
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  imageArray.forEach((pixel) => {
    ctx.fillStyle = getColor(pixel.intensity);
    ctx.fillRect(pixel.x, pixel.y, 1, 1);
  });
  ctx.fill();
};

export const plotBox = (ctx, { x, y }, DIM) => {
  ctx.strokeStyle = "#000000";
  ctx.strokeRect(x - DIM / 8, y - DIM / 8, DIM / 4, DIM / 4);
  ctx.fill();
};

export const getMousePosition = (canvas, event) => {
  let rect = canvas.getBoundingClientRect();
  let x = event.clientX - rect.left;
  let y = event.clientY - rect.top;
  return { x, y };
};

const generator = gradient([
  "#ff5f18",
  "#e98d10",
  "#dae046",
  "#617bb3",
  "#555ddd",
]);
const colors = generator.rgb(256).map((color) => color.toRgbString());
const getColor = (alpha) => {
  const index = Math.floor(alpha);
  if (index <= 0) {
    return "rgba(0,0,0)";
  }
  return colors[index];
};
