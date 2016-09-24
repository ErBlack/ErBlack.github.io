const Timer = require('./timer');
const Ship = require('./ship');
const onDomReady = require('./ondomready'); 

require('../style.css');
require('../space.css');

onDomReady(function() {
    const start = new Date('2016-10-22T15:00:00.000Z');

    new Timer(document.querySelector('#date'), start);
    new Ship(document.querySelector('#ship'));
});