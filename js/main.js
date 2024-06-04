let scene, camera, renderer;
let isCube = true;
let isScrolling = false; 
let allsize = 18000;
let lastScrollTop = 0;
let scrollRatio = 0;
let cubeZ = 0;
let cubeSize = 1;
const spacing = 1.2;
let letteYPosition = -3;
let cubeMeshes = [];
let animationDuration = 2000; // in milliseconds
let transitionStart = performance.now();
let raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2();
let centerY =0;
var canvasY;
let rain;
let enableRaycast = true;



init();
animate();

function init() {
    // Set up the scene
    canvasY = document.getElementById('canvas').getBoundingClientRect().top;
    scene = new THREE.Scene();

    rain = new RAIN(scene, spacing, cubeMeshes);

    // Camera setup
    camera = new THREE.PerspectiveCamera(75, window.innerWidth /( window.innerHeight+108), 0.1, 2000);
    camera.position.z = allsize / window.innerWidth;

    // Renderer setup
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth , window.innerHeight+108);
    renderer.setPixelRatio(window.devicePixelRatio);

    // Append renderer to the #canvas div instead of the body
    document.getElementById('canvas').appendChild(renderer.domElement);

    // Define base positions for each letter
    let baseR = new THREE.Vector3(-6, letteYPosition, 0);
    let baseA = new THREE.Vector3(-2, letteYPosition, 0);
    let baseI = new THREE.Vector3(2, letteYPosition, 0);
    let baseN = new THREE.Vector3(6, letteYPosition, 0);
    let material = new THREE.MeshBasicMaterial({
        color: 0xffffff,  // 纯白色
        wireframe: true
    });
    let geometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);

    // Create letters with their respective base positions
    rain.createLetterR(baseR, geometry, material);
    rain.createLetterA(baseA, geometry, material);
    rain.createLetterI(baseI, geometry, material);
    rain.createLetterN(baseN, geometry, material);

    // 为 "My Works" 链接添加鼠标悬停事件监听器
    const myWorksLink = document.querySelector('a[href="#all-works"]');
    myWorksLink.addEventListener('mouseenter', onMyWorksHover);
    myWorksLink.addEventListener('mouseleave', onMyWorksLeave);

    // 为 "About Me" 链接添加鼠标悬停事件监听器
    const aboutMeLink = document.querySelector('a[href="about-me.html"]');
    aboutMeLink.addEventListener('mouseenter', onAboutMeHover);
    aboutMeLink.addEventListener('mouseleave', onAboutMeLeave);

    // 为 "Contact Me" 链接添加鼠标悬停事件监听器
    const contactMeLink = document.querySelector('a[href="contact-me.html"]');
    contactMeLink.addEventListener('mouseenter', onContactMeHover);
    contactMeLink.addEventListener('mouseleave', onContactMeLeave);

    // EventListener
    window.addEventListener('click', toggleShapes, false);
    window.addEventListener('mousemove', onMouseMove, false);
    window.addEventListener('scroll', onScroll, false);

    // Initial animation
    // Set initial positions to outside the view for animation
    const offsetX = 3;
    const offsetY = 3;
    const offsetZ = -1; // Adjust this based on your camera position
    lastScrollTop = 0;
    cubeMeshes.forEach(cube => {
        cube.position.set(
            (Math.random() > 0.5 ? 1 : -1) * offsetX, // X position just outside the view
            (Math.random() > 0.5 ? 1 : -1) * offsetY, // Y position just outside the view
            camera.position.z + offsetZ  // Z position just outside the view
        );
    });
    adjustCubePositions();
    cubeMeshes.forEach(cube => {
        gsap.killTweensOf(cube.position);
        gsap.killTweensOf(cube.scale);
        gsap.to(cube.position, {
            duration: 2,
            x: cube.originalPosition.x,
            y: cube.originalPosition.y,
            z: cube.originalPosition.z,
            ease: "power3.inOut"
        });
    }); 
    introAnimation();   
}

