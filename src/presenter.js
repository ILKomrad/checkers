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
            this.makeStep(e.detail.from, e.detail.to);
        })
    }

    getPosInArray(name) {
        const array = name.split('_');

        return {row: +array[0], col: +array[1]};
    }

    makeStep(from, to) {
        /*
        проверяем валидный ли шаг isValidStep (проверка цвета, не на то ли место, не занята ли клетка) и результат записываем в isValid
        если шаг валидный 
            проверяем если шашка дама - то получаем побитую шашку методом getHitByQueen(from, to) и записуем ее в переменную hitChip
            если не дама - то получаем побитую шашку методом getHitByChip(from, to) и записуем ее в переменную hitChip
            если hipChip равен нулл 
                если шашка не дама и проверка шага на дальность (равен ли шаг единице и не походила ли шашка назад) методом isFar(from, to) провалилась
                    присваеваем переменной isValid false            
            иначе если hipChip не равен нулл 
                удаляем побитые шашки методом Desk.removeFromDesk и апдейтим модель

        если isValid равен false
            возвращаем шашку на свое место
        если равен true
            перемещаем пешку на место to (методом Desk.makeStep) и апдейтим модель
        */
        const that = this,
            fromObj = that.getPosInArray(from), 
            toObj = that.getPosInArray(to);
        fromObj.range = that.model.paths[fromObj.row][fromObj.col];
        toObj.range = that.model.paths[toObj.row][toObj.col];

        let isValid = that.stepController.isValidStep(fromObj, toObj);
        
        if (isValid) {
            let hitChip;
            const isQueen = that.stepController.isQueen(fromObj);
            
            if (isQueen) { 
                hitChip =  that.stepController.getHitByQueen(fromObj, toObj); 
            } else {
                hitChip =  that.stepController.getHitByChip(fromObj, toObj); 
            }

            if (!hitChip) {
                if (!isQueen && that.stepController.isFar(fromObj, toObj)) {
                    isValid = false;
                }
            } else {
                that.model.paths[hitChip.row][hitChip.col] = 0;
                that.model.hitsChips[hitChip.range].push(null);
                that.view.desk.hits = that.model.hitsChips;
                that.view.desk.removeFromDesk(hitChip.name, hitChip.range);
            }
        }

        if (!isValid) {
            toObj.row = fromObj.row;
            toObj.col = fromObj.col;
        } else {
            that.model.paths[fromObj.row][fromObj.col] = 0;
            that.model.paths[toObj.row][toObj.col] = fromObj.range;
        }

        this.view.desk.makeStep(fromObj.row + '_' + fromObj.col, toObj.row + '_' + toObj.col);
        console.log( that.model.hitsChips, that.model.paths );
    }

    // makeStep(from, to) {
    //     const that = this,
    //         fromObj = that.getPosInArray(from), 
    //         toObj = that.getPosInArray(to);
    //     fromObj.range = that.model.paths[fromObj.row][fromObj.col];
    //     toObj.range = that.model.paths[toObj.row][toObj.col];

    //     if (that.stepController.isValidStep(fromObj, toObj)) {
    //         that.model.paths[fromObj.row][fromObj.col] = 0;

    //         if (this.stepController.detectQueen(fromObj, toObj)) {
    //             fromObj.range = +(fromObj.range + '' + fromObj.range);
    //         }

    //         that.model.paths[toObj.row][toObj.col] = fromObj.range;
    //       //  console.log( that.model.paths );
    //     } else {
    //         toObj.row = fromObj.row;
    //         toObj.col = fromObj.col;
    //     }
    //     this.view.desk.hits = this.model.hitsChips;
    //     this.view.desk.makeStep(fromObj.row + '_' + fromObj.col, toObj.row + '_' + toObj.col, Object.assign({}, this.hitsChips));
    //     this.hitsChips = null;
    // }
}
