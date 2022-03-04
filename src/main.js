import "../css/style.css"; //import of css styles
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Text } from "troika-three-text";
import grid from "../assets/grid.svg";
import dirStructure from "../assets/dirStructure.json";

// variables
let camera, scene, renderer;
let sphereGeo, materials;
let sphere, label;
let level = 0.5;
const lineMat = new THREE.LineBasicMaterial({
  color: 0x0000ff,
});
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
    10000
  );
  camera.position.set(0, 0, 1000);
  camera.lookAt(0, 0, 0);
  scene = new THREE.Scene();
  scene.background = texture;
  materials = [
    new THREE.MeshLambertMaterial({
      color: 0xe3ff25,
    }),
    new THREE.MeshLambertMaterial({
      color: 0x00fff3,
    }),
  ];

  sphereGeo = new THREE.SphereGeometry(5, 32, 32);
  sphere = new THREE.Mesh(sphereGeo, materials[0]);
  sphere.position.set(0, -50, 0);
  scene.add(sphere);
  label = new Text();
  label.text = "root";
  label.fontSize = 10;
  label.color = 0xff0000;
  label.position.set(0, -70, 0);
  scene.add(label);

  logger(dirStructure["root"], sphere.position, level);

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

function logger(x, loc, level) {
  {
    // if (x["children"] === 0 && x["name"] !== "root") {
    //   // console.log(x["name"]);
    //   label = new Text();
    //   label.text = x["name"];
    //   label.fontSize = 10;
    //   label.color = 0xff0000;
    //   label.position.set(
    //     Math.random() * 300 - 150,
    //     Math.random() * 300 - 150,
    //     Math.random() * 300 - 150
    //   );
    //   // console.log("output"+x["name"]);
    //   // scene.add(label);
    // } else {
  }
  let seed = Math.random();
  const pointGroup = new THREE.Group();
  const color = Math.floor(seed * 0xffffff);
  for (let i = 0; i < x["children"]; i++) {
    let angle = (i / x["children"]) * Math.PI;
    if (x["children"] > 6) {
      angle = (i / x["children"]) * Math.PI * 2;
    }
    label = new Text();
    label.text = x[i]["name"];
    label.fontSize = 10;
    label.color = color * level;
    label.maxWidth = 100;
    label.textAlign = "center";
    label.position.set(
      Math.cos(angle) * (level * 200) - 20,
      level * 80,
      Math.sin(angle) * (level * 200)
    );
    // pointGroup.add(label);
    let mat = new THREE.LineBasicMaterial({
      color: color,
    });
    sphere = new THREE.Mesh(sphereGeo, mat);
    sphere.position.set(
      Math.cos(angle) * (level * 200),
      level * 100,
      Math.sin(angle) * (level * 200)
    );
    pointGroup.add(sphere);
    const points = [];
    points.push(loc);
    points.push(
      new THREE.Vector3(
        sphere.position.x,
        sphere.position.y - 5,
        sphere.position.z
      )
    );
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.Line(geometry, mat);
    // scene.add(line);
    pointGroup.add(line);
    scene.add(pointGroup);
    logger(x[i], sphere.position, level * (i + 1));
  }
}
// }

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
