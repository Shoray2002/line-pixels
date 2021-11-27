import "./style.css";
import * as THREE from "https://cdn.skypack.dev/three";
import { OrbitControls } from "https://cdn.skypack.dev/three/examples/jsm/controls/OrbitControls.js";
let camera, scene, renderer;
let plane;

let pointer,
  raycaster,
  isShiftDown = false;

let rollOverMesh, rollOverMaterial;
let cubeGeo, cubeMaterial;

const objects = [];

init();
// render();

function init() {
  camera = new THREE.PerspectiveCamera(
    15,
    window.innerWidth / window.innerHeight,
    1,
    100000
  );
  camera.position.set(500, 900, 1300);
  camera.lookAt(0, 0, 0);

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x8e88b3);

  // roll-over helpers

  const rollOverGeo = new THREE.PlaneGeometry(50, 50);
  rollOverGeo.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2));
  rollOverGeo.applyMatrix(new THREE.Matrix4().makeTranslation(0, -25, 0));
  rollOverMaterial = new THREE.MeshBasicMaterial({
    color: 0xff0000,
  });
  rollOverMesh = new THREE.Mesh(rollOverGeo, rollOverMaterial);
  scene.add(rollOverMesh);

  // cubes

  cubeGeo = new THREE.BoxGeometry(50, 12.5, 50);
  cubeGeo.applyMatrix(new THREE.Matrix4().makeTranslation(0, -20, 0));
  cubeMaterial = new THREE.MeshLambertMaterial({
    color: 0xe6ff3e,
    opacity: 0.8,
    transparent: true,
  });

  // grid

  const gridHelper = new THREE.GridHelper(2000, 40, "red", 0x555555);
  console.log(gridHelper);
  scene.add(gridHelper);

  let cubeGeo2 = new THREE.BoxGeometry(50, 12.5, 50);
  cubeGeo2.applyMatrix(new THREE.Matrix4().makeTranslation(0, -12.5, 0));
  let lightMaterial = new THREE.MeshLambertMaterial({
    color: 0xf68968,
  });
  let darkMaterial = new THREE.MeshLambertMaterial({
    color: 0x8e88b3,
  });
  let board = new THREE.Group();
  for (let i = -20; i < 20; i++) {
    for (let j = -20; j < 20; j++) {
      if (j % 2 == 0) {
        var cube;
        cube = new THREE.Mesh(
          cubeGeo,
          i % 2 == 0 ? lightMaterial : darkMaterial
        );
      } else {
        cube = new THREE.Mesh(
          cubeGeo,
          i % 2 == 0 ? darkMaterial : lightMaterial
        );
      }
      cube.position.set(i * 50, 0, j * 50);
      board.add(cube);
    }
  }
  board.position.set(25, 12.5, 25);
  // make the board translucent
  board.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.material.transparent = true;
      child.material.opacity = 0.99;
    }
  });
  scene.add(board);

  raycaster = new THREE.Raycaster();
  pointer = new THREE.Vector2();

  const geometry = new THREE.PlaneGeometry(2000, 2000);
  geometry.rotateX(-Math.PI / 2);

  plane = new THREE.Mesh(
    geometry,
    new THREE.MeshBasicMaterial({ visible: false })
  );
  scene.add(plane);

  objects.push(plane);

  // lights

  const ambientLight = new THREE.AmbientLight(0x606060);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff);
  directionalLight.position.set(1, 0.75, 0.5).normalize();
  scene.add(directionalLight);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  document.addEventListener("pointermove", onPointerMove);
  document.addEventListener("pointerdown", onPointerDown);
  document.addEventListener("keydown", onDocumentKeyDown);
  document.addEventListener("keyup", onDocumentKeyUp);

  window.addEventListener("resize", onWindowResize);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);

  render();
}

function onPointerMove(event) {
  pointer.set(
    (event.clientX / window.innerWidth) * 2 - 1,
    -(event.clientY / window.innerHeight) * 2 + 1
  );

  raycaster.setFromCamera(pointer, camera);

  const intersects = raycaster.intersectObjects(objects, false);

  if (intersects.length > 0) {
    const intersect = intersects[0];
    rollOverMesh.position.copy(intersect.point).add(intersect.face.normal);
    rollOverMesh.position
      .divideScalar(50)
      .floor()
      .multiplyScalar(50)
      .addScalar(25);
  }

  render();
}

function onPointerDown(event) {
  pointer.set(
    (event.clientX / window.innerWidth) * 2 - 1,
    -(event.clientY / window.innerHeight) * 2 + 1
  );

  raycaster.setFromCamera(pointer, camera);

  const intersects = raycaster.intersectObjects(objects, false);

  if (intersects.length > 0) {
    const intersect = intersects[0];

    // delete cube
    if (isShiftDown) {
      if (intersect.object !== plane) {
        scene.remove(intersect.object);
        objects.splice(objects.indexOf(intersect.object), 1);
      }

      // create cube
    } else {
      // stop stacking
      if (intersect.object === plane) {
        const cube = new THREE.Mesh(cubeGeo, cubeMaterial);
        cube.position.copy(intersect.point).add(intersect.face.normal);
        cube.position.divideScalar(50).floor().multiplyScalar(50).addScalar(25);
        cube.updateMatrix();
        plane.geometry.merge(cube.geometry, cube.matrix);
        objects.push(cube);
        scene.add(cube);
      }
      // const voxel = new THREE.Mesh(cubeGeo, cubeMaterial);
      // voxel.position.copy(intersect.point).add(intersect.face.normal);
      // voxel.position.divideScalar(50).floor().multiplyScalar(50).addScalar(25);
      // scene.add(voxel);
      // objects.push(voxel);
    }
    render();
  }
}

function onDocumentKeyDown(event) {
  switch (event.keyCode) {
    case 16:
      isShiftDown = true;
      break;
  }
}

function onDocumentKeyUp(event) {
  switch (event.keyCode) {
    case 16:
      isShiftDown = false;
      break;
  }
}

function render() {
  renderer.render(scene, camera);
}

window.addEventListener("wheel", (event) => {
  if (event.deltaY < 0) {
    camera.fov -= 2;
  } else {
    camera.fov += 2;
  }
  camera.updateProjectionMatrix();
  render();
});

function animate() {
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 1;
  controls.enableZoom = false;
  controls.enableRotate = false;
  controls.panSpeed = 0.1;
  // controls.enablePan = false;
  controls.update();
  requestAnimationFrame(animate);
  render();
}

animate();
