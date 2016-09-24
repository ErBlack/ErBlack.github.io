const INTERVALS = [1000, 60, 60, 24, 7];
const WEEKS = ['неделя', 'недели', 'недель'];
const DAYS= ['день', 'дня', 'дней'];
const HOURS = ['час', 'часа', 'часов'];
const MINUTES = ['минута', 'минуты', 'минут'];
const SECONDS= ['секунда', 'секунды', 'секунд'];

const pluralForm = require('./pluralForm');

module.exports = class Timer {
    constructor(elem, date) {
        this._elem = elem;
        this._date = date;
        
        this._iterate = this._iterate.bind(this);

        this._iterate();
    }

    /**
     * Выполняет проверку дат и выводит оставшееся время
     */
    _iterate() {
        let offset = this._offset();

        if (offset.direction !== 1) {
            return;
        }

        let result = ['Осталось'];

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
    _offset(from) {
        from = from || new Date();

        let offset = (this._date - from);
        let direction = offset > 0 ? 1 : offset < 0 ? -1 : 0;
        
        offset = Math.abs(offset);

        let result = INTERVALS.map(function (value) {
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
}
