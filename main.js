import "./style.css";
import * as THREE from "https://cdn.skypack.dev/three";
import { OrbitControls } from "https://cdn.skypack.dev/three/examples/jsm/controls/OrbitControls.js";
import { lineMP } from "./lineMP.mjs";
let camera, scene, renderer;
let plane;

let pointer, raycaster;

let rollOverMesh1, rollOverMaterial1;
let redMat, redMatmaterial;
let cubeGeo, cubeMaterial;
const objects = [];
// a dictionary of all the marked points
const marked = [];

init();

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

  const rollOverGeo1 = new THREE.PlaneGeometry(50, 50);
  rollOverGeo1.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2));
  rollOverGeo1.applyMatrix(new THREE.Matrix4().makeTranslation(0, -25, 0));
  rollOverMaterial1 = new THREE.MeshBasicMaterial({
    color: 0x1ed760,
  });
  rollOverMesh1 = new THREE.Mesh(rollOverGeo1, rollOverMaterial1);
  scene.add(rollOverMesh1);

  // mats
  redMat = new THREE.PlaneGeometry(50, 50);
  redMat.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2));
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

  // grid

  const gridHelper = new THREE.GridHelper(2000, 40, "red", 0x555555);
  // scene.add(gridHelper);
  // draw line from origin to edge of grid
  const points1 = [];
  points1.push(new THREE.Vector3(25, 0, 25));
  points1.push(new THREE.Vector3(1050, 0, 25));
  const lineGeo = new THREE.BufferGeometry().setFromPoints(points1);
  const lineMat = new THREE.LineBasicMaterial({ color: 0x0000ff });
  const line = new THREE.Line(lineGeo, lineMat);
  const points2 = [];
  points2.push(new THREE.Vector3(25, 0, 25));
  points2.push(new THREE.Vector3(25, 0, -1000));
  const lineGeo2 = new THREE.BufferGeometry().setFromPoints(points2);
  const lineMat2 = new THREE.LineBasicMaterial({ color: 0xff0000 });
  const line2 = new THREE.Line(lineGeo2, lineMat2);

  scene.add(line);
  scene.add(line2);

  let cubeGeo2 = new THREE.BoxGeometry(50, 12.5, 50);
  cubeGeo2.applyMatrix(new THREE.Matrix4().makeTranslation(0, -12.5, 0));
  let lightMaterial = new THREE.MeshLambertMaterial({
    color: 0xf68968,
  });
  let darkMaterial = new THREE.MeshLambertMaterial({
    color: 0x8e88b3,
  });
  let board = new THREE.Group();

  for (let i = -20; i <= 20; i++) {
    for (let j = -20; j <= 20; j++) {
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
      // if ((i == j || i == -j) && i != 0) {
      //   var cube = new THREE.Mesh(cubeGeo, redMatmaterial);
      // }
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
  document.addEventListener("keydown", onXDown);
  document.addEventListener("keydown", onDocumentKeyDown);
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
    rollOverMesh1.position.copy(intersect.point).add(intersect.face.normal);
    rollOverMesh1.position
      .divideScalar(50)
      .floor()
      .multiplyScalar(50)
      .addScalar(25);
    // console.log(
    //   (rollOverMesh1.position.x - 25) / 50,
    //   Math.abs((rollOverMesh1.position.z - 25) / 50)
    // );
  }
  render();
}

function onXDown(event) {
  // if event is x
  if (event.key == "x") {
    raycaster.setFromCamera(pointer, camera);
    const intersects = raycaster.intersectObjects(objects, false);
    if (intersects.length > 0) {
      const intersect = intersects[0];
      // stop stacking
      if (intersect.object === plane) {
        // const cube = new THREE.Mesh(cubeGeo, cubeMaterial);
        // cube.position.copy(intersect.point).add(intersect.face.normal);
        // cube.position.divideScalar(50).floor().multiplyScalar(50).addScalar(25);
        // cube.updateMatrix();
        // plane.geometry.merge(cube.geometry, cube.matrix);
        // objects.push(cube);
        // scene.add(cube);
        const mat = new THREE.Mesh(redMat, redMatmaterial);
        mat.position.copy(intersect.point).add(intersect.face.normal);
        mat.position.divideScalar(50).floor().multiplyScalar(50).addScalar(25);
        mat.updateMatrix();
        plane.geometry.merge(mat.geometry, mat.matrix);
        let x = (mat.position.x - 25) / 50;
        let y = -1 * ((mat.position.z - 25) / 50);
        marked.push({ x: x, y: y });
        console.log(
          "Marked: " +
            marked[marked.length - 1].x +
            "," +
            marked[marked.length - 1].y
        );
        objects.push(mat);
        scene.add(mat);
      }

      if (marked.length >= 2) {
        // let result = lineMP(
        //   marked[marked.length - 2],
        //   marked[marked.length - 1]
        // );
        marked.pop();
        marked.pop();
        console.log(result);
        for (let i = 0; i < result.length; i++) {
          const cube = new THREE.Mesh(cubeGeo, cubeMaterial);
          cube.position.set(
            result[i].x * 50 + 25,
            25,
            -1 * (result[i].y * 50 - 25)
          );
          objects.push(cube);
          scene.add(cube);
        }
      }
      render();
    }
  }
}

function onDocumentKeyDown(event) {
  switch (event.keyCode) {
    // backspace
    case 8:
      if (objects.length > 1) {
        scene.remove(objects[objects.length - 1]);
        objects.pop();
        render();
      } else {
        console.log("No Mats to remove");
      }
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
