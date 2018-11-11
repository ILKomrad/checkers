import Renderer from './renderer';
import Settings from './settings';
import Desk from './desk';
import EventProcessor from './eventProcessor';
import Animator from './animator';
import Interface from './interface';

export default class View {
    constructor(presenter) {
        this.render = this.render.bind(this);
        this.renderer = new Renderer();
        this.settings = new Settings();
        this.presenter = presenter;
    }

    init(paths, cells, hits, game) {
        this.settings.waitLoadData()
        .then(() => {
            this.renderer.createEnvironment(this.presenter.player.range);
            this.desk = new Desk(this.renderer, this.settings);
            this.desk.create(paths, cells, hits);
            this.eventProcessor = new EventProcessor(this.renderer, this.desk, this.presenter);
            this.renderer.show();
            this.render();
            this.addListeners();
            this.animator = new Animator();
            this.interface = new Interface(this.presenter.player.range);
            this.interface.create();
            this.interface.setActive(game.whoseTurn);
            this.interface.showScore(game.statistic['1'] + ' : ' + game.statistic['2']);
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
            if (event.target) {
                const id = event.target.getAttribute('data-id');
    
                if (id) {
                    if (id === 'newGame') {
                        this.presenter.requestForNewGame();
                    }
                } else {
                    if (this.presenter.yourTurn) {
                        this.eventProcessor.onDocumentMouseDown(event);
                    } else {
                        this.presenter.alert('not your turn', true);
                    }
                }
            }
        }, false);
        window.addEventListener('resize', this.eventProcessor.onWindowResize, false);
        window.addEventListener('stepStart', () => {
            console.log('stepStart');
            this.renderer.switchFpsControl(false);
        });
        window.addEventListener('stepFinish', () => {
            console.log('stepFinish');
            this.renderer.switchFpsControl(true);
        });
    }

    render() {
        requestAnimationFrame(this.render);
        TWEEN.update();
        this.renderer.render();
    }

    
}