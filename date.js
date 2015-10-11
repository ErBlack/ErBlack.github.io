function initDate() {
    var start = new Date('2015-10-17T15:00:00.000Z');
    var elem = document.querySelector('#date');
    var timeout;
    
    function plural(n,f){n%=100;if(n>10&&n<20)return f[2];n%=10;return f[n>1&&n<5?1:n==1?0:2]}
    
    Object.defineProperty(Date.prototype, 'offset', {
        /**
         * Рассчитывает разницу между датами
         * @param Date from - дата для рассчета разницы (default NOW)
         * @return Object
         */
        value: function (from) {
            from = from || new Date();

            var direction = (from < this ? -1 : (from > this ? 1 : 0)),
                offset = direction && direction * (from - this),
                result;

            result = [1000, 60, 60, 24, 7].map(function (value) {
                var result = offset % value;

                offset = (offset - result) / value;

                return result;
            });

            result.push(offset, direction);

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
    });
    
    function iterate() {
        var offset = start.offset();
        var result = ['Осталось'];
        
        if (offset.days) {
            result.push(offset.days + ' ' + plural(offset.days, ['день', 'дня', 'дней']));
        }
        if (offset.hours) {
            result.push(offset.hours + ' ' + plural(offset.hours, ['час', 'часа', 'часов']));
        }
        if (offset.minutes) {
            result.push(offset.minutes + ' ' + plural(offset.minutes, ['минута', 'минуты', 'минут']));
        }
        if (offset.seconds) {
            result.push(offset.seconds + ' ' + plural(offset.seconds, ['секунда', 'секунды', 'секунд']));
        }
        
        elem.innerHTML = result.join(' ');
        
        offset--;
        timeout = setTimeout(iterate, 1000);
    }
    
    if (start.offset().direction < 0) {
        iterate();
    }
}

if ( document.addEventListener) {
    document.addEventListener('DOMContentLoaded', initDate);
} else {
    window.addEventListener( "load", initDate );
}