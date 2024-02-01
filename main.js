import * as THREE from 'three';

let scene, camera, renderer;
let isCube = true;
let isScrolling = false; 
let lastScrollTop = 0;
const cubeSize = 1;
const spacing = 1.2;
let cubeMeshes = [];
let animationDuration = 2000; // in milliseconds
let transitionStart = performance.now();
let raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2();

init();
animate();

function init() {
    // Set up the scene
    scene = new THREE.Scene();

    // Camera setup
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 10;

    // Renderer setup
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Define base positions for each letter
    let baseR = new THREE.Vector3(-6, -2, 0);
    let baseA = new THREE.Vector3(-2, -2, 0);
    let baseI = new THREE.Vector3(2, -2, 0);
    let baseN = new THREE.Vector3(6, -2, 0);
    let material = new THREE.MeshBasicMaterial( {

        color: 0xe0e0ff,
        wireframe: true

    } );
    let geometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);

    // Create letters with their respective base positions
    createLetterR(baseR,geometry,material);
    createLetterA(baseA,geometry,material);
    createLetterI(baseI,geometry,material);
    createLetterN(baseN,geometry,material);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    scene.add(directionalLight);

    //EventListener
    window.addEventListener('click', toggleShapes, false);
    window.addEventListener('mousemove', onMouseMove, false);
    window.addEventListener('scroll', onScroll, false);
}

function createLetterR(basePosition,geometry,material) {


    // Vertical part of R
    for (let i = 0; i < 5; i++) {
        let cube = new THREE.Mesh(geometry, material);
        cube.position.set(basePosition.x - spacing*2, basePosition.y + i * spacing, basePosition.z + 0);
        cube.originalPosition = new THREE.Vector3(cube.position.x, cube.position.y, cube.position.z);
        scene.add(cube);
        cubeMeshes.push(cube);
    }

    // Top part of R
    for (let i = 1; i < 3; i++) {
        let cube = new THREE.Mesh(geometry, material);
        cube.position.set(basePosition.x + i * spacing- spacing*2, basePosition.y + 4 * spacing, basePosition.z + 0);
        cube.originalPosition = new THREE.Vector3(cube.position.x, cube.position.y, cube.position.z);
        scene.add(cube);
        cubeMeshes.push(cube);
    }

    // Middle part of R
    for (let i = 0; i < 2; i++) {
        let cube = new THREE.Mesh(geometry, material);
        cube.position.set(basePosition.x , basePosition.y + (i+2) * spacing, basePosition.z + 0);
        cube.originalPosition = new THREE.Vector3(cube.position.x, cube.position.y, cube.position.z);
        scene.add(cube);
        cubeMeshes.push(cube);
    }

    // Diagonal part of R
    for (let i = 0; i < 2; i++) {
        let cube = new THREE.Mesh(geometry, material);
        cube.position.set(basePosition.x + (i - 1) * spacing, basePosition.y + (1 - i) * spacing, basePosition.z + 0);
        cube.originalPosition = new THREE.Vector3(cube.position.x, cube.position.y, cube.position.z);
        scene.add(cube);
        cubeMeshes.push(cube);
    }
}
// ... [Previous code remains the same]

function createLetterA(basePosition,geometry,material) {

    // Left diagonal part of A
    for (let i = 0; i < 5; i++) {
        let cube = new THREE.Mesh(geometry, material);
        cube.position.set(basePosition.x + (-spacing*1.5 + i * spacing / 3), basePosition.y + i * spacing, basePosition.z);
        cube.originalPosition = new THREE.Vector3(cube.position.x, cube.position.y, cube.position.z);
        scene.add(cube);
        cubeMeshes.push(cube);
    }

    // Right diagonal part of A
    for (let i = 0; i < 5; i++) {
        let cube = new THREE.Mesh(geometry, material);
        cube.position.set(basePosition.x + (spacing*1.5 - i * spacing / 3), basePosition.y + i * spacing, basePosition.z);
        cube.originalPosition = new THREE.Vector3(cube.position.x, cube.position.y, cube.position.z);
        scene.add(cube);
        cubeMeshes.push(cube);
    }

    // Middle part of A
    let middleCube = new THREE.Mesh(geometry, material);
    middleCube.position.set(basePosition.x, basePosition.y + spacing, basePosition.z);
    middleCube.originalPosition = new THREE.Vector3(middleCube.position.x, middleCube.position.y, middleCube.position.z);
    scene.add(middleCube);
    cubeMeshes.push(middleCube);
}

