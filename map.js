import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';

// Import Mapbox as an ESM module
import mapboxgl from 'https://cdn.jsdelivr.net/npm/mapbox-gl@2.15.0/+esm';


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

// Log map load event
map.on('load', async () => {
  console.log('Map has been loaded successfully');
});

map.addSource('boston-route', {
  type: 'geojson',
  data: 'https://bostonopendata-boston.opendata.arcgis.com/datasets/boston::existing-bike-network-2022.geojson',
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

map.addSource('cambridge-route', {
  type: 'geojson',
  data: 'https://opendata.cambridgema.gov/api/geospatial/0381a9b6-86b4-4939-a9d5-c39092a1a41b?method=export&format=GeoJSON',
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
