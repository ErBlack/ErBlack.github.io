require('../light.css');

module.exports = class Light {
    constructor(elem) {
        this._elem = elem;

        this._onMouseMove = this._onMouseMove.bind(this);

        document.addEventListener('mousemove', this._onMouseMove);
    }

    _onMouseMove(e) {
        this._elem.style.left = e.clientX + 'px';
        this._elem.style.top = e.clientY + 'px';
    }
};
