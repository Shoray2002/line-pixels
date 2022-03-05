type Position = {
    x: number;
    y: number;
    z: number;
    };
    
    const PHI = Math.PI * (3 - Math.sqrt(5));
    
    const domElement = document.getElementById(localId);
    
        if (domElement) {
          // INIT
          const width = domElement.offsetWidth;
          const height = domElement.offsetHeight;
    
          const scene = new Scene();
          scene.add(new AxesHelper());
    
          const camera = new PerspectiveCamera(75, width / height, 0.01, 1000);
          camera.position.z = 2;
          camera.position.y = 0.5;
          camera.position.x = 0.5;
    
          scene.add(camera);
    
          // START
    
          const pointsx: Points[] = [];
    
          const pointMaterialGreen = new PointsMaterial({
            size: 0.1,
            color: 0xff000,
            alphaTest: 0.01,
            transparent: true,
          });
          const pointMaterialWhite = new PointsMaterial({
            size: 0.1,
            color: 0xffffff,
            alphaTest: 0.01,
            transparent: true,
          });
          const pointMaterialX = new PointsMaterial({
            size: 0.1,
            color: 0xff00ff,
            alphaTest: 0.01,
            transparent: true,
          });
    
          const createLabel = (name: string, position: Position): CSS2DObject => {
            const labelDiv = document.createElement('div');
            labelDiv.className = 'label';
            labelDiv.textContent = name;
    
            const label = new CSS2DObject(labelDiv);
            label.position.set(position.x, position.y, position.z);
    
            return label;
          };
    
          const getPositionsAroundSphere = (nbPoints: number, count: number): Position => {
            const y = 1 - (count / (nbPoints - 1)) * 2;
            const radius = Math.sqrt(1 - y * y);
    
            const theta = PHI * count;
            const x = Math.cos(theta) * radius;
            const z = Math.sin(theta) * radius;
    
            return { x, y, z };
          };
    
          const createPoint = (
            element: IFolder | IFile,
            position: Position,
            material = pointMaterialGreen,
          ): Points => {
            const geometry = new BufferGeometry();
            geometry.setAttribute(
              'position',
              new Float32BufferAttribute(new Vector3(position.x, position.y, position.z).toArray(), 3),
            );
            const point = new Points(geometry, material);
    
            // console.log(point);
    
            point.add(createLabel(element.name, position));
            pointsx.push(point);
            return point;
          };
    
          const createPointFolder = (folder: IFolder, position: Position) => {
            const point = createPoint(folder, position);
    
            if (!folder.folderId) {
              for (const i in folder.childFolder) {
                const elem = folder.childFolder[i];
    
                createPointFolder(elem, getPositionsAroundSphere(folder.childFolder.length, Number(i)));
              }
            } else {
              if (folder.name !== 'folder1_3') return;
    
              if (!folder.childFolder.length) return;
    
              // const coneGeometry = new CircleGeometry(1, folder.childFolder.length);
              const testGeometry = new BufferGeometry();
              testGeometry.setAttribute(
                'position',
                new Float32BufferAttribute(
                  new Vector3(position.x * 2, position.y * 2, position.z * 2).toArray(),
                  3,
                ),
              );
              const p = new Points(testGeometry, pointMaterialWhite);
              p.position.set(position.x, position.y, position.z);
    
              console.log(p);
              point.add(p);
              // for (let i = 0; i < folder.childFolder.length; i++) {
              //   const local = i * 3;
              //   console.log(local);
              //   const elem = folder.childFolder[i];
    
              //   console.log({
              //     x: p.geometry.attributes.position.array[local],
              //     y: p.geometry.attributes.position.array[local + 1],
              //     z: p.geometry.attributes.position.array[local + 2],
              //   });
              //   createPoint(
              //     elem,
              //     {
              //       x: p.geometry.attributes.position.array[local],
              //       y: p.geometry.attributes.position.array[local + 1],
              //       z: p.geometry.attributes.position.array[local + 2],
              //     },
              //     pointMaterialX,
              //   );
              // }
            }
          };
    
          createPointFolder(repository, { x: 0, y: 0, z: 0 });
    
          const group = new Group();
    
          group.add(...pointsx);
          scene.add(group);
    
          const renderer = new WebGLRenderer({ antialias: true, alpha: true });
    
          renderer.setClearColor(0x000000, 0);
          renderer.setSize(width, height);
          renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
          const labelRenderer = new CSS2DRenderer();
          labelRenderer.setSize(width, height);
          labelRenderer.domElement.style.position = 'absolute';
          labelRenderer.domElement.style.top = '0px';
          labelRenderer.domElement.style.pointerEvents = 'none';
    
          if (domElement.firstChild) {
            domElement.removeChild(domElement.firstChild);
            domElement.removeChild(domElement.firstChild);
          }
          domElement.appendChild(renderer.domElement);
          domElement.appendChild(labelRenderer.domElement);
    
          const controls = new OrbitControls(camera, renderer.domElement);
          const clock = new Clock();
    
          const tick = () => {
            const time = clock.getElapsedTime();
    
            renderer.render(scene, camera);
            labelRenderer.render(scene, camera);
            controls.update();
            requestAnimationFrame(tick);
            // group.rotation.y = time * 0.1;
          };
          tick();
    
          window.addEventListener('resize', () => {
            camera.aspect = height / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
          });
    