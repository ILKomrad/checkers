export default class Common {
    makePromise(func) {
        return new Promise((res, rej) => {
            func(res);
        });
    }
}