function animate() {
    requestAnimationFrame(animate);
    if (!isScrolling) {
        mouseInteraction();
    }

    cubeMeshes.forEach(cube => {
        // Rotate each cube
        cube.rotation.y += 0.002;
    });

    renderer.render(scene, camera);
}

window.addEventListener('resize', onWindowResize, false);

function onWindowResize() {

    camera.aspect = window.innerWidth  / (window.innerHeight+108);
    camera.updateProjectionMatrix();
    camera.position.z = allsize / window.innerWidth;
    renderer.setSize(window.innerWidth, window.innerHeight+108);
    adjustCubePositions();
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
    mouse.y = -((event.clientY - canvasY + window.pageYOffset) /(window.innerHeight+108)) * 2 + 1;
}

function mouseInteraction() {
    if (!enableRaycast) return;
    // 更新射线与鼠标位置
    raycaster.setFromCamera(mouse, camera);

    // 计算物体和射线的交点
    let intersects = raycaster.intersectObjects(cubeMeshes);

    if (intersects.length > 0) {
        let object = intersects[0].object;
        // 移动方块
        if (object.position.z <= 1) {
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
    // 暂停鼠标与方块的交互
    enableRaycast = false;

    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    let maxScrollTop = document.documentElement.scrollHeight - window.innerHeight;
    scrollRatio = scrollTop / maxScrollTop;

    cubeMeshes.forEach(cube => {
        // 根据滚动比例直接设置位置和大小
        let newPositionZ = cube.originalPosition.z - scrollRatio * 20; // 调整这个数值以控制移动距离
        let newScale = Math.max(0, 1 - scrollRatio * 2); // 调整这个数值以控制缩小程度
        gsap.killTweensOf(cube.position);
        gsap.killTweensOf(cube.scale);
        gsap.to(cube.position, {
            duration: 0.1,
            x: cube.originalPosition.x,
            y: cube.originalPosition.y,
            z: cube.originalPosition.z,
        });

        gsap.to(cube.scale, {
            duration: 0.1,
            x: newScale,
            y: newScale,
            z: newScale,
        });
    });

    // 重置 isScrolling 状态并恢复鼠标与方块的交互
    clearTimeout(window.scrollTimeout);
    window.scrollTimeout = setTimeout(() => {
        enableRaycast = true;
    }, 150);
}

// 你的其他动画代码保持不变
function onMyWorksHover(){
    enableRaycast = false;
    // 每个方块朝四周飘散去
    cubeMeshes.forEach(cube => {
        gsap.killTweensOf(cube.position);
        gsap.killTweensOf(cube.scale);
        gsap.to(cube.position, {
            duration: 0.6,
            x: cube.originalPosition.x + (Math.random() - 0.5) * 10,
            y: cube.originalPosition.y + (Math.random() - 0.5) * 15 + 2,
            z: cube.originalPosition.z + (Math.random() - 0.5) * 20,
            ease: "power1.inOut"
        });
        gsap.to(cube.scale, {
            duration: 0.6,
            x: 1, // 恢复原大小
            y: 1, // 恢复原大小
            z: 1, // 恢复原大小
            ease: "power1.inOut"
        });
    });
}

function onMyWorksLeave() {
    enableRaycast = true;
    // 恢复方块到它们的原始位置
    cubeMeshes.forEach(cube => {
        gsap.killTweensOf(cube.position);
        gsap.killTweensOf(cube.scale);
        gsap.to(cube.position, {
            duration: 0.6,
            x: cube.originalPosition.x,
            y: cube.originalPosition.y,
            z: cube.originalPosition.z,
            ease: "power1.inOut"
        });
        gsap.to(cube.scale, {
            duration: 0.6,
            x: 1 - scrollRatio * 2,
            y: 1 - scrollRatio * 2,
            z: 1 - scrollRatio * 2,
            ease: "power1.inOut"
        });
    });
}

function onAboutMeHover() {
    // 聚集所有方块到一个点并变大和向上移动
    cubeMeshes.forEach(cube => {
        gsap.killTweensOf(cube.position);
        gsap.killTweensOf(cube.scale);
        gsap.to(cube.position, {
            duration: 0.6,
            x: 0,
            y: -centerY, 
            z: 0,
            ease: "power1.inOut"
        });
        gsap.to(cube.scale, {
            duration: 1,
            x: 4, // 变大
            y: 4, // 变大
            z: 4, // 变大
            ease: "power1.inOut"
        });
    });
}

function onAboutMeLeave() {
    // 恢复方块到它们的原始位置和大小
    cubeMeshes.forEach(cube => {
        gsap.killTweensOf(cube.position);
        gsap.killTweensOf(cube.scale);
        gsap.to(cube.position, {
            duration: 0.6,
            x: cube.originalPosition.x,
            y: cube.originalPosition.y,
            z: cube.originalPosition.z,
            ease: "power1.inOut"
        });
        gsap.to(cube.scale, {
            duration: 0.6,
            x: 1 - scrollRatio * 2,
            y: 1 - scrollRatio * 2,
            z: 1 - scrollRatio * 2,
            ease: "power1.inOut"
        });
    });
}

function onContactMeHover() {
    // 方块沿 Z 轴形成波浪滚动效果
    cubeMeshes.forEach((cube, index) => {
        gsap.to(cube.position, {
            duration: 0.8,
            z: cube.originalPosition.z + 1 * Math.sin(index * 0.5),
            ease: "power1.inOut",
            repeat: -1,
            yoyo: true,
            delay: index * 0.05
        });
    });
}

function onContactMeLeave() {
    // 停止波浪滚动效果并恢复方块到它们的原始位置
    cubeMeshes.forEach((cube, index) => {
        gsap.killTweensOf(cube.position);
        gsap.to(cube.position, {
            duration: 0.6,
            x: cube.originalPosition.x,
            y: cube.originalPosition.y,
            z: cube.originalPosition.z,
            ease: "power1.inOut"
        });
        gsap.to(cube.scale, {
            duration: 0.6,
            x: 1 - scrollRatio * 2,
            y: 1 - scrollRatio * 2,
            z: 1 - scrollRatio * 2,
            ease: "power1.inOut"
        });
    });
}

function introAnimation() {
    // 选择自我介绍的元素
    const introText = document.querySelector('.hi .title-20');
    // 确保元素存在
    if (introText) {
        // 拆分文本成多行
        const lines = introText.innerHTML.split('<br>');
        introText.innerHTML = '';
        
        lines.forEach((line, index) => {
            const span = document.createElement('span');
            span.innerHTML = line;
            span.style.display = 'block';
            span.style.opacity = 0;
            introText.appendChild(span);
            
            // 使用 GSAP 动画
            gsap.to(span, {
                duration: 1.5,
                opacity: 1,
                x: 0,
                delay: index * 0.5,
                ease: "power3.out"
            });
        });
    }
}


function adjustCubePositions() {
    let x = window.innerHeight;
    const distanceTop = 468;
    const distanceBottom = 80;

    // 计算窗口中点Y值（屏幕坐标）
    const windowCenterY = x / 2;

    // 计算3D空间中对应的Y值
    const topY = (distanceTop - windowCenterY) * (camera.position.z / x);
    const bottomY = (x - distanceBottom - windowCenterY) * (camera.position.z / x);
    // 计算中心点的Y值
    centerY = (topY + bottomY) / 2;

    cubeMeshes.forEach(cube => {
        // Adjust the Y position of each cube based on the new center Y point
        const originalY = cube.originalPosition2.y;
        cube.position.y = originalY-centerY;

        // Update original positions to the new ones
        cube.originalPosition.y = cube.position.y;
    });
}

