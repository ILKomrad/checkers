import Socket from './socket';
import Common from './common';
import StepController from './stepController';

export default class Presenter {
    constructor() {
        this.hitsChips = null;
        this.common = new Common();
    }

    init(view, model) {
        this.userId = this.common.getCookie('checkersUserId');

        if (this.userId) {
            this.view = view;
            this.model = model;
            this.socket = new Socket();
            this.socket.open(this.userId).then((data) => {
                this.player = data.user;
                this.newGame(data);
                console.log('win', data.game.whoseTurn);
                console.log(this.player)
                view.init(model.getPaths(), model.getCells(), model.getHits(), data.game);
                this.addListeners();
                this.stepController = new StepController(model);
                this.socket.socket.on('opponent_step', (opponentStep) => {
                    this.opponentStepHandler(JSON.parse(opponentStep));
                });
                this.socket.socket.on('whoseTurn', (event) => {
                    const data = JSON.parse(event);
                    this.whoseTurn = data.whoseTurn;
                    this.transitionCourse();
                });
                this.socket.socket.on('gameOver', (event) => {
                    const data = JSON.parse(event);
                    this.isWin(data);
                });
                this.socket.socket.on('newGame', (event) => {
                    const data = JSON.parse(event);
                    this.newGame(data);
                    this.view.desk.newGame(this.model.paths, this.model.cells, this.model.hitsChips);
                });

                if (data.game.whoseTurn === this.player.range) {
                    this.yourTurn = true;
                }
            });
        } else {
            window.location = 'http://localhost:3000/';
        }
    }

    addListeners() {
        window.addEventListener('step', (e) => {
            this.stepHandler(e.detail.from, e.detail.to);
        });
    }

    getColAndRow(name) {
        const array = name.split('_');

        return {row: +array[0], col: +array[1]};
    }

    transitionCourse() {
        if (this.whoseTurn === this.player.range) {
            this.yourTurn = true;    
            this.alert('your turn'); 
        } else {
            this.yourTurn = false;
        }

        this.view.interface.setActive(this.whoseTurn);
    }

    opponentStepHandler(opponentStep) {
        this.whoseTurn = opponentStep.whoseTurn;
        this.model.updatePaths(opponentStep.paths);
        this.model.updateHits(opponentStep.hitsChips); 
        this.view.desk.hits = this.model.hitsChips;
        this.view.desk.movePiece(opponentStep.chipName.name, opponentStep.toObj.name, true, () => {
            if (opponentStep.hitChip) {
                setTimeout(() => {
                    this.view.interface.reproduceSound('removeSound');
                }, 1000);
                this.view.desk.removeFromDesk(opponentStep.hitChip.name, opponentStep.hitChip.range);
            }

            if (opponentStep.queen) {
                this.view.setQueen(opponentStep.queen.name, opponentStep.queen.range);
            }

            this.isWin(opponentStep);
            this.view.interface.reproduceSound('stepSound');
            this.transitionCourse();
        });
    }

    isWin(data) {
        if (data.whosWin) {
            if (data.whosWin === this.player.range) {
                this.win();
            } else {
                this.loose();
            }

            this.view.interface.showScore(data.statistic['1'] + ' : ' + data.statistic['2']);
        } 
    }

    newGame(data) {
        this.whoseTurn = data.game.whoseTurn;

        if (this.whoseTurn === this.player.range) {
            this.yourTurn = true;
        }

        this.model.updatePaths(data.game.paths);
        this.model.updateCells(data.game.cells);
        this.model.updateHits(data.game.hitsChips); 
        console.log( this.whoseTurn )
    }

    requestForNewGame() {
        this.socket.emit('newGame', JSON.stringify({
            gameId: this.player.gameId, 
            opponentId: this.player.opponentId,
        }));
    }

    win() {
        this.view.interface.reproduceSound('winSound');
        this.alert('you win');
    }

    loose() {
        this.view.interface.reproduceSound('looseSound');
        this.alert('you loose', true);
    }

    stepHandler(fromName, toName) {
        const that = this,
            fromObj = that.getObjectFromPaths(fromName), 
            toObj = that.getObjectFromPaths(toName),
            isValid = that.stepController.isValidStep(fromObj, toObj);
        
        if (isValid) {
            this.makeStep(fromObj, toObj);
        } else {
            this.cancelStep(fromObj);
        }
        console.log( that.model.hitsChips, that.model.paths )
    }

    getObjectFromPaths(name) {
        const obj = this.getColAndRow(name);
        obj.range = this.model.getRange(obj.row, obj.col);
        obj.name = name;

        return obj;
    }

    removeHitChip() {
        if (this.hitChip) {
            this.model.updatePath(this.hitChip.row, this.hitChip.col, 0);
            this.hitChip.range = this.stepController.transformRange(this.hitChip.range);
            this.model.addHitChip(this.hitChip.range);
            this.view.desk.hits = this.model.hitsChips;
            this.view.desk.removeFromDesk(this.hitChip.name, this.hitChip.range);
            setTimeout(() => {
                this.view.interface.reproduceSound('removeSound');
            }, 1000);
        }
    }

    postValidationStep(fromObj, toObj, isQueen) {
        if (!this.hitChip.length) {
            if (!isQueen && this.stepController.isFar(fromObj, toObj)) {
                this.cancelStep(fromObj);
                return;
            }
        } else if (!this.checkHitOnValid(fromObj)) {
            this.cancelStep(fromObj);
            return;
        }

        return true;
    }

    makeStep(fromObj, toObj) {
        let queen;
        const that = this,
            isQueen = that.stepController.isQueen(fromObj);
        that.hitChip = that.stepController.getHitChip(fromObj, toObj, isQueen);

        if (!this.postValidationStep(fromObj, toObj, isQueen)) {
            return;
        } else {
            that.hitChip = that.hitChip[0];
            that.removeHitChip();
            that.yourTurn = false;

            if (that.stepController.detectQueen(fromObj, toObj)) {
                fromObj.range = +(fromObj.range + '' + fromObj.range);
                that.view.setQueen(fromObj.name, fromObj.range);
                queen = {name: toObj.name, range: fromObj.range};
            }
            
            that.model.updatePath(fromObj.row, fromObj.col, 0);
            that.model.updatePath(toObj.row, toObj.col, fromObj.range);
            that.view.desk.movePiece(fromObj.name, toObj.name);
            that.view.interface.reproduceSound('stepSound');
            that.sendSocket(fromObj, toObj, queen);
        }
    }

    checkHitOnValid(fromObj) {
        if (this.hitChip.length > 1) {
            return;
        } else if (this.stepController.chechSimilarRange(fromObj.range, this.hitChip)) {
            return;
        }

        return true;
    }

    sendSocket(fromObj, toObj, queen) {
        const that = this,
            data = {
                chipName: fromObj,
                toObj,
                queen,
                hitChip: that.hitChip,
                paths: that.model.paths,
                hitsChips: that.model.hitsChips,
                gameId: that.player.gameId,
                opponentId: that.player.opponentId,
                range: that.player.range
            };
        
        this.socket.emit('makeStep', JSON.stringify(data));
    }

    cancelStep(fromObj) {
        this.view.desk.movePiece(fromObj.row + '_' + fromObj.col, fromObj.row + '_' + fromObj.col);
    }

    alert(text, error) {
        this.view.interface.showAlert(text, error);
    }
}
