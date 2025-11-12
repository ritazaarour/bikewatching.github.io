// Import Mapbox as an ESM module
import mapboxgl from 'https://cdn.jsdelivr.net/npm/mapbox-gl@2.15.0/+esm';

// Check that Mapbox GL JS is loaded
console.log('Mapbox GL JS Loaded:', mapboxgl);

// access token 
mapboxgl.accessToken = 'pk.eyJ1Ijoicml0YXphYXJvdXIiLCJhIjoiY21odTQ2enBnMHFkcTJxcHZrbThoZGRkcCJ9.xqsjHK2wczZ7Cwpy4fvO7w';

// Initialize the map
const map = new mapboxgl.Map({
  container: 'map', // ID of the div where the map will render
  style: 'mapbox://styles/mapbox/light-v11', // Map style
  center: [-71.09415, 42.36027], // [longitude, latitude]
  zoom: 12, // Initial zoom level
  minZoom: 5, // Minimum allowed zoom
  maxZoom: 18, // Maximum allowed zoom
});

map.addSource('boston-route', {
  type: 'geojson',
  data: 'data/boston_bike_route.geojson',
});

map.addSource('cambridge-route', {
  type: 'geojson',
  data: 'data/cambridge_bike_route.geojson',
});

map.addLayer({
    id: 'bike-lanes',
    type: 'line',
    source: 'boston-route',
    paint: {
        'line-color': '#5fae52',
        'line-width': 3,
        'line-opacity': 0.4,
    },
});

map.addLayer({
    id: 'cambridge-bike-lanes',
    type: 'line',
    source: 'cambridge-route',
    paint: {
        'line-color': '#5fae52',
        'line-width': 3,
        'line-opacity': 0.4,
    },
});

// Log map load event
map.on('load', async () => {
  console.log('Map has been loaded successfully');
});