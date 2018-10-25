export default class StepController {
    constructor(model) {
        this.model = model;
    }

    isValidStep(from, to) {
        if (!this.checkDelta(from, to)) { return; }
        
        if (!this.checkCellColor(to)) { return; }
       
        if (this.isBusy(to)) { return; } 

        // const isQueen = this.isQueen(from);

        // if (isQueen) {
        //     this.detectQueenHitOpponent(from, to);
        // } else {
        //     this.detectChipHitOpponent(from, to);
        // }
        
        // if ((!this.hitsChips) && !isQueen) {
        //     if (this.isFar(from, to)) { return };
        // }
    
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
        let maxColObj, minColObj, hitsChips = [];

        if (from.col > to.col) {
            maxColObj = from;
            minColObj = to;
        } else {
            maxColObj = to;
            minColObj = from;
        }

        for (let z = (maxColObj.col - 1), rowIndex = 1; z > minColObj.col; z--) {
            let row = maxColObj.row + rowIndex,
                col = z,
                range = this.model.paths[row][col];

            if ((range !== 0) && (this.model.paths[from.row][from.col] !== +(range + '' + range))) {
                hitsChips.push({name: row + '_' + col, range: range, col, row});
            }
    
            rowIndex++;
        }

        if (hitsChips.length === 1) {
            return hitsChips[0];
        }
    }

    getHitByChip(from, to) {
        if ((Math.abs(to.row - from.row) === 2) && (Math.abs(to.col - from.col) === 2)) {
            let row = (to.row + from.row) / 2,
                col = (to.col + from.col) / 2,
                hitsChips,
                range = this.model.paths[row][col];

            if ((range !== from.range) && (range !== 0)) {
                hitsChips = {name: row + '_' + col, range: range, col, row};
                // this.model.paths[row][col] = 0;
                // this.model.hitsChips[range].push(null);
            }
            return hitsChips;
        }
    }
}