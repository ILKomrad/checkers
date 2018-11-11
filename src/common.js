export default class Common {
    makePromise(func) {
        return new Promise((res, rej) => {
            func(res);
        });
    }

    getCookie(name) {
        var matches = document.cookie.match(new RegExp(
          "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
        ));
        
        return matches ? decodeURIComponent(matches[1]) : undefined;
    }
}