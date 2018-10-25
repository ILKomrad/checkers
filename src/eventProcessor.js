import Mouse from './mouse';
import DragAndDrop from './dragAndDrop';

export default class EventProcessor {
    constructor(r, desk) {
        this.renderer = r.getRenderer();
        this.camera = r.getCamera();
        const scene = r.getScene();
        this.mouse = new Mouse(this.camera, scene, this.renderer);
        this.dragAndDrop = new DragAndDrop(r, desk.border, this.mouse);
        this.onWindowResize = this.onWindowResize.bind(this);
    }

    onDocumentMouseDown(event) {
        const that = this,
            intersects = that.mouse.getIntersects(event);

        for (let item in intersects) {
            const target = intersects[item].object;
           
            if (target.type === 'chip') {
                //console.log( 'touch', target.range, target.name, target.position )
                that.dragAndDrop.start(target, that.mouse.getRaycaster(), false, function(obj) {
                    const e = new CustomEvent('step', {'detail': {'from': target.name, 'to': obj}});
                    window.dispatchEvent(e);
                    //that.presenter.makeStep(obj, intersects[item].object.name);
                });
            }
        }
    }

    onWindowResize() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
    }
}