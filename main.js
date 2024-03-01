
let scene, camera, renderer;
let isCube = true;
let isScrolling = false; 
let lastScrollTop = 0;
let cubeZ = 0;
const cubeSize = 1;
const spacing = 1.2;
let cubeMeshes = [];
let animationDuration = 2000; // in milliseconds
let transitionStart = performance.now();
let raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2();
var canvas,canvasRect;
let rain;

init();
animate();

function init() {
    
    // Set up the scene
    canvas = document.getElementById('canvas');
    canvasRect = canvas.getBoundingClientRect();
    scene = new THREE.Scene();
    let letteYPosition= -1;

    rain = new RAIN(scene,spacing,cubeMeshes);
    // Camera setup
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 10;

    // Renderer setup
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Define base positions for each letter
    let baseR = new THREE.Vector3(-6, letteYPosition, 0);
    let baseA = new THREE.Vector3(-2, letteYPosition, 0);
    let baseI = new THREE.Vector3(2, letteYPosition, 0);
    let baseN = new THREE.Vector3(6, letteYPosition, 0);
    let material = new THREE.MeshBasicMaterial( {

        color: 0xe0e0ff,
        wireframe: true

    } );
    let geometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);

    // Create letters with their respective base positions
    rain.createLetterR(baseR,geometry,material);
    rain.createLetterA(baseA,geometry,material);
    rain.createLetterI(baseI,geometry,material);
    rain.createLetterN(baseN,geometry,material);

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
    canvasRect = canvas.getBoundingClientRect();
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
    mouse.y = - ((event.clientY - canvasRect.top+window.pageYOffset)/ window.innerHeight) * 2 + 1;
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

// Now detect scroll event
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


