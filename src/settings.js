//2 - red, 1 - white
class Settings {
    constructor() {
        const th = this;
        this.textures = {};
        this.textures['chip'] = 'assets/models/piece.js';
        this.geom = {};
        this.cellsColors = {
            'w': 0xe9bb6e,
            'b': 0x512d17
        };
        this.chipsColors = {
            1: 0xffffff,
            11: 0xffffff,
            2: 'red',
            22: 'red'
        };
        this.zoomFar = 7;
        this.treeTexture = new THREE.TextureLoader().load( 'assets/floor-wood.jpg' );
        this.treeTextureSmall = new THREE.TextureLoader().load( 'assets/floor-wood-small.jpg' );
        this.cellSize = {x: 10, y: 10};
        this.desk = {
            size: {
                x: 90,
                y: 90
            },
            pos: {
                x: 0,
                y:  -0.9,
                z: 0
            },
            deskColor: 0xe3b96d
        };
        this.hitsChipsPlaces = {
            1: {x: -(th.desk.size.x / 2) + th.cellSize.x / 2, y: th.desk.pos.y, z: (th.desk.size.y / 2) + th.cellSize.y * 0.75},
            11: {x: -(th.desk.size.x / 2) + th.cellSize.x / 2, y: th.desk.pos.y, z: (th.desk.size.y / 2) + th.cellSize.y * 0.75},
            2: {x: (th.desk.size.x / 2) - th.cellSize.x / 2, y: th.desk.pos.y, z: -(th.desk.size.y / 2) - th.cellSize.y * 0.75},
            22: {x: (th.desk.size.x / 2) - th.cellSize.x / 2, y: th.desk.pos.y, z: -(th.desk.size.y / 2) - th.cellSize.y * 0.75}
        }
    }

    loadFromTo(from, to) {
        const loader = new THREE.JSONLoader();

        return new Promise((res, rej) => {
            for (let z in from) {
                loader.load(from[z], function (geometry) {
                    to[z] = geometry;
                    return res();
                });
            }
        })
    }

    waitLoadData() {
        return Promise.all([
            this.loadFromTo(this.textures, this.geom)
        ])
    }
}

export default Settings;