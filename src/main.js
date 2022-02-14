import "../css/style.css"; //import of css styles
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import grid from "../assets/grid.svg";
import { lineDraw } from "./lineDraw.mjs";

// variables
let camera, scene, renderer;
let planeGeo, planeMaterials;
let coneGeo;
let curves = [];
let arrows = [];
let sets = [
  [0, 1, "curved", "down"],
  [1, 2, "linear", "right"],
  [1, 3, "curved", "left"],
  [2, 4, "curved", "down"],
  // [1, 4, "curved"],
  // [0, 3, "curved"],
];
let locationsPlanes = [
  [-170, 60, 0], //0
  [55, 60, 0], //1
  [175, 60, 0], //2
  [-75, -60, 0], //3
  [175, -60, 0], //4
];


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
  camera.position.set(0, 0, 1000);
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
    })
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
function drawTubes() {
  var tubeMat = new THREE.MeshLambertMaterial({
    color: 0xffffff,
  });
  sets.forEach((set) => {
    let x = lineDraw(
      locationsPlanes[set[0]],
      locationsPlanes[set[1]],
      set[2],
      set[3]
    );
    let curve = new THREE.CatmullRomCurve3(x[0], false, "catmullrom", 0);
    arrows.push(x[1]);
    curves.push(curve);
  });
  console.log(arrows)
  for (let i = 0; i < sets.length; i++) {
    var tubeGeo = new THREE.TubeBufferGeometry(curves[i], 100, 0.5, 8, false);
    var tube = new THREE.Mesh(tubeGeo, tubeMat);
    tube.renderOrder = 2;
    var cone = new THREE.Mesh(coneGeo, tubeMat);
    cone.position.set(
      arrows[i][0]['x'],
      arrows[i][0]['y'],
      0
    );
    cone.rotation.set(
      arrows[i][1][0],
      arrows[i][1][1],
      arrows[i][1][2],
    );
    cone.renderOrder = 2;
    scene.add(cone);

    scene.add(tube);
  }
}


init();
drawPlanes();
drawTubes();
animate();
