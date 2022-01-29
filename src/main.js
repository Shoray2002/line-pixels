import "../css/style.css"; //import of css styles
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import grid from "../assets/grid.svg";
// import of mjs module

// variables
let camera, scene, renderer;
let planeGeo, planeMaterials;
let cone;
let locations = [
  [-170, 60, 0],
  [55, 60, 0],
  [175, 60, 0],
  [-75, -60, 0],
  [175, -60, 0],
];
let curves = [
  new THREE.CatmullRomCurve3(
    [
      new THREE.Vector3(-170 + 27.5, 0, -60),
      new THREE.Vector3(-75, 0, -60),
      new THREE.Vector3(-75, 0, -120),
      new THREE.Vector3(55, 0, -120),
      new THREE.Vector3(55, 0, -60 - 37.5),
    ],
    false,
    "catmullrom",
    0
  ),
  new THREE.CatmullRomCurve3(
    [
      new THREE.Vector3(55 + 27.5, 0, -60),
      new THREE.Vector3(175 - 27.5, 0, -60),
    ],
    false
  ),

  new THREE.CatmullRomCurve3(
    [
      new THREE.Vector3(55, 0, -60 + 37.5),
      new THREE.Vector3(55, 0, 60),
      new THREE.Vector3(-75 + 27.5, 0, 60),
    ],
    false,
    "catmullrom",
    0
  ),
  new THREE.CatmullRomCurve3(
    [
      new THREE.Vector3(200 - 27.5, 0, 60 - 37.5),
      new THREE.Vector3(200 - 27.5, 0, -(60 - 37.5)),
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
  cone = new THREE.ConeGeometry(10, 20, 32);
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
    plane.position.set(locations[i][0], locations[i][1], locations[i][2]);
    plane.index = i;
    plane.name = "Plane " + (i + 1);
    scene.add(plane);
  }

  for (let i = 0; i < 4; i++) {
    var tubeGeo = new THREE.TubeBufferGeometry(curves[i], 100, 0.5, 8, false);
    var tube = new THREE.Mesh(tubeGeo, tubeMat);
    tube.renderOrder = 2;
    tube.rotation.x = Math.PI / 2;

    scene.add(tube);
  }
  // mats

  // drawing the axes
  // const points1 = [];
  // points1.push(new THREE.Vector3(25, 0, 25));
  // points1.push(new THREE.Vector3(1050, 0, 25));
  // const lineGeo = new THREE.BufferGeometry().setFromPoints(points1);
  // const lineMat = new THREE.LineBasicMaterial({ color: 0x0000ff });
  // const line = new THREE.Line(lineGeo, lineMat);
  // const points2 = [];
  // points2.push(new THREE.Vector3(25, 0, 25));
  // points2.push(new THREE.Vector3(25, 0, -1000));
  // const lineGeo2 = new THREE.BufferGeometry().setFromPoints(points2);
  // const lineMat2 = new THREE.LineBasicMaterial({ color: 0xff0000 });
  // const line2 = new THREE.Line(lineGeo2, lineMat2);
  // scene.add(line);
  // scene.add(line2);

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
