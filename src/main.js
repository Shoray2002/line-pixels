import "../css/style.css"; //import of css styles
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Text } from "troika-three-text";
import grid from "../assets/grid.svg";
import binMaker from "./binMaker.mjs";
// import of mjs module

// variables
let camera, scene, renderer;
let sphereGeo, planeMaterials;
let coneGeo;
let coneLocs = [
  [253, -100, 0],
  [-240, 123, 0],
];
let name;

let curves = [
  new THREE.CatmullRomCurve3(
    [new THREE.Vector3(-240, -100, 0), new THREE.Vector3(250, -100, 0)],
    false
  ),

  new THREE.CatmullRomCurve3(
    [new THREE.Vector3(-240, -100, 0), new THREE.Vector3(-240, 120, 0)],
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
  camera.position.set(0, 0, 1100);
  camera.lookAt(0, 0, 0);
  scene = new THREE.Scene();
  scene.background = texture;
  coneGeo = new THREE.ConeGeometry(3, 6);
  planeMaterials = [
    new THREE.MeshLambertMaterial({
      color: 0xe3ff25,
    }),
    new THREE.MeshLambertMaterial({
      color: 0x00fff3,
    }),
  ];
  var tubeMat = [
    new THREE.MeshLambertMaterial({
      color: 0xff0000,
      transparent: true,
      opacity: 0.8,
    }),
    new THREE.MeshLambertMaterial({
      color: 0x00ff00,
      transparent: true,
      opacity: 0.8,
    }),
  ];
  sphereGeo = new THREE.SphereGeometry(2, 32, 32);
  let step = -235;
  let material;
  for (let i = 0; i < 50; i++) {
    var data = binMaker(i);
    material = planeMaterials[0];
    let size=2;
    if (data["Country"] == "United States") {
      material = planeMaterials[1];
      size=3;
    }
    var height = data["NetWorth"];
    sphereGeo = new THREE.SphereGeometry(size, 32, 32);
    var point = new THREE.Mesh(sphereGeo, material);
    point.renderOrder = 1;
    point.position.set(step, -100, 0);
    point.translateY(height / 2);
    point.name = data["Name"];
    name = new Text();
    name.text = data["Name"];
    name.fontSize = 5;
    name.fontWeight = "bold";
    name.position.set(step - 2, 90, 0);
    name.rotation.z = Math.PI / 3;
    scene.add(name);
    scene.add(point);
    step += 9.6;
  }

  for (let i = 0; i < 2; i++) {
    var tubeGeo = new THREE.TubeBufferGeometry(curves[i], 100, 1, 8, false);
    var tube = new THREE.Mesh(tubeGeo, tubeMat[i]);
    tube.renderOrder = 2;
    var cone = new THREE.Mesh(coneGeo, tubeMat[i]);
    cone.renderOrder = 2;
    cone.position.set(coneLocs[i][0], coneLocs[i][1], coneLocs[i][2]);
    if (i == 0) {
      cone.rotation.set(0, 0, -Math.PI / 2);
    }
    scene.add(tube, cone);
  }

  const xtext = new Text();
  xtext.text = "Billionaires";
  xtext.fontSize = 15;
  xtext.pos = "top";
  xtext.position.set(-30, -110, 0);
  const ytext = new Text();
  ytext.text = "Net Worth";
  ytext.fontSize = 15;
  ytext.pos = "left";
  ytext.position.set(-265, -50, 0);
  ytext.rotation.set(0, 0, Math.PI / 2);
  scene.add(xtext, ytext);
  const explainText = new Text();
  explainText.text =
    "If the billionaire is from United States then the dot is blue and bigger";
  explainText.fontSize = 10;
  explainText.position.set(-140, -140, 0);
  explainText.color = 0x00fff3;
  scene.add(xtext, ytext, explainText);
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
