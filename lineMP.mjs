function lineMP({ x: x1, y: y1 }, { x: x2, y: y2 }) {
  let result = [];
  let m = (y2 - y1) / (x2 - x1);
  let dx = x2 - x1;
  let dy = y2 - y1;
  let x = x1,
    y = y1;
  let i = 1;
  result.push({ x, y });
  if (Math.abs(m) < 1) {
    let p = 2 * dy - dx;
    while (i <= Math.abs(dx)) {
      if (p < 0) {
        x = x + 1;
        p = p + 2 * dy;
        // console.log("x: " + x + " y: " + y);
        result.push({ x, y });

        i++;
      } else {
        x = x + 1;
        y = y + 1;
        p = p + 2 * dy - 2 * dx;
        // console.log("x: " + x + " y: " + y);
        result.push({ x, y });
        i++;
      }
    }
  } else {
    let p = 2 * dx - dy;
    while (i <= Math.abs(dy)) {
      if (p < 0) {
        y = y + 1;
        p = p + 2 * dx;
        // console.log("x: " + x + " y: " + y);
        result.push({ x, y });
        i++;
      } else {
        x = x + 1;
        y = y + 1;
        p = p + 2 * dx - 2 * dy;
        // console.log("x: " + x + " y: " + y);
        result.push({ x, y });
        i++;
      }
    }
  }
  console.log(result);
  return result;
}
export { lineMP };
