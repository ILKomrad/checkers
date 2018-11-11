export default class Interface {
    constructor(range) {
        this.range = range;
        this.wrap = document.querySelector('.interface');
    }

    create() {
        this.white = this.createBox(1);
        this.black = this.createBox(2);
        this.alert = this.createAlert();
        this.stepSound = this.createAudio('assets/sound/step.mp3');
        this.removeSound = this.createAudio('assets/sound/remove.mp3');
        this.winSound = this.createAudio('assets/sound/win.mp3');
        this.looseSound = this.createAudio('assets/sound/loose.mp3');
        this.scoreValue = this.createScore();
        this.sidebar = this.createSidebar(); 
    }

    createSidebar() {
        const sidebar = this.createElement('div', 'sidebar', this.wrap);
        this.newGame = this.createElement('button', 'sidebar__btn' + ' ' + 'btn', sidebar, 'new game');
        this.newGame.setAttribute('data-id', 'newGame');
    }

    createScore() {
        const score = this.createElement('h5', 'box-score', this.wrap, 'score'),
            scoreValue = this.createElement('span', 'box-score__value', score, '1:0');

        return scoreValue;
    }

    showScore(score) {
        this.scoreValue.innerHTML = score;
    }

    createAudio(path) {
        const audio = new Audio(path);
        this.wrap.appendChild(audio);
        
        return audio;
    }

    reproduceSound(sound) {
        if (this[sound]) {
            this[sound].play();
        }
    }

    createAlert() {
        return this.createElement('h5', 'box__alert', this.wrap);
    }

    createBox(range) {
        let className = 'white',
            name = 'you';

        if (range === 2) {
            className = 'black';
        }

        if (range !== this.range) {
            name = 'opponent';
        }

        const wrap = this.createElement('div', className + ' ' + 'box', this.wrap),
            chip = this.createElement('div', 'box__chip', wrap),
            title = this.createElement('h5', 'box__title', wrap, name);

        return wrap;
    }

    createElement(tagName, className, place, innerHtml) {
        const element = document.createElement(tagName);
        
        if (className) { element.className = className; }

        if (innerHtml) { element.innerHTML = innerHtml; }

        place.appendChild(element);

        return element;
    }

    setActive(range) {
        if (range === 1) {
            this.black.classList.remove('active');
            this.white.classList.add('active');
        } else {
            this.white.classList.remove('active');
            this.black.classList.add('active');
        }
    }

    showAlert(message, error) {
        if (error) {
            this.alert.classList.add('showError');
        } else {
            this.alert.classList.add('showMessage');
        }
        this.alert.innerHTML = message;

        setTimeout(() => {
            this.alert.classList.remove('showError');
            this.alert.classList.remove('showMessage');
        }, 2000);
    }
}