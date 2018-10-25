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
            view.init(model.getPaths(), model.getCells());
            this.addListeners();
            this.stepController = new StepController(model);
        });
    }

    addListeners() {
        window.addEventListener('step', (e) => {
            this.stepHandler(e.detail.from, e.detail.to);
        })
    }

    getColAndRow(name) {
        const array = name.split('_');

        return {row: +array[0], col: +array[1]};
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

        return obj;
    }

    getHitChip(fromObj, toObj, isQueen) {
        let hitChip;

        if (isQueen) { 
            hitChip =  this.stepController.getHitByQueen(fromObj, toObj); 
        } else {
            hitChip =  this.stepController.getHitByChip(fromObj, toObj); 
        }

        return hitChip;
    }

    removeHitChip(hitChip) {
        this.model.updatePath(hitChip.row, hitChip.col, 0);
        this.model.addHitChip(hitChip.range);
        this.view.desk.hits = this.model.hitsChips;
        this.view.desk.removeFromDesk(hitChip.name, hitChip.range);
    }

    makeStep(fromObj, toObj) {
        const that = this,
            isQueen = that.stepController.isQueen(fromObj),
            hitChip = that.getHitChip(fromObj, toObj, isQueen);

        if (!hitChip) {
            if (!isQueen && that.stepController.isFar(fromObj, toObj)) {
                that.cancelStep(fromObj);
                return;
            }
        } else {
            that.removeHitChip(hitChip);
        }

        that.model.updatePath(fromObj.row, fromObj.col, 0);
        that.model.updatePath(toObj.row, toObj.col, fromObj.range);
        that.view.desk.makeStep(fromObj.row + '_' + fromObj.col, toObj.row + '_' + toObj.col);
    }

    cancelStep(fromObj) {
        this.view.desk.makeStep(fromObj.row + '_' + fromObj.col, fromObj.row + '_' + fromObj.col);
    }
}
