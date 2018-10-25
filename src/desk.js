import Cell from './cell';
import Chip from './chip';
import Animator from './animator';

export default class Desk {
    constructor (renderer, settings) {
        this.renderer = renderer;
        this.settings = settings;
        this._chipsMeshs = [];
        this._cellsMeshs = [];
        this._animator = new Animator();
    }

    create(paths, cells) {
        this.paths = paths;
        this.cells = cells;
        this.createBorder();
        this.fillDesk();
    }

    makeStep(obj, to, hit) {
        this.movePiece(obj, to);

        //удалить
        if (hit && hit.name) {
            this.removeFromDesk(hit.name, hit.range);
        }
    }

    createBorder() {
        const bodyMaterial = new THREE.MeshBasicMaterial({
            //color: this.settings.desk.deskColor,
           // map: this.settings.treeTexture,
            transparent: true
        });
        const symGeometry = new THREE.PlaneGeometry(10, 10);
        this.border = new THREE.Mesh(new THREE.BoxGeometry(this.settings.desk.size.x, this.settings.desk.size.y, 3), bodyMaterial);
        this.border.position.y = this.settings.desk.pos.y - 1.5;
        this.border.rotation.x = -Math.PI / 2;
        this.border.name = 'desk';
        this.border.receiveShadow = true;
        this.renderer.addToScene(this.border);

        const faceMaterial = new THREE.MeshBasicMaterial({
            color: 0x512d17,
            transparent: true
        });
        const face = new THREE.Mesh(new THREE.PlaneGeometry(this.settings.desk.size.x - 8, this.settings.desk.size.y - 8), faceMaterial);
        face.position.y = this.settings.desk.pos.y + 0.6;
        face.rotation.x = -Math.PI / 2;
        face.name = 'borderFace';
        this.renderer.addToScene(face);
    }

    fillDesk() {
        let z = 35;
        for (let t = 0; t < this.cells.length; t++) {
            let x = 35;

            for (let c = 0; c < this.cells[t].length; c++) {
                this.addCell(x, z, c, t, this.cells[t][c]);
                this.addChip(x, z, c, t, this.paths[t][c]);
                x -= 10;
            }
            z -= 10;
        }
    }

    addChip(x, z, col, row, range) {
        if (range !== 0) {
            const chip = new Chip(row + '_' + col, this.settings, range);
            chip.moveTo(x, 0, z);
            this.renderer.addToScene(chip.mesh);
            this._chipsMeshs.push(chip);
        }
    }

    addCell(x, z, col, row, color) {        
        const cell = new Cell(this.settings.cellsColors[color], this.settings.treeTextureSmall, col, row, color);
        cell.setPosition(x, 0, z);
        this.renderer.addToScene(cell.mesh);
        this._cellsMeshs.push(cell);
    }

    findCell(name) {
        let cell;
        this._cellsMeshs.forEach(c => {
            if (name === c.mesh.name) {
                cell = c;
            }
        });
        return cell;
    }

    findChip(name) {
        let chip;
        this._chipsMeshs.forEach(c => {
            if ((name === c.mesh.name) && (!c.mesh.hit)) {
                chip = c;
            }
        });
        return chip;
    }

    movePiece(pieceName, cellName, anim) {
        let chipMesh = this.findChip(pieceName);
        
        if (chipMesh) {
            let cellTo = this.findCell(cellName),
                pos = cellTo.getPosition();

            if (anim) {
                this._animator.animationMove(pos, chipMesh, clbck);
            } else {
                if ((chipMesh.getRange() === 22) || (chipMesh.getRange() === 11)) {
                    chipMesh.moveTo(pos.x, pos.y + 1, pos.z);
                } else {
                    chipMesh.moveTo(pos.x, pos.y, pos.z);
                }
            }
            chipMesh.mesh.name = cellName;
        }
    }
    
    removeFromDesk(name, range) {
        const that = this,
            place = that.settings.hitsChipsPlaces,
            chipMesh = that.findChip(name),
            pos = Object.assign({}, place[range], {
                x: place[range].x + (that.hits[range].length - 1) * that.settings.cellSize.x
            });

        that._animator.animationMove(pos, chipMesh);
        chipMesh.mesh.name = '';
        chipMesh.mesh.hit = true;
    }
}