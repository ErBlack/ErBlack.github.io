ymaps.ready(function () {
    var map = new ymaps.Map("map", {
            center: ['60.028663', '30.406764'],
            zoom: 14
        }, {
            searchControlProvider: 'yandex#search'
        });

        map.geoObjects.add(new ymaps.GeoObject({
            geometry: {
                type: "Point",
                coordinates: ['60.028663', '30.406764']
            },
            properties: {
                iconContent: 'Тайм кафе Винегрет',
                hintContent: 'Начало в 18:00'
            }
        }, {
            preset: 'islands#redStretchyIcon',
        }));
});