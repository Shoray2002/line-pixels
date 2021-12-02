import "./style.css"; //import of css styles
import * as THREE from "https://cdn.skypack.dev/three";
import { DragControls } from "https://cdn.skypack.dev/three/examples/jsm/controls/DragControls.js";
import { TWEEN } from "three/examples/jsm/libs/tween.module.min";
import { Text } from "troika-three-text";
import factory from "./assets/factory.png";
import font from "./assets/NotoSansSC-Regular.otf";
// variables
let camera, scene, renderer;
let plane;
let pointer, raycaster, group;
let sphereGeo;
let controls;
const objects = []; // objects in the scene
const size = 16;
const draggableObjects = [];
const data = dataSet();
const faulty = new THREE.MeshPhongMaterial({
  color: 0xf79f1f,
  shininess: 0,
  specular: 0x000000,
  flatShading: true,
});

const dangerous = new THREE.MeshPhongMaterial({
  color: 0xff7675,
  shininess: 0,
  specular: 0x000000,
  flatShading: true,
});
init();
function dataSet() {
  // data

  const staticData = [
    { name: "Name 1", pv: -20, status: "normal" },
    { name: "Name 2", pv: 100, status: "normal" },
    { name: "Name 3", pv: 400, status: "faulty" },
    { name: "Name 4", pv: 0, status: "normal" },
    { name: "Name 5", pv: 82, status: "faulty" },
    { name: "Name 6", pv: 15, status: "normal" },
    { name: "Name 7", pv: 400, status: "normal" },
    { name: "Name 8", pv: 39, status: "normal" },
    { name: "名字 9", pv: -73, status: "dangerous" },
    { name: "名字 10", pv: 82, status: "normal" },
    { name: "名字 11", pv: 15, status: "normal" },
    { name: "名字 12", pv: 400, status: "normal" },
    { name: "名字 13", pv: 39, status: "normal" },
    { name: "名字 14", pv: -73, status: "dangerous" },
    { name: "名字 15", pv: -198, status: "normal" },
    { name: "名字 16", pv: 76, status: "faulty" },
  ];

  const getColorByStatus = (status) => {
    switch (status) {
      case "faulty":
        return "#F79F1F";
      case "dangerous":
        return "#ff7675";
      case "normal":
      default:
        return "#26de81";
    }
  };
  const data = new Array(size).fill().map((_, id) => ({ id }));
  for (let index = 0; index < size; index += 1) {
    const rows = Math.floor(Math.sqrt(size));
    const resColor = getColorByStatus(staticData[index].status);
    data[index].x = (index % rows) * 1.0 - (rows / 2) * 1.0;
    data[index].y = Math.floor(index / rows) * 1.0 - (rows / 2) * 1.0;
    data[index].z = 0.0;
    data[index].sx = 0.8;
    data[index].sy = 0.8;
    data[index].color = resColor;
    data[index].name = staticData[index].name;
    data[index].pv = staticData[index].pv;
    data[index].status = staticData[index].status;
  }
  return data;
}

