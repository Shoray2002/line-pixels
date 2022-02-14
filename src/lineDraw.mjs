import { Vector3 } from "three";
const height = 75 / 2;
const width = 55 / 2;

function lineDraw(plane1, plane2, type = "linear", direction) {
  let vec = [];
  let arrow = [];
  if (type === "linear") {
    vec = straightLine(plane1, plane2);
  } else if (type == "curved") {
    vec = curvedLine(plane1, plane2);
  }
  // get last element of vector
  arrow.push(vec[vec.length - 1]);
  if (direction === "up") {
    arrow.push([0, 0, 0]);
  } else if (direction === "down") {
    arrow.push([-Math.PI, 0, 0]);
  } else if (direction === "left") {
    arrow.push([Math.PI / 2, 0, Math.PI / 2]);
  } else if (direction === "right") {
    arrow.push([Math.PI / 2, 0, -Math.PI / 2]);
  }

  return [vec, arrow];
}

function straightLine(plane1, plane2) {
  var vec = [];
  if (plane1[1] == plane2[1]) {
    //same y value
    if (plane1[0] < plane2[0]) {
      vec = [
        new Vector3(plane1[0] + width, plane1[1], plane1[2]),
        new Vector3(plane2[0] - width, plane2[1], plane2[2]),
      ];
    } else if (plane1[0] > plane2[0]) {
      vec = [
        new Vector3(plane1[0] - width, plane1[1], plane1[2]),
        new Vector3(plane2[0] + width, plane2[1], plane2[2]),
      ];
    } else {
      vec = [
        new Vector3(plane1[0] - width, plane1[1], plane1[2]),
        new Vector3(plane1[0] - width, plane1[1], plane1[2]),
      ];
    }
  } else if (plane1[0] == plane2[0]) {
    //same x value
    if (plane1[1] < plane2[1]) {
      vec = [
        new Vector3(plane1[0], plane1[1] + height, plane1[2]),
        new Vector3(plane2[0], plane2[1] - height, plane2[2]),
      ];
    } else if (plane1[1] > plane2[1]) {
      vec = [
        new Vector3(plane1[0], plane1[1] - height, plane1[2]),
        new Vector3(plane2[0], plane2[1] + height, plane2[2]),
      ];
    } else {
      vec = [
        new Vector3(plane1[0] - height, plane1[1], plane1[2]),
        new Vector3(plane1[0] - height, plane1[1], plane1[2]),
      ];
    }
  } else {
    if (plane1[1] > plane2[1]) {
      let diff = plane1[1] - plane2[1];
      if (diff < height * 2 && plane1[0] > plane2[0]) {
        vec = [
          new Vector3(plane1[0] - width, plane1[1], plane1[2]),
          new Vector3(plane2[0] + width, plane2[1], plane2[2]),
        ];
      } else if (diff < height * 2 && plane1[0] < plane2[0]) {
        vec = [
          new Vector3(plane1[0] + width, plane1[1], plane1[2]),
          new Vector3(plane2[0] - width, plane2[1], plane2[2]),
        ];
      } else {
        vec = [
          new Vector3(plane1[0], plane1[1] - height, plane1[2]),
          new Vector3(plane2[0], plane2[1] + height, plane2[2]),
        ];
      }
    } else if (plane1[1] < plane2[1]) {
      let diff = plane2[1] - plane1[1];
      if (diff < height * 2 && plane1[0] > plane2[0]) {
        vec = [
          new Vector3(plane1[0] - width, plane1[1], plane1[2]),
          new Vector3(plane2[0] + width, plane2[1], plane2[2]),
        ];
      } else if (diff < height * 2 && plane1[0] < plane2[0]) {
        vec = [
          new Vector3(plane1[0] + width, plane1[1], plane1[2]),
          new Vector3(plane2[0] - width, plane2[1], plane2[2]),
        ];
      } else {
        vec = [
          new Vector3(plane1[0], plane1[1] + height, plane1[2]),
          new Vector3(plane2[0], plane2[1] - height, plane2[2]),
        ];
      }
    }
  }
  return vec;
}

function curvedLine(plane1, plane2) {
  let diffx = Math.abs(plane1[0] - plane2[0]);
  let diffy = Math.abs(plane1[1] - plane2[1]);
  let vec = [];
  if (plane1[1] > plane2[1]) {
    if (plane1[0] > plane2[0] && diffx > width) {
      vec = [
        new Vector3(plane1[0], plane1[1] - height, plane1[2]),
        new Vector3(plane1[0], plane2[1], plane2[2]),
        new Vector3(plane2[0] + width, plane2[1], plane2[2]),
      ];
    } else if (plane1[0] < plane2[0] && diffx > width) {
      vec = [
        new Vector3(plane1[0], plane1[1] - height, plane1[2]),
        new Vector3(plane1[0], plane2[1], plane2[2]),
        new Vector3(plane2[0] - width, plane2[1], plane2[2]),
      ];
    } else {
      vec = [
        new Vector3(plane1[0], plane1[1] - height, plane1[2]),
        new Vector3(plane1[0], plane1[1] - diffy / 2, plane1[2]),
        new Vector3(plane2[0], plane2[1] + diffy / 2, plane2[2]),
        new Vector3(plane2[0], plane2[1] + height, plane2[2]),
      ];
    }
  } else if (plane1[1] < plane2[1]) {
    if (plane1[0] > plane2[0] && diffx > width) {
      vec = [
        new Vector3(plane1[0], plane1[1] + height, plane1[2]),
        new Vector3(plane1[0], plane2[1], plane2[2]),
        new Vector3(plane2[0] + width, plane2[1], plane2[2]),
      ];
    } else if (plane1[0] < plane2[0] && diffx > width) {
      vec = [
        new Vector3(plane1[0], plane1[1] + height, plane1[2]),
        new Vector3(plane1[0], plane2[1], plane2[2]),
        new Vector3(plane2[0] - width, plane2[1], plane2[2]),
      ];
    } else {
      vec = [
        new Vector3(plane1[0], plane1[1] + height, plane1[2]),
        new Vector3(plane1[0], plane1[1] + diffy / 2, plane1[2]),
        new Vector3(plane2[0], plane2[1] - diffy / 2, plane2[2]),
        new Vector3(plane2[0], plane2[1] - height, plane2[2]),
      ];
    }
  } else {
    if (plane1[0] >= plane2[0]) {
      vec = [
        new Vector3(plane1[0], plane1[1] + height, plane1[2]),
        new Vector3(plane1[0], plane1[1] + 2 * height, plane1[2]),
        new Vector3(
          (plane1[0] + plane2[0]) / 2,
          plane1[1] + 2 * height,
          plane1[2]
        ),
        new Vector3((plane1[0] + plane2[0]) / 2, plane2[1], plane2[2]),
        new Vector3(plane2[0] + width, plane2[1], plane2[2]),
      ];
    } else if (plane1[0] < plane2[0]) {
      vec = [
        new Vector3(plane1[0] + width, plane1[1], plane1[2]),
        new Vector3((plane1[0] + plane2[0]) / 2, plane1[1], plane1[2]),
        new Vector3(
          (plane1[0] + plane2[0]) / 2,
          plane2[1] + 2 * height,
          plane2[2]
        ),
        new Vector3(plane2[0], plane2[1] + 2 * height, plane2[2]),
        new Vector3(plane2[0], plane2[1] + height, plane2[2]),
      ];
    }
  }

  return vec;
}

export { lineDraw };
