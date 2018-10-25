export default class Cell {
    constructor(color, texture, col, row, colorName) {
        const symGeometry = new THREE.PlaneGeometry(10, 10);
        const bodyMaterial = new THREE.MeshBasicMaterial({
            //color: color,
            //map: texture,
            transparent: true
        });
        // const bodyMaterial = new THREE.MeshPhongMaterial({
        //     color: color,
        //     transparent: true
        // });
        
        this.mesh = new THREE.Mesh(symGeometry, bodyMaterial);

        if (colorName === 'b') {
            this.mesh.material.color = new THREE.Color(color);
        }
        this.mesh.rotation.x = -Math.PI / 2;
        this.mesh.name = row + '_' + col;
        this.mesh.type = 'cell';
        this.mesh.receiveShadow = true;
        this.mesh.row = row;
        this.mesh.col = col;
        this.mesh.colorName = colorName;
    }

    setPosition(x, y, z) {
        this.mesh.position.set(x, y, z);
    }

    getPosition() {
        const th = this;
        
        return {x: th.mesh.position.x, y: th.mesh.position.y, z: th.mesh.position.z};
    }
}