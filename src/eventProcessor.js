import Mouse from './mouse';
import DragAndDrop from './dragAndDrop';
import StepController from './stepController';

export default class EventProcessor {
    constructor(r, desk, presenter) {
        this.renderer = r;
        this.presenter = presenter;
        this.mouse = new Mouse(r.getCamera(), r.getScene(), r.getRenderer());
        this.dragAndDrop = new DragAndDrop(r, desk.border, this.mouse);
        this.onWindowResize = this.onWindowResize.bind(this);
        this.stepController = new StepController();
    }

    onDocumentMouseDown(event) {
        const that = this,
            intersects = that.mouse.getIntersects(event);

        for (let item in intersects) {
            const target = intersects[item].object;
           
            if (target.type === 'chip') {
                if (this.presenter.player.range === this.stepController.transformRange(target.range)) {
                    that.dragAndDrop.start(target, that.mouse.getRaycaster(), false, function(obj) {
                        window.dispatchEvent(new CustomEvent('step', {'detail': {'from': target.name, 'to': obj}}));
                        //that.presenter.makeStep(obj, intersects[item].object.name);
                    });
                } else {
                    this.presenter.alert('not your range', true);
                }
            }
        }
    }

    onWindowResize() {
        console.log( 'onWindowResize' );
        this.renderer.resize();
    }
}