function createLetterI(basePosition,geometry,material) {
    // Vertical part of I
    for (let i = 0; i < 5; i++) {
        let cube = new THREE.Mesh(geometry, material);
        cube.position.set(basePosition.x, basePosition.y + i * spacing, basePosition.z);
        cube.originalPosition = new THREE.Vector3(cube.position.x, cube.position.y, cube.position.z);
        scene.add(cube);
        cubeMeshes.push(cube);
    }
}

function createLetterN(basePosition,geometry,material) {
    // Left vertical part of N
    for (let i = 0; i < 5; i++) {
        let cube = new THREE.Mesh(geometry, material);
        cube.position.set(basePosition.x, basePosition.y + i * spacing, basePosition.z);
        cube.originalPosition = new THREE.Vector3(cube.position.x, cube.position.y, cube.position.z);
        scene.add(cube);
        cubeMeshes.push(cube);
    }

    // Right vertical part of N
    for (let i = 0; i < 5; i++) {
        let cube = new THREE.Mesh(geometry, material);
        cube.position.set(basePosition.x + 2 * spacing, basePosition.y + i * spacing, basePosition.z);
        cube.originalPosition = new THREE.Vector3(cube.position.x, cube.position.y, cube.position.z);
        scene.add(cube);
        cubeMeshes.push(cube);
    }

    // Diagonal part of N
    for (let i = 0; i < 5; i++) {
        let cube = new THREE.Mesh(geometry, material);
        cube.position.set(basePosition.x + i * spacing / 2, basePosition.y + i * spacing, basePosition.z);
        cube.originalPosition = new THREE.Vector3(cube.position.x, cube.position.y, cube.position.z);
        scene.add(cube);
        cubeMeshes.push(cube);
    }
}



function animate() {
    requestAnimationFrame(animate);
    if(!isScrolling){
        mouseInteraction();
    }
    
    
    cubeMeshes.forEach(cube => {
        // Rotate each cube
        cube.rotation.y += 0.001;
    });



    renderer.render(scene, camera);
}

window.addEventListener('resize', onWindowResize, false);

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
function toggleShapes() {
    
        if (isCube) {
            cubeMeshes.forEach(cube => {
                // Change to sphere geometry
                cube.geometry = new THREE.SphereGeometry(cubeSize / 1.5, 8, 4);
            });
        } else {
            cubeMeshes.forEach(cube => {
                // Change back to cube geometry
                cube.geometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
            });

        }
    
    isCube = !isCube; // Toggle the state
}

function onMouseMove(event) {
    // 将鼠标位置转换为标准化设备坐标 (NDC)
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
}

function mouseInteraction() {
    // 更新射线与鼠标位置
    raycaster.setFromCamera(mouse, camera);

    // 计算物体和射线的交点
    let intersects = raycaster.intersectObjects(cubeMeshes);

    if (intersects.length > 0) {
        let object = intersects[0].object;
        // 移动方块
        if(object.position.z<=3){
            object.position.z += 0.1;
        }
        
    } else {
        // 没有交点，恢复所有方块的位置
        cubeMeshes.forEach(cube => {
            // 确保 originalPosition 已经被设置
            if (cube.originalPosition && cube.position.z > cube.originalPosition.z) {
                cube.position.z -= 0.1;
            }
        });
    }
}

// Now i can't detect scroll event!!!!!!
function onScroll(event) {
    isScrolling = true; 
    let currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
    let scrollDelta = currentScrollTop - lastScrollTop;

    cubeMeshes.forEach(cube => {
        let positionChange = scrollDelta * 0.05;
        cube.position.z -= positionChange;
    });

    lastScrollTop = currentScrollTop;

    // 重置 isScrolling 状态
    clearTimeout(window.scrollTimeout);
    window.scrollTimeout = setTimeout(() => {
        isScrolling = false;
    }, 150); // 尝试增加这个时间，比如 150 毫秒
}


