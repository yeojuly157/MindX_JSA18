const API_KEY = "pk.eyJ1IjoieWVvanVseSIsImEiOiJjbXJjYnU0NGEwMjRmMzBxMGl0MnpmNjhjIn0.k1eLux6LzKaziE0nFiuk3A";
const map = new mapboxgl.Map({
    accessToken: API_KEY,
    container: 'map',
    style: 'mapbox://styles/mapbox/standard',
    center: [105.8064288, 20.9791005],
    zoom: 17
});
const marker1 = new mapboxgl.Marker()
    .setLngLat([105.8064288, 20.9791005])
    .addTo(map);

