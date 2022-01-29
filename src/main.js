import "../css/style.css"; //import of css styles
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import grid from "../assets/grid.svg";
// import of mjs module

// variables
let camera, scene, renderer;
let planeGeo, planeMaterials;
let locations = [
  [-15,6, 0],
  [8, 6, 0],
  [20, 6, 0],
  [-5, -6, 0],
  [20, -6, 0],
];
init();

function init() {
  const texture = new THREE.TextureLoader().load(grid);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(3, 3);

  camera = new THREE.PerspectiveCamera(
    15,
    window.innerWidth / window.innerHeight,
    1,
    100000
  );
  camera.position.set(0, 0, 1000);
  camera.lookAt(0, 0, 0);
  scene = new THREE.Scene();
  scene.background = texture;

  planeGeo = new THREE.BoxGeometry(55, 75);
  // planeGeo.applyMatrix(new THREE.Matrix4().makeTranslation(0, -25, 0));
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

  for (let i = 0; i < 5; i++) {
    var plane = new THREE.Mesh(planeGeo, planeMaterials[i]);
    plane.renderOrder = 1
    plane.position.set(
      locations[i][0] * 10,
      locations[i][1] * 10,
      locations[i][2] * 10
    );
    scene.add(plane);
  }

  // plane = new THREE.Mesh(planeGeo, planeMaterials["light_yellow"]);
  // scene.add(plane);

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
  // const directionalLight = new THREE.DirectionalLight(0xffffff);
  // directionalLight.position.set(1, 0.75, 0.5).normalize();
  // scene.add(directionalLight);

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

// event handlers

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
