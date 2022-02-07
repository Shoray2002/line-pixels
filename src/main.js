import "../css/style.css"; //import of css styles
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import grid from "../assets/grid.svg";
import { lineMP } from "./lineMP.mjs";
// import { lineMP } from "./lineMP.mjs";

// variables
let camera, scene, renderer;
let planeGeo, planeMaterials;
let coneGeo;
let curves = [];
let sets = [
  [0, 1, "linear"],
  [1, 2, "linear"],
  [1, 3, "linear"],
  [2, 4, "linear"],
];
let locationsPlanes = [
  [-170, 60, 0], //1
  [55, 60, 0], //2
  [175, 60, 0], //3
  [-75, -60, 0], //4
  [175, -60, 0], //5
];
// let locationsCones = [
//   [55, 60 + 40.5, 0, -Math.PI, 0, 0],
//   [175 - 30.5, 60, 0, Math.PI / 2, 0, -Math.PI / 2],
//   [-75 + 30.5, -60, 0, Math.PI / 2, 0, Math.PI / 2],
//   [172.5, -60 + 40.5, 0, -Math.PI, 0, 0],
// ];
let old = [
  // 0->1
  new THREE.CatmullRomCurve3(
    [
      new THREE.Vector3(-170 + 27.5, 60, 0),
      new THREE.Vector3(-75, 60, 0),
      new THREE.Vector3(-75, 120, 0),
      new THREE.Vector3(55, 120, 0),
      new THREE.Vector3(55, 60 + 37.5, 0),
    ],
    false,
    "catmullrom",
    0
  ),
  // 1->2
  new THREE.CatmullRomCurve3(
    [new THREE.Vector3(55 + 27.5, 60, 0), new THREE.Vector3(175 - 27.5, 60, 0)],
    false
  ),
  // 1->3
  new THREE.CatmullRomCurve3(
    [
      new THREE.Vector3(55, 60 - 37.5, 0),
      new THREE.Vector3(55, -60, 0),
      new THREE.Vector3(-75 + 27.5, -60, 0),
    ],
    false,
    "catmullrom",
    0
  ),
  // 2->4
  new THREE.CatmullRomCurve3(
    [
      new THREE.Vector3(200 - 27.5, -60 + 37.5, 0),
      new THREE.Vector3(200 - 27.5, 60 - 37.5, 0),
    ],
    false
  ),
];
init();

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
  ];
  var tubeMat = new THREE.MeshLambertMaterial({
    color: 0xffffff,
  });
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

  sets.forEach((set) => {
    let curve = new THREE.CatmullRomCurve3(
      lineMP(locationsPlanes[set[0]], locationsPlanes[set[1]], set[2]),
      false,
      "catmullrom",
      0
    );
    curves.push(curve);
  });
  console.log(curves);

  for (let i = 0; i < 4; i++) {
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

animate();
