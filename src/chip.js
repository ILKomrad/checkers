export default class Chip {
    constructor(chipName, settings, range) {     
        const pieceMaterial = new THREE.MeshPhongMaterial({
	        color: settings.chipsColors[range],
	        shininess: 20
        });
        this.mesh = new THREE.Mesh(settings.geom['chip'].clone());
        this.mesh.material = pieceMaterial;
        // this.mesh.rotation.x = -Math.PI;
        this.mesh.name = chipName; 
        this.mesh.castShadow = true;
        this.mesh.type = 'chip';
        this.mesh.range = range;
    }

    moveTo(x, y, z) {
        this.mesh.position.set(x, y, z);
    }

    getPosition() {
        return {x: this.mesh.position.x, y: this.mesh.position.y, z: this.mesh.position.z}
    }

    getRange() {
        return this.mesh.range;
    }
}