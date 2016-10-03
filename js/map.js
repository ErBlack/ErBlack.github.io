const X = 59.940448;
const Y = 30.29145;

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
    }, { preset: 'islands#redStretchyIcon' })
    );
});