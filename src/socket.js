export default class Socket {
    constructor() {
        this.data;
        this.serverAlive = false;
    }

    async open(userId) {
        console.log( userId )
        return new Promise((res, rej) => {
            this.socket = io('http://localhost:3000/');
            this.socket.emit('checkUser', JSON.stringify({id: userId}));
            this.socket.on('hello', (event) => {
                this.serverAlive = true;
                this.data = JSON.parse(event);
                this.cells = this.data.cells;
                this.paths = this.data.paths;
                res(this.data);
            });
            this.socket.on('noname_user', () => {
                document.cookie = "checkersUserId=";
                window.location = 'http://localhost:3000/';
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