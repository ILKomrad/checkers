import Presenter from './presenter';
import View from './view';
import Model from './model';

class Game {
    init() {
        this.model = new Model();
        this.view = new View();
        this.presenter = new Presenter();
        this.presenter.init(this.view, this.model);
    }
}

window.addEventListener('load', () => {
    const game = new Game();
    game.init();
});