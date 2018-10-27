export default class Socket {
    constructor() {
        this.data;
        this.serverAlive = false;
    }

    async open() {
        return new Promise((res, rej) => {
            this.socket = io('http://localhost:3000/');
            this.socket.on('hello', (data) => {
                this.serverAlive = true;
                this.data = data;
                this.cells = this.data.cells;
                this.paths = this.data.paths;
                res(data);
            });
        })
    }

    async emit(event, obj) {
        return new Promise(res => {
            this.socket.emit(event, obj);
            res();
        })
    }
}