const Light = require('./light');
const onDomReady = require('./ondomready'); 

require('../style.css');

onDomReady(function() {
    new Light(document.querySelector('#light'));
});