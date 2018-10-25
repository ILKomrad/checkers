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

    updateHits(hitsChips) {
        this.hitsChips = hitsChips;
    }

    getPaths() {
        return this.paths;
    }

    getCells() {
        return this.cells;
    }
}