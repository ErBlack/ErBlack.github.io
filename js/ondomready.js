const domReady = new Promise(function (resolve) {
    if (document.addEventListener) {
        document.addEventListener('DOMContentLoaded', resolve);
    } else {
        window.addEventListener('load', resolve);
    }
});

function errorHandler(e) {
    console.error(e);

    throw e;
}

module.exports = function onDomReady(cb) {
    domReady.then(cb).catch(errorHandler);
};