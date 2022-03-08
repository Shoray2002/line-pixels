import "../css/style.css"; //import of css styles
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Text } from "troika-three-text";
import grid from "../assets/grid.svg";
import dirStructure from "../assets/dirStructure.json";

// variables
let camera, scene, renderer;
let sphereGeo, rootGeo, materials;
let sphere, label;
let level = 1;
let angle = 0;
let objects = [];
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
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
  camera.lookAt(0, 1500, 0);
  scene = new THREE.Scene();
  scene.background = texture;
  materials = [
    new THREE.LineBasicMaterial({
      color: 0xff0000,
    }),
    new THREE.LineBasicMaterial({
      color: 0x00ff00,
    }),
    new THREE.LineBasicMaterial({
      color: 0xffe628,
    }),
    new THREE.LineBasicMaterial({
      color: 0xcc25ff,
    }),
  ];

  sphereGeo = new THREE.SphereGeometry(6, 32, 32);
  rootGeo = new THREE.SphereGeometry(10, 32, 32);
  sphere = new THREE.Mesh(rootGeo, materials[2]);
  sphere.position.set(0, 0, 0);
  sphere.name = "root";
  scene.add(sphere);
  objects.push(sphere);
  label = new Text();
  label.text = "root";
  label.fontSize = 15;
  label.color = 0x00fff3;
  label.position.set(-15, 32, 0);
  scene.add(label);

  drawer(dirStructure["root"], sphere.position, level);

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
  window.addEventListener("click", (event) => onMouseDown(event));
  // hover
  window.addEventListener("mousemove", (event) => {
    onMouseMove(event);
  });
}

function drawer(x, loc, level) {
  const pointGroup = new THREE.Group();
  const color = Math.floor(Math.random() * 0xffffff);
  const vector = new THREE.Vector3();
  for (let i = 0, l = x["children"]; i < l; i++) {
    if (x[i]["type"] === "file") {
      sphere = new THREE.Mesh(sphereGeo, materials[1]);
    } else {
      sphere = new THREE.Mesh(sphereGeo, materials[0]);
    }
    sphere.name = x[i]["name"];
    label = new Text();
    label.text = x[i]["name"];
    label.fontSize = 6;
    label.color = 0xffffff;
    label.maxWidth = 30;
    label.textAlign = "center";
    const points = [];
    points.push(loc);
    vector.copy(loc).multiplyScalar(1.1);
    if (x["name"] === "root") {
      const phi = Math.acos(-1 + (2 * i) / l);
      const theta = Math.sqrt(l * Math.PI) * phi;
      sphere.position.setFromSphericalCoords(200, phi, theta);
      label.position.setFromSphericalCoords(220, phi, theta);
      vector.copy(sphere.position).multiplyScalar(2);
      label.lookAt(vector);
      pointGroup.add(sphere);
      pointGroup.add(label);
      points.push(
        new THREE.Vector3(
          sphere.position.x,
          sphere.position.y,
          sphere.position.z
        )
      );
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(
        geometry,
        new THREE.LineBasicMaterial({ color: 0xb9054e })
      );
      pointGroup.add(line);
      objects.push(sphere);
    } else {
      angle = (i / x["children"]) * Math.PI * 2;
      const cone = new THREE.Group();
      const angleLoc = Math.atan2(loc.y, loc.x);
      sphere.position.set(
        loc.x + Math.cos(angle + 10 * angleLoc) * (level * 50),
        loc.y + Math.sin(angle + 10 * angleLoc) * (level * 50),
        loc.z + level * 50
      );
      label.position.set(
        loc.x + Math.cos(angle + 10 * angleLoc) * (level * 45),
        loc.y + Math.sin(angle + 10 * angleLoc) * (level * 45),
        loc.z + level * 45
      );
      vector.copy(sphere.position).multiplyScalar(1);
      label.lookAt(vector);
      points.push(
        new THREE.Vector3(
          sphere.position.x,
          sphere.position.y,
          sphere.position.z
        )
      );
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(
        geometry,
        new THREE.LineBasicMaterial({ color: color })
      );
      cone.add(sphere, line, label);
      objects.push(sphere);
      pointGroup.add(cone);
    }
    drawer(x[i], sphere.position, level + 0.5);
  }
  scene.add(pointGroup);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  render();
}

function onMouseDown(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(objects);
  if (intersects.length > 0) {
    console.log(intersects[0].object.name);
    intersects[0].object.scale.set(1.2, 1.2, 1.2);
    intersects[0].object.material = materials[3];
  }
}
function onMouseMove(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(objects);
  if (intersects.length > 0) {
    document.body.style.cursor = "pointer";
  } else {
    document.body.style.cursor = "default";
  }
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
