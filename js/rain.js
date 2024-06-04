class RAIN {
    constructor(scene,spacing,cubeMeshes) {
        this.scene = scene;
        this.spacing = spacing;
        this.cubeMeshes = cubeMeshes;
    }

    createCube(basePosition, offset, geometry, material) {
        let cube = new THREE.Mesh(geometry, material);
        cube.position.set(basePosition.x + offset.x, basePosition.y + offset.y, basePosition.z + offset.z);
        cube.originalPosition = new THREE.Vector3(cube.position.x, cube.position.y, cube.position.z);
        this.scene.add(cube);
        this.cubeMeshes.push(cube);
    }

    createLetterR(basePosition, geometry, material) {
        // Vertical part of R
        for (let i = 0; i < 5; i++) {
            this.createCube(basePosition, new THREE.Vector3(-this.spacing * 2, i * this.spacing, 0), geometry, material);
        }
        // Top part of R
        for (let i = 1; i < 3; i++) {
            this.createCube(basePosition, new THREE.Vector3(i * this.spacing - this.spacing * 2, 4 * this.spacing, 0), geometry, material);
        }
        // Middle part of R
        for (let i = 0; i < 2; i++) {
            this.createCube(basePosition, new THREE.Vector3(0, (i + 2) * this.spacing, 0), geometry, material);
        }
        // Diagonal part of R
        for (let i = 0; i < 2; i++) {
            this.createCube(basePosition, new THREE.Vector3((i - 1) * this.spacing, (1 - i) * this.spacing, 0), geometry, material);
        }
    }

    createLetterA(basePosition, geometry, material) {
        // Left diagonal part of A
        for (let i = 0; i < 5; i++) {
            this.createCube(basePosition, new THREE.Vector3(-this.spacing * 1.5 + i * this.spacing / 3, i * this.spacing, 0), geometry, material);
        }
        // Right diagonal part of A
        for (let i = 0; i < 5; i++) {
            this.createCube(basePosition, new THREE.Vector3(this.spacing * 1.5 - i * this.spacing / 3, i * this.spacing, 0), geometry, material);
        }
        // Middle part of A
        this.createCube(basePosition, new THREE.Vector3(0, this.spacing, 0), geometry, material);
    }

    createLetterI(basePosition, geometry, material) {
        // Vertical part of I
        for (let i = 0; i < 5; i++) {
            this.createCube(basePosition, new THREE.Vector3(0, i * this.spacing, 0), geometry, material);
        }
    }

    createLetterN(basePosition, geometry, material) {
        // Left vertical part of N
        for (let i = 0; i < 5; i++) {
            this.createCube(basePosition, new THREE.Vector3(0, i * this.spacing, 0), geometry, material);
        }
        // Right vertical part of N
        for (let i = 0; i < 5; i++) {
            this.createCube(basePosition, new THREE.Vector3(2 * this.spacing, i * this.spacing, 0), geometry, material);
        }
        // Diagonal part of N
        for (let i = 0; i < 5; i++) {
            this.createCube(basePosition, new THREE.Vector3(i * this.spacing / 2, i * this.spacing, 0), geometry, material);
        }
    }
}
