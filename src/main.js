import "../css/style.css"; //import of css styles
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import grid from "../grid.svg";
import { lineMP } from "../lineMP.mjs";
// import of mjs module

// variables
let camera, scene, renderer;
let plane;
let rollOverMesh, rollOverMaterial;
let redMat, redMatmaterial;
let cubeGeo, cubeMaterial;
const objects = []; // objects in the scene
const marked = []; // marked points by the user

init();

function init() {
  // set up scene and camera
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
  // set camera position to the front
  camera.position.set(0, 0, 1000);
  camera.lookAt(0, 0, 0);
  scene = new THREE.Scene();
  scene.background = texture;

  // roll-over helpers
  const rollOverGeo = new THREE.PlaneGeometry(55, 75);
  rollOverGeo.applyMatrix(new THREE.Matrix4().makeTranslation(0, -25, 0));
  rollOverMaterial = new THREE.MeshBasicMaterial({
    color: 0x1ed760,
    side: THREE.DoubleSide,
  });
  rollOverMesh = new THREE.Mesh(rollOverGeo, rollOverMaterial);
  scene.add(rollOverMesh);

  // mats
  redMat = new THREE.PlaneGeometry(50, 50);
  // redMat.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2));
  redMat.applyMatrix(new THREE.Matrix4().makeTranslation(0, -24, 0));
  redMatmaterial = new THREE.MeshBasicMaterial({
    color: 0xff0000,
    opacity: 0.9,
    transparent: true,
  });

  // cubes
  cubeGeo = new THREE.BoxGeometry(50, 12.5, 50);
  cubeGeo.applyMatrix(new THREE.Matrix4().makeTranslation(0, -20, 0));
  cubeMaterial = new THREE.MeshLambertMaterial({
    color: 0xe6ff3e,
    opacity: 0.8,
    transparent: true,
  });

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
  const ambientLight = new THREE.AmbientLight(0x606060);
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
  // document.addEventListener("pointermove", onPointerMove);
  // document.addEventListener("keydown", onXDown);
  // document.addEventListener("keydown", onDocumentKeyDown);
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
