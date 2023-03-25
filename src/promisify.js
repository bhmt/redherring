export default function promisify(obj, name) {
    const fn = obj[name];
    return function () {
        return new Promise((resolve, reject) => {
            fn.call(obj, ...arguments, function () {
                const lastError = chrome.runtime.lastError;
                if (lastError instanceof Object) {
                    return reject(lastError.message);
                }
                resolve(...arguments);
            });
        });
    };
};
