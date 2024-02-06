let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

let renderer = new THREE.WebGLRenderer();
renderer.setClearColor(0x000000); // 设置背景颜色为黑色
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

window.addEventListener('resize', function() {
    let width = window.innerWidth;
    let height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
});

// 创建地形
let geometry = new THREE.PlaneBufferGeometry(80, 80, 20, 20);

let positions = geometry.attributes.position.array;

// Define the peaks with their index and height
let peaks = [
    { index: 37, height: 15 }, // Peak 1
    { index: 128, height: 12 },  // Peak 2
    { index: 285, height: 18 }, // Peak 3
    { index: 383, height: 9 }   // Peak 4
];

// Function to calculate the distance from a point to a peak
function distanceToPeak(pointX, pointY, peakX, peakY) {
    return Math.sqrt(Math.pow(pointX - peakX, 2) + Math.pow(pointY - peakY, 2));
}

// Assign heights to the peaks and interpolate surrounding vertices
for (let i = 0; i < positions.length; i += 3) {
    let x = positions[i];
    let y = positions[i + 1];
    let height = 0;

    for (let peak of peaks) {
        let peakPosition = peak.index * 3;
        let peakX = positions[peakPosition];
        let peakY = positions[peakPosition + 1];

        let distance = distanceToPeak(x, y, peakX, peakY);
        let influenceArea = peak.height*1.5;
        
        // Calculate height based on the distance to the peak and the peak's influence
        if (distance < influenceArea) {
            let influence = (1 - (distance / influenceArea)) * peak.height;
            height = Math.max(height, influence);
        }
    }

    positions[i + 2] = height;
}

geometry.attributes.position.needsUpdate = true;

let wireframe = new THREE.WireframeGeometry(geometry);

// let material = new THREE.LineBasicMaterial({
//     color: 0xff0000, // 网格线的颜色
//     linewidth: 1 // 网格线的宽度
// });
let material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });

// let material = new THREE.ShaderMaterial({
//     vertexShader: /* glsl */`
//         varying vec3 vPosition;
//         void main() {
//             vPosition = position;
//             gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
//         }
//     `,
//     fragmentShader: /* glsl */`
//         varying vec3 vPosition;
//         void main() {
//             float contourInterval = 5.0; // height difference between contours
//             float contourWidth = 0.2; // width of the contour lines

//             // Calculate if current fragment is near a contour level
//             float contourLevel = mod(vPosition.z, contourInterval);
//             bool nearContour = contourLevel < contourWidth || contourInterval - contourLevel < contourWidth;

//             if (nearContour) {
//                 gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0); // contour line color
//             } else {
//                 discard; // don't draw anything if not near a contour
//             }
//         }
//     `,
//     transparent: true
// });

let ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

let terrain = new THREE.LineSegments(wireframe, material);
terrain.rotation.x = -Math.PI / 2; // 调整地形的方向
scene.add(terrain);

camera.position.set(0, 50, 100);
camera.lookAt(new THREE.Vector3(0, 0, 0));

function animate() {
    requestAnimationFrame(animate);
    terrain.rotation.z += 0.001; // 旋转地形
    renderer.render(scene, camera);
}

animate();