require('../hyperspace.css');

module.exports = class Ship {
    constructor(elem) {
        this._elem = elem;

        this._onClick = this._onClick.bind(this);

        this._elem.addEventListener('click', this._onClick);
    }

    get _counter() {
        return Number(this._elem.dataset.counter);
    }

    set _counter(value) {
        this._elem.dataset.counter = value;
    }

    _onClick(e) {
        e.preventDefault();
        e.stopImmediatePropagation();

        this._counter += 1;

        clearTimeout(this._timeout);

        if (this._counter === 28) {
            document.body.classList.add('hyperspace');
        
            this._counter = 0;
        } else {
            this._timeout = setTimeout(function() {
                this._counter = 0;
            }.bind(this), 10000);
        }
    }
};