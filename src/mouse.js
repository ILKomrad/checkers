export default class Mouse {
    constructor(camera, scene, renderer) {
        this.x = 0;
        this.y = 0;
        this.camera = camera;
        this.scene = scene;
        this.renderer = renderer;
        this.raycaster = new THREE.Raycaster();
    }

    setMousePosition(event) {
        this.x = ((event.clientX - this.renderer.domElement.offsetLeft) / this.renderer.domElement.width) * 2 * this.renderer.getPixelRatio() - 1;
        this.y = -((event.clientY - this.renderer.domElement.offsetTop) / this.renderer.domElement.height) * 2 * this.renderer.getPixelRatio() + 1;
    }

    getRegardingPosition(obj) {
        const vector = new THREE.Vector3(this.x, this.y, 1);
        vector.unproject(this.camera);
        this.raycaster.set(this.camera.position, vector.sub(this.camera.position).normalize());
        return this.raycaster.intersectObject(obj);
    }

    getIntersects(event) {
        this.setMousePosition(event);
        this.raycaster.setFromCamera({x: this.x, y: this.y}, this.camera);
        const intersects = this.raycaster.intersectObjects(this.scene.children);
        return intersects;
    }

    getPosition(mouse) {
        this.raycaster.setFromCamera(mouse, this.camera);

    }

    getRaycaster() {
        return this.raycaster;
    }
}