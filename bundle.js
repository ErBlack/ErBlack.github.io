/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Timer = __webpack_require__(1);
	var Ship = __webpack_require__(3);
	var onDomReady = __webpack_require__(8);

	__webpack_require__(9);

	__webpack_require__(10);
	__webpack_require__(16);

	onDomReady(function () {
	    var start = new Date('2016-10-22T15:00:00.000Z');

	    new Timer(document.querySelector('#date'), start);
	    new Ship(document.querySelector('#ship'));
	});

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var INTERVALS = [1000, 60, 60, 24, 7];
	var WEEKS = ['неделя', 'недели', 'недель'];
	var DAYS = ['день', 'дня', 'дней'];
	var HOURS = ['час', 'часа', 'часов'];
	var MINUTES = ['минута', 'минуты', 'минут'];
	var SECONDS = ['секунда', 'секунды', 'секунд'];

	var pluralForm = __webpack_require__(2);

	module.exports = function () {
	    function Timer(elem, date) {
	        _classCallCheck(this, Timer);

	        this._elem = elem;
	        this._date = date;

	        this._iterate = this._iterate.bind(this);

	        this._iterate();
	    }

	    /**
	     * Выполняет проверку дат и выводит оставшееся время
	     */


	    _createClass(Timer, [{
	        key: '_iterate',
	        value: function _iterate() {
	            var offset = this._offset();

	            if (offset.direction !== 1) {
	                return;
	            }

	            var result = ['Осталось'];

	            if (offset.weeks) {
	                result.push(offset.weeks, pluralForm(offset.weeks, WEEKS));
	            }
	            if (offset.days) {
	                result.push(offset.days, pluralForm(offset.days, DAYS));
	            }
	            if (offset.hours) {
	                result.push(offset.hours, pluralForm(offset.hours, HOURS));
	            }
	            if (offset.minutes) {
	                result.push(offset.minutes, pluralForm(offset.minutes, MINUTES));
	            }
	            if (offset.seconds) {
	                result.push(offset.seconds, pluralForm(offset.seconds, SECONDS));
	            }

	            this._elem.innerHTML = result.join(' ');

	            this._timeout = setTimeout(this._iterate, 1000);
	        }

	        /**
	         * Вычисляет расстояние между датами
	         * @param {Date} [from]
	         * @returns {Object}
	         */

	    }, {
	        key: '_offset',
	        value: function _offset(from) {
	            from = from || new Date();

	            var offset = this._date - from;
	            var direction = offset > 0 ? 1 : offset < 0 ? -1 : 0;

	            offset = Math.abs(offset);

	            var result = INTERVALS.map(function (value) {
	                var result = offset % value;

	                offset = (offset - result) / value;

	                return result;
	            });

	            return {
	                milliseconds: result[0],
	                seconds: result[1],
	                minutes: result[2],
	                hours: result[3],
	                days: result[4],
	                weeks: offset,
	                direction: direction
	            };
	        }
	    }]);

	    return Timer;
	}();

/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";

	module.exports = function pluralForm(n, f) {
	    n %= 100;
	    if (n > 10 && n < 20) {
	        return f[2];
	    }

	    n %= 10;

	    return f[n > 1 && n < 5 ? 1 : n == 1 ? 0 : 2];
	};

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	__webpack_require__(4);

	module.exports = function () {
	    function Ship(elem) {
	        _classCallCheck(this, Ship);

	        this._elem = elem;

	        this._onClick = this._onClick.bind(this);

	        this._elem.addEventListener('click', this._onClick);
	    }

	    _createClass(Ship, [{
	        key: '_onClick',
	        value: function _onClick(e) {
	            e.preventDefault();
	            e.stopImmediatePropagation();

	            this._counter += 1;

	            clearTimeout(this._timeout);

	            if (this._counter === 28) {
	                document.body.classList.add('hyperspace');

	                this._counter = 0;
	            } else {
	                this._timeout = setTimeout(function () {
	                    this._counter = 0;
	                }.bind(this), 10000);
	            }
	        }
	    }, {
	        key: '_counter',
	        get: function get() {
	            return Number(this._elem.dataset.counter);
	        },
	        set: function set(value) {
	            this._elem.dataset.counter = value;
	        }
	    }]);

	    return Ship;
	}();

/***/ },
/* 4 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 5 */,
/* 6 */,
/* 7 */,
/* 8 */
/***/ function(module, exports) {

	'use strict';

	var domReady = new Promise(function (resolve) {
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

/***/ },
/* 9 */
/***/ function(module, exports) {

	'use strict';

	var X = 59.940448;
	var Y = 30.29145;

	ymaps.ready(function () {
	    var map = new ymaps.Map('map', {
	        center: [X, Y],
	        zoom: 15,
	        controls: ['zoomControl', 'typeSelector']
	    });

	    map.geoObjects.add(new ymaps.GeoObject({
	        geometry: {
	            type: "Point",
	            coordinates: [X, Y]
	        },
	        properties: {
	            iconContent: 'Свободное время',
	            hintContent: 'Начало в 18:00'
	        }
	    }, { preset: 'islands#redStretchyIcon' }));
	});

/***/ },
/* 10 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 11 */,
/* 12 */,
/* 13 */,
/* 14 */,
/* 15 */,
/* 16 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ }
/******/ ]);