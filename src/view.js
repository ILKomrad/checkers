import Renderer from './renderer';
import Settings from './settings';
import Desk from './desk';
import EventProcessor from './eventProcessor';
import Animator from './animator';

export default class View {
    constructor() {
        this.render = this.render.bind(this);
        this.renderer = new Renderer();
        this.settings = new Settings();
    }

    init(paths, cells, hits) {
        this.settings.waitLoadData()
        .then(() => {
            this.renderer.createEnvironment();
            this.desk = new Desk(this.renderer, this.settings);
            this.desk.create(paths, cells, hits);
            this.eventProcessor = new EventProcessor(this.renderer, this.desk);
            this.render();
            this.addListeners();
            this.animator = new Animator();
            
            const camera = this.renderer.getCamera();
        })
    }

    setQueen(queenName, range) {
        const mesh = this.desk.findChip(queenName),
            queenPos = mesh.getPosition();
        mesh.mesh.range = range;
        this.animator.zoomToObject(this.renderer.getCamera(), this.renderer.getControls(), queenPos)
        .then(() => {
            return this.animator.rotateChip(mesh.mesh, Math.PI);
        })
        .then(() => {
            this.animator.unzoomToObject(this.renderer.getCamera(), this.renderer.getControls(), queenPos);
        });
    }

    addListeners() {
        document.addEventListener('mousedown', (event) => {
            this.eventProcessor.onDocumentMouseDown(event);
        }, false);
        window.addEventListener('resize', this.eventProcessor.onWindowResize, false);
    }

    render() {
        requestAnimationFrame(this.render);
        TWEEN.update();
        this.renderer.render();
    }

    
}