import Common from './common';
import Settings from './settings';

export default class Animator {
    constructor() {
        this.common = new Common();
        this.settings = new Settings();
    }

    animationMove(pos, c, clbck) {
        let from = c.getPosition();

        this.common.makePromise(function(res) {
            let to = {x: from.x, y: from.y + 2.5, z: from.z}
            const tween = new TWEEN.Tween(from)
                .to(to, 500)
                .easing(TWEEN.Easing.Quadratic.Out)
                .onUpdate(() => {
                    c.moveTo(from.x, from.y, from.z);
                })
                .onComplete(() => {
                    res();
                })
                .start();
        })
        .then(() => {
            return this.common.makePromise(function(res) {
                let to = {x: pos.x, y: pos.y + 2.5, z: pos.z}
                const tween = new TWEEN.Tween(from)
                    .to(to, 1000)
                    .easing(TWEEN.Easing.Quadratic.Out)
                    .onUpdate(() => {
                        c.moveTo(from.x, from.y, from.z);
                    })
                    .onComplete(() => {
                        res();
                    })
                    .start();
            })
        })
        .then(() => {
            return this.common.makePromise(function(res) {
                let to = {x: pos.x, y: pos.y, z: pos.z}
                const tween = new TWEEN.Tween(from)
                    .to(to, 500)
                    .easing(TWEEN.Easing.Quadratic.Out)
                    .onUpdate(() => {
                        c.moveTo(from.x, from.y, from.z);
                    })
                    .onComplete(() => {
                        c.moveTo(pos.x, pos.y, pos.z);
                        res();

                        if (clbck) {
                            clbck();
                        }
                    })
                    .start();
            })
        })
    }

    rotateChip(obj, angle) {
        return this.common.makePromise((r) => {
            const from = {x: obj.rotation.x},
                to = {x: angle},
                tween = new TWEEN.Tween(from);
            tween.to(to, 500)
            .easing(TWEEN.Easing.Quadratic.Out)
            .onUpdate(() => {
                obj.rotation.x = from.x;
                let pers = from.x / to.x;

                if (pers < 0.5) {
                    obj.position.y = (pers / 0.5) * 4;
                } else {
                    obj.position.y = 5 - ((pers - 0.5) / 0.5) * 4;
                }
            })
            .onComplete(() => {
                obj.position.y = 1;
                r();
            })
            .start();
        });
    }

    zoomToObject(camera, controls, pos) {
        return this.common.makePromise((r) => {
            this.common.makePromise((res) => {
                const from = {x: 0, y: 0, z: 0},
                    to = {x: pos.x, y: pos.y, z: pos.z},
                    tween = new TWEEN.Tween(from);
    
                tween.to(to, 500)
                .easing(TWEEN.Easing.Quadratic.Out)
                .onUpdate(() => {
                    controls.target.set(from.x, from.y, from.z);
                })
                .onComplete(() => {
                    res();
                })
                .start();
            }).then(() => {
                const from = {zoom: camera.zoom},
                    to = {zoom: this.settings.zoomFar},
                    tween = new TWEEN.Tween(from);

                tween.to(to, 500)
                .easing(TWEEN.Easing.Quadratic.Out)
                .onUpdate(() => {
                    camera.zoom = from.zoom;
                    camera.updateProjectionMatrix();
                })
                .onComplete(() => {
                    r();
                })
                .start();
            });
        });
    }

    unzoomToObject(camera, controls, pos) {
        return this.common.makePromise((r) => {
            this.common.makePromise((res) => {
                const from = {zoom: this.settings.zoomFar},
                    to = {zoom: 1},
                    tween = new TWEEN.Tween(from);

                tween.to(to, 500)
                .easing(TWEEN.Easing.Quadratic.Out)
                .onUpdate(() => {
                    camera.zoom = from.zoom;
                    camera.updateProjectionMatrix();
                })
                .onComplete(() => {
                    res();
                })
                .start();
            }).then(() => {
                const from = {x: pos.x, y: pos.y, z: pos.z},
                    to = {x: 0, y: 0, z: 0},
                    tween = new TWEEN.Tween(from);
    
                tween.to(to, 500)
                .easing(TWEEN.Easing.Quadratic.Out)
                .onUpdate(() => {
                    controls.target.set(from.x, from.y, from.z);
                })
                .onComplete(() => {
                    r();
                })
                .start();
            });
        });
    }
}