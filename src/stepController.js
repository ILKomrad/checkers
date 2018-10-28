export default class StepController {
    constructor(model) {
        this.model = model;
    }

    isValidStep(from, to) {
        if (!this.checkDelta(from, to)) { return; }
        
        if (!this.checkCellColor(to)) { return; }
       
        if (this.isBusy(to)) { return; } 
    
        return true;
    }

    detectQueen(fromObj, toObj) {
        //for white chips (range == 1) finish is row == 0, for black row == 7
        if (((fromObj.range === 1) && (toObj.row === 0)) ||
            ((fromObj.range === 2) && (toObj.row === 7))) {
                return true;
        } 
    }

    isQueen(from) {
        const range = this.model.paths[from.row][from.col];

        if ((range === 11) || (range === 22)) {
            return true;
        }
    }

    checkDelta(from, to) {
        return ((from.row !== to.row) && (from.col !== to.col));
    }

    checkCellColor(cell) {
        return (this.model.cells[cell.row][cell.col] !== 'w');
    }

    isBusy(cell) {
        let chip = this.model.paths[cell.row][cell.col];
        
        return (chip !== 0);
    }

    isFar(from, to) {
        const that = this,
            fromObj = Object.assign({}, from, {range: that.model.paths[from.row][from.col]});

        if ((fromObj.range === 2) && ((to.row - fromObj.row) === 1) && (Math.abs(to.col - fromObj.col) === 1)) { return; }

        if ((fromObj.range === 1) && ((to.row - fromObj.row) === -1) && (Math.abs(to.col - fromObj.col) === 1)) { return; }

        return true;
    }

    getHitByQueen(from, to) {
        let maxRowObj, minRowObj, hitsChips = [], directionCol = 1;

        if (from.row > to.row) {
            maxRowObj = from;
            minRowObj = to;
        } else {
            maxRowObj = to;
            minRowObj = from;
        }

        if (minRowObj.col > maxRowObj.col) {
            directionCol = -1;
        }

        for (let row = (minRowObj.row + 1), col = minRowObj.col, colIndex = 1; row < maxRowObj.row; row++) {
            col += colIndex * directionCol;
            const range = this.model.paths[row][col];
          
            if (range !== 0) {
                hitsChips.push({name: row + '_' + col, range: range, col, row});
            }
        }

        return hitsChips;
    }

    chechSimilarRange(range, list) {
        let similar,
            r = this.transformRange(range);

        list.forEach(i => {
            if (this.transformRange(i.range) === r) {
                similar = true;
            }
        });

        return similar;
    }

    getHitByChip(from, to) {
        const hitsChips = [];

        if ((Math.abs(to.row - from.row) === 2) && (Math.abs(to.col - from.col) === 2)) {
            let row = (to.row + from.row) / 2,
                col = (to.col + from.col) / 2,
                range = this.model.paths[row][col];

            if (range !== 0) {
                hitsChips.push({name: row + '_' + col, range: range, col, row});
            }
        }

        return hitsChips;
    }

    getHitChip(fromObj, toObj, isQueen) {
        let hitChip;

        if (isQueen) { 
            hitChip =  this.getHitByQueen(fromObj, toObj); 
        } else {
            hitChip =  this.getHitByChip(fromObj, toObj); 
        }

        return hitChip;
    }

    //for queen 
    transformRange(range) {
        let r = range;

        if (r === 11) {
            r = 1;
        } else if (r === 22) {
            r = 2;
        }

        return r;
    }
}