import { Vector3 } from "three";
const height = 75 / 2;
const width = 55 / 2;

function lineMP(plane1, plane2, type = "linear") {
  if (type === "linear") {
    return straightLine(plane1, plane2);
  } else if (type == "curved") {
    return curvedLine(plane1, plane2);
  }
}

function straightLine(plane1, plane2) {
  if (plane1[1] == plane2[1]) {
    if (plane1[0] < plane2[0]) {
      return [
        new Vector3(plane1[0] + width, plane1[1], plane1[2]),
        new Vector3(plane2[0] - width, plane2[1], plane2[2]),
      ];
    } else if (plane1[0] > plane2[0]) {
      return [
        new Vector3(plane1[0] - width, plane1[1], plane1[2]),
        new Vector3(plane2[0] + width, plane2[1], plane2[2]),
      ];
    }
  } else if (plane1[0] == plane2[0]) {
    if (plane1[1] < plane2[1]) {
      return [
        new Vector3(plane1[0], plane1[1] + height, plane1[2]),
        new Vector3(plane2[0], plane2[1] - height, plane2[2]),
      ];
    } else if (plane1[1] > plane2[1]) {
      return [
        new Vector3(plane1[0], plane1[1] - height, plane1[2]),
        new Vector3(plane2[0], plane2[1] + height, plane2[2]),
      ];
    }
  } else {
    if (plane1[1] > plane2[1]) {
      let diff = plane1[1] - plane2[1];
      if (diff < height * 2) {
        return [
          new Vector3(plane1[0] - width, plane1[1], plane1[2]),
          new Vector3(plane2[0] + width, plane2[1], plane2[2]),
        ];
      } else {
        return [
          new Vector3(plane1[0], plane1[1] - height, plane1[2]),
          new Vector3(plane2[0], plane2[1] + height, plane2[2]),
        ];
      }
    } else if (plane1[1] < plane2[1]) {
      let diff = plane2[1] - plane1[1];
      if (diff < height * 2) {
        return [
          new Vector3(plane1[0] - width, plane1[1], plane1[2]),
          new Vector3(plane2[0] + width, plane2[1], plane2[2]),
        ];
      } else {
        return [
          new Vector3(plane1[0], plane1[1] + height, plane1[2]),
          new Vector3(plane2[0], plane2[1] - height, plane2[2]),
        ];
      }
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