function init() {
  // set up scene and camera
  // camera = new THREE.PerspectiveCamera(
  //   75,
  //   window.innerWidth / window.innerHeight,
  //   1,
  //   10000
  // );
  // othographic camera
  camera = new THREE.OrthographicCamera(
    window.innerWidth * -1.2,
    window.innerWidth * 1.2,
    window.innerHeight * 1.2,
    window.innerHeight * -1.2,
    2,
    10000
  );
  camera.position.set(0, 1200, 0);
  camera.lookAt(0, 0, 0);
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000);

  group = new THREE.Group();
  scene.add(group);

  // sphere
  sphereGeo = new THREE.SphereGeometry(50, 32, 32);
  function sphereMaterial(color, status) {
    if (status === "faulty") {
      return faulty;
    }
    if (status === "dangerous") {
      return dangerous;
    } else {
      return new THREE.MeshLambertMaterial({
        color: color,
        opacity: 0.95,
        transparent: true,
      });
    }
  }

  let board = new THREE.Group();
  for (let i = 0; i < size; i++) {
    var sphere;
    const { x, y, sx, sy, color, name, pv, status } = data[i];
    sphere = new THREE.Mesh(sphereGeo, sphereMaterial(color, status));
    sphere.position.set(x * 400 + 150, 0, y * 400 + 150);
    sphere.scale.set(sx, sy, 0.8);
    sphere.name = name;
    sphere.status = status;
    const toptext = new Text();
    const bottomtext = new Text();
    toptext.text = name;
    toptext.fontSize = 40;
    toptext.name = name;
    let len = name.length;
    toptext.position.set(x * 400 + 150 - len * 13, 20, y * 400 + 50);
    toptext.rotation.x = -Math.PI / 2;
    toptext.font = font;

    bottomtext.text = "PV: " + pv;
    bottomtext.fontSize = 40;
    len = bottomtext.text.length;
    bottomtext.position.set(x * 400 + 150 - len * 10, 20, y * 400 + 200);
    bottomtext.rotation.x = -Math.PI / 2;
    bottomtext.name = name;
    board.add(sphere, toptext, bottomtext);
    draggableObjects.push([sphere, toptext, bottomtext]);
    // objects.push(board);
    objects.push(sphere);
    objects.push(toptext);
    objects.push(bottomtext);
  }
  console.log(draggableObjects);
  board.position.set(25, 12.5, 25);
  scene.add(board);

  raycaster = new THREE.Raycaster();
  pointer = new THREE.Vector2();
  const geometry = new THREE.PlaneGeometry(2000, 2000);
  geometry.rotateX(-Math.PI / 2);

  var img = new THREE.MeshBasicMaterial({
    map: THREE.ImageUtils.loadTexture(factory),
  });
  img.map.needsUpdate = true;
  plane = new THREE.Mesh(geometry, img);
  scene.add(plane);
  // objects.push(plane);

  // lights
  const ambientLight = new THREE.AmbientLight(0xffffff);
  scene.add(ambientLight);
  const directionalLight = new THREE.DirectionalLight(0xffffff);
  directionalLight.position.set(
    camera.position.x,
    camera.position.y,
    camera.position.z
  );
  scene.add(directionalLight);

  // renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // events
  document.addEventListener("pointermove", onPointerMove);
  window.addEventListener("resize", onWindowResize);
  window.addEventListener("wheel", (event) => {
    // zoom in and out
    // if (event.deltaY < 0) {
    //   camera.fov -= 2;
    // } else {
    //   camera.fov += 2;
    // }
    if (event.deltaY < 0) {
      camera.zoom += 0.05;
    }
    if (event.deltaY > 0) {
      camera.zoom -= 0.05;
    }

    camera.updateProjectionMatrix();
    render();
  });

  // keyboard controls
  window.addEventListener("keydown", (event) => {
    switch (event.key) {
      case "ArrowUp": // up
        camera.position.z -= 10;
        break;
      case "ArrowDown": // down
        camera.position.z += 10;
        break;
      case "ArrowLeft": // left
        camera.position.x -= 10;
        break;
      case "ArrowRight": // right
        camera.position.x += 10;
        break;
      case "+": // +
        camera.zoom += 0.05;
        break;
      case "-": // -
        camera.zoom -= 0.05;
        break;
      case "r": // reset
        camera.position.set(0, 1200, 0);
        camera.lookAt(0, 0, 0);
        camera.zoom = 1;
        break;
      default:
        break;
    }
    camera.updateProjectionMatrix();
    render();
  });

  // drag multiple objects at once
  controls = new DragControls([...objects], camera, renderer.domElement);
  // controls.transformGroup = true;
  console.log(controls.getObjects());
  controls.addEventListener("hoveron", hover);
  controls.addEventListener("hoveroff", hover);
  controls.addEventListener("drag", render);
}

// event handlers
function hover(event) {
  console.log(event.object.name, event.object.geometry.type);
  const selected = objects.filter(
    (object) => object.name === event.object.name
  );
  if (event.type === "hoveron") {
    selected.forEach((object) => {
      if (object.geometry.type === "SphereGeometry") {
        object.scale.set(0.95, 0.95, 0.95);
      }
    });
  } else if (event.type === "hoveroff") {
    selected.forEach((object) => {
      if (object.geometry.type === "SphereGeometry") {
        object.scale.set(0.8, 0.8, 0.8);
      }
    });
  }
  render();
}

function onWindowResize() {
  camera.left = window.innerWidth * -1.2;
  camera.right = window.innerWidth * 1.2;
  camera.top = window.innerHeight * 1.2;
  camera.bottom = window.innerHeight * -1.2;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  render();
}

// when user moves the pointer
function onPointerMove(event) {
  raycaster.setFromCamera(pointer, camera);
  render();
}

// render the scene
function render() {
  renderer.render(scene, camera);
}

const faultySpheres = objects.filter((object) => object.status === "faulty");
const dangerousSpheres = objects.filter(
  (object) => object.status === "dangerous"
);
// setInterval(() => {
//   faultySpheres.forEach((sphere) => {
//     if (sphere.material.color === 0xf79f1f) {
//       let tween = new TWEEN.Tween(sphere.material.color)
//         .to({ r: 177, g: 128, b: 208 },1)
//         .easing(TWEEN.Easing.Quartic.In)
//         .repeat(Infinity)
//         .yoyo(true)
//         .start();
//       console.log(sphere.material.color);
//       tween.update(Date.now());
//     } else {
//       let tween = new TWEEN.Tween()
//       tween._valuesStart = sphere.material.color;
//       tween._valuesEnd = "blue";
//       console.log(tween);
//       console.log(sphere.material.color);
//       tween.update(Date.now());
//     }
//   });
//   render();
// }, 1000);

// animate the scene
function animate() {
  requestAnimationFrame(animate);
  render();
}

animate();
