import "./style.css"; //import of css styles
import * as THREE from "https://cdn.skypack.dev/three";
import { OrbitControls } from "https://cdn.skypack.dev/three/examples/jsm/controls/OrbitControls.js";
import { DragControls } from "https://cdn.skypack.dev/three/examples/jsm/controls/DragControls.js";
import { Text } from "troika-three-text";
import { lineMP } from "./lineMP.mjs";
import factory from "./assets/factory.png";
// import of mjs module

// variables
let camera, scene, renderer;
let plane;
let pointer, raycaster;
let sphereGeo, sphereMaterial;
const objects = []; // objects in the scene
const size = 16;

const data = dataSet();
console.log(data);
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
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    1,
    10000
  );
  camera.position.set(0, 1200, 0);
  camera.lookAt(0, 0, 0);
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000);

  // sphere
  sphereGeo = new THREE.SphereGeometry(50, 12.5, 50);
  function sphereMaterial(color) {
    return new THREE.MeshLambertMaterial({
      color: color,
      opacity: 0.8,
      transparent: true,
    });
  }

  let board = new THREE.Group();
  for (let i = 0; i < size; i++) {
    var cube;
    const { x, y, sx, sy, color, name, pv } = data[i];
    cube = new THREE.Mesh(sphereGeo, sphereMaterial(color));
    cube.position.set(x * 400, -20, y * 400 + 150);
    cube.scale.set(sx, sy, 0.8);
    cube.name = name;
    const toptext = new Text();
    const bottomtext = new Text();
    toptext.text = name;
    toptext.fontSize = 40;
    toptext.name = name;
    toptext.position.set(x * 400 - 50, 20, y * 400 + 50);
    toptext.rotation.x = -Math.PI / 2;
    bottomtext.text = "PV: " + pv;
    bottomtext.fontSize = 40;
    bottomtext.position.set(x * 400 - 50, 20, y * 400 + 220);
    bottomtext.rotation.x = -Math.PI / 2;
    bottomtext.name = name;
    board.add(cube);
    board.add(toptext);
    board.add(bottomtext);
    objects.push(cube);
    objects.push(toptext);
    objects.push(bottomtext);
  }
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
  directionalLight.position.set(1, 0.75, 0.5).normalize();
  scene.add(directionalLight);

  // renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // controls
  document.addEventListener("pointermove", onPointerMove);
  window.addEventListener("resize", onWindowResize);
  window.addEventListener("wheel", (event) => {
    // zoom in and out
    if (event.deltaY < 0) {
      camera.fov -= 2;
    } else {
      camera.fov += 2;
    }
    camera.updateProjectionMatrix();
    render();
  });
  const controls = new DragControls([...objects], camera, renderer.domElement);
  controls.addEventListener("drag", render);
  console.log(controls.getObjects());
}

// event handlers

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
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

// animate the scene
function animate() {
  // const controls = new OrbitControls(camera, renderer.domElement);
  // controls.enableDamping = true;
  // controls.dampingFactor = 1;
  // controls.enableZoom = false;
  // controls.enableRotate = false;
  // controls.panSpeed = 0.1;
  // controls.update();
  requestAnimationFrame(animate);
  render();
}

animate();
