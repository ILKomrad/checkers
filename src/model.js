export default class Model {
    constructor() {
        this.paths = [];
        this.cells = [];
        this.hitsChips;
    }

    updateCells(cells) {
        this.cells = cells;
    }

    updatePaths(paths) {
        this.paths = paths;
    }

    updatePath(row, col, val) {
        this.paths[row][col] = val;
    }

    addHitChip(range) {        
        this.hitsChips[range].push(null);
    }

    updateHits(hitsChips) {
        this.hitsChips = hitsChips;
    }

    getPaths() {
        return this.paths;
    }

    getCells() {
        return this.cells;
    }

    getHits() {
        return this.hitsChips;
    }

    getRange(row, col) {
        return this.paths[row][col];
    }
}