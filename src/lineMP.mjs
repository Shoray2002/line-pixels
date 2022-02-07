import { Vector3 } from "three";
const height = 75 / 2;
const width = 55 / 2;

function lineMP(x, y, type = "linear") {
  if (type === "linear") {
    return straightLine(x, y);
  } else if (type == "curved") {
    return curvedLine(x, y);
  }
}

function straightLine(x, y) {
  if (x[1] == y[1]) {
    if (x[0] < y[0]) {
      console.log("loc1[0] < loc2[0]");
      return [
        new Vector3(x[0] + width, x[1], x[2]),
        new Vector3(y[0] - width, y[1], y[2]),
      ];
    } else if (x[0] > y[0]) {
      console.log("loc1[0] > loc2[0]");
      return [
        new Vector3(x[0] - width, x[1], x[2]),
        new Vector3(y[0] + width, y[1], y[2]),
      ];
    }
  } else if (x[0] == y[0]) {
    if (x[1] < y[1]) {
      console.log("loc1[1] < loc2[1]");
      return [
        new Vector3(x[0], x[1] + height, x[2]),
        new Vector3(y[0], y[1] - height, y[2]),
      ];
    } else if (x[1] > y[1]) {
      console.log("loc1[1] > loc2[1]");
      return [
        new Vector3(x[0], x[1] - height, x[2]),
        new Vector3(y[0], y[1] + height, y[2]),
      ];
    }
  } else {
    if (x[1] > y[1]) {
      return [
        new Vector3(x[0], x[1] - height, x[2]),
        new Vector3(y[0], y[1] + height, y[2]),
      ];
    } else if (x[1] < y[1]) {
      return [
        new Vector3(x[0], x[1] + height, x[2]),
        new Vector3(y[0], y[1] - height, y[2]),
      ];
    }
  }
}

function curvedLine(x, y) {
  // if (Math.abs(x[0] - y[0]) < 4 * width) {
  return [
    new Vector3(x[0], x[1] - height, x[2]),
    new Vector3(x[0], y[1], y[2]),
    new Vector3(y[0] + width, y[1], y[2]),
  ];
  // }
}

export { lineMP };
