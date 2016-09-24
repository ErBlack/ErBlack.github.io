require('../hyperspace.css');

module.exports = class Ship {
    constructor(elem) {
        this._elem = elem;

        this._onMouseDown = this._onMouseDown.bind(this);
        this._onMouseUp = this._onMouseUp.bind(this);

        this._elem.addEventListener('mousedown', this._onMouseDown);
        this._elem.addEventListener('mouseup', this._onMouseDown);
    }

    _onMouseDown() {
        clearTimeout(this._timer);

        this._timer = setTimeout(function() {
            document.body.classList.add('hyperspace');
        }, 16000);
    }

    _onMouseUp() {
        clearTimeout(this._timer);
    }
};