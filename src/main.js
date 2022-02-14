import "../css/style.css"; //import of css styles
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import grid from "../assets/grid.svg";
import { lineMP } from "./lineMP.mjs";

// variables
let camera, scene, renderer;
let planeGeo, planeMaterials;
let coneGeo;
let curves = [];
let sets = [
  [1, 0, "curved"],
  [1, 2, "linear"],
  [1, 3, "curved"],
  [2, 4, "linear"],
  // [1, 4, "curved"],
  // [0, 3, "curved"],
];
let locationsPlanes = [
  [-170, 60, 0], //0
  [55, 60, 0], //1
  [175, 60, 0], //2
  [-55, -60, 0], //3
  [175, -60, 0], //4
];

// let locationsCones = [
//   [55, 60 + 40.5, 0, -Math.PI, 0, 0],
//   [175 - 30.5, 60, 0, Math.PI / 2, 0, -Math.PI / 2],
//   [-75 + 30.5, -60, 0, Math.PI / 2, 0, Math.PI / 2],
//   [172.5, -60 + 40.5, 0, -Math.PI, 0, 0],
// ];

function init() {
  const texture = new THREE.TextureLoader().load(grid);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(3, 3);
  camera = new THREE.PerspectiveCamera(
    18,
    window.innerWidth / window.innerHeight,
    1,
    100000
  );
  camera.position.set(0, 0, 2000);
  camera.lookAt(0, 0, 0);
  scene = new THREE.Scene();
  scene.background = texture;
  // lights
  const ambientLight = new THREE.AmbientLight(0xffffff);
  scene.add(ambientLight);
  // renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

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
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  render();
}

// render the scene
function render() {
  renderer.render(scene, camera);
}

// animate the scene
function animate() {
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 1;
  controls.enableZoom = false;
  controls.enableRotate = false;
  controls.panSpeed = 0.1;
  controls.update();
  requestAnimationFrame(animate);
  render();
}

function drawTubes() {
  var tubeMat = new THREE.MeshLambertMaterial({
    color: 0xffffff,
  });
  sets.forEach((set) => {
    let curve = new THREE.CatmullRomCurve3(
      lineMP(locationsPlanes[set[0]], locationsPlanes[set[1]], set[2]),
      false,
      "catmullrom",
      0
    );
    curves.push(curve);
  });

  for (let i = 0; i < sets.length; i++) {
    var tubeGeo = new THREE.TubeBufferGeometry(curves[i], 100, 0.5, 8, false);
    var tube = new THREE.Mesh(tubeGeo, tubeMat);
    tube.renderOrder = 2;
    // tube.rotation.x = Math.PI / 2;
    // var cone = new THREE.Mesh(coneGeo, tubeMat);
    // cone.position.set(
    //   locationsCones[i][0],
    //   locationsCones[i][1],
    //   locationsCones[i][2]
    // );
    // cone.rotation.set(
    //   locationsCones[i][3],
    //   locationsCones[i][4],
    //   locationsCones[i][5]
    // );

    scene.add(tube);
  }
}
function drawPlanes() {
  planeGeo = new THREE.BoxGeometry(55, 75);
  coneGeo = new THREE.ConeGeometry(3, 6);
  planeMaterials = [
    new THREE.MeshLambertMaterial({
      color: 0xffd965,
    }),
    new THREE.MeshLambertMaterial({
      color: 0xbf9000,
    }),
    new THREE.MeshLambertMaterial({
      color: 0xfff2cc,
    }),
    new THREE.MeshLambertMaterial({
      color: 0xff9000,
    }),
    new THREE.MeshLambertMaterial({
      color: 0x789440,
    }),
    new THREE.MeshLambertMaterial({
      color: 0x456880,
    }),
  ];
  for (let i = 0; i < 5; i++) {
    var plane = new THREE.Mesh(planeGeo, planeMaterials[i]);
    plane.renderOrder = 1;
    plane.position.set(
      locationsPlanes[i][0],
      locationsPlanes[i][1],
      locationsPlanes[i][2]
    );
    plane.index = i;
    plane.name = "Plane " + (i + 1);
    scene.add(plane);
  }
}

init();
drawPlanes();
drawTubes();
animate();
