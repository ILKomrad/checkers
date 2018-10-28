import Socket from './socket';
import StepController from './stepController';

export default class Presenter {
    constructor() {
        this.hitsChips = null;
    }

    init(view, model) {
        this.view = view;
        this.model = model;
        this.socket = new Socket();
        this.socket.open().then((data) => {
            model.updatePaths(data.paths);
            model.updateCells(data.cells);
            model.updateHits(data.hitsChips); 
            view.init(model.getPaths(), model.getCells(), model.getHits());
            this.addListeners();
            this.stepController = new StepController(model);
            this.socket.socket.on('opponent_step', (opponentStep) => {
                this.opponentStepHandler(opponentStep);
            });
        });
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

    opponentStepHandler(opponentStep) {
        this.model.updatePaths(opponentStep.paths);
        this.model.updateHits(opponentStep.hitsChips); 
        this.view.desk.hits = this.model.hitsChips;
        this.view.desk.movePiece(opponentStep.chipName.name, opponentStep.toObj.name, true, () => {
            if (opponentStep.hitChip) {
                this.view.desk.removeFromDesk(opponentStep.hitChip.name, opponentStep.hitChip.range);
            }

            if (opponentStep.queen) {
                this.view.setQueen(opponentStep.queen.name, opponentStep.queen.range);
            }
        });
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
            this.hitChip.range = this.srepController.transformRange(this.hitChip.range);
            this.model.addHitChip(this.hitChip.range);
            this.view.desk.hits = this.model.hitsChips;
            this.view.desk.removeFromDesk(this.hitChip.name, this.hitChip.range);
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
            if (that.stepController.detectQueen(fromObj, toObj)) {
                fromObj.range = +(fromObj.range + '' + fromObj.range);
                that.view.setQueen(fromObj.name, fromObj.range);
                queen = {name: toObj.name, range: fromObj.range};
            }
    
            that.hitChip = that.hitChip[0];
            that.removeHitChip();
            that.model.updatePath(fromObj.row, fromObj.col, 0);
            that.model.updatePath(toObj.row, toObj.col, fromObj.range);
            that.view.desk.movePiece(fromObj.name, toObj.name);
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
                hitsChips: that.model.hitsChips
            };
        
        this.socket.emit('makeStep', JSON.stringify(data));
    }

    cancelStep(fromObj) {
        this.view.desk.movePiece(fromObj.row + '_' + fromObj.col, fromObj.row + '_' + fromObj.col);
    }
}
