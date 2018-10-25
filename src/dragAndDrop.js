export default class DragAndDrop {
    constructor (renderer, desk, mouse) {
        this.renderer = renderer;
        this.desk = desk;
        this.mouse = mouse;
    }

    start(obj, raycaster, onMove, onDrop) {
        const th = this;
        th.renderer.disableRotate();
        document.addEventListener('mousemove', drug);
        document.addEventListener('mouseup', drop);

        function drug(e) {
            th.mouse.setMousePosition(e);
            let i = th.mouse.getRegardingPosition(th.desk);
            
            if (i[0]) {
                obj.position.set(i[0].point.x, i[0].point.y + 2.5, i[0].point.z - 0.5);
            }

            e.preventDefault();
        }

        function drop(event) {
            if (onDrop) {
                const intersects = th.mouse.getIntersects(event);
                th.renderer.enableRotate();

                for (let item in intersects) {       
                    if (intersects[item].object.type === 'cell') {
                        onDrop(intersects[item].object.name)
                    }
                }
            }

            document.removeEventListener('mousemove', drug);
            document.removeEventListener('mouseup', drop);
        }
    }
}