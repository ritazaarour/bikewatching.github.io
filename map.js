// Import Mapbox as an ESM module
import mapboxgl from 'https://cdn.jsdelivr.net/npm/mapbox-gl@2.15.0/+esm';
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';


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

function getCoords(station) {
  const point = new mapboxgl.LngLat(+station.Lon, +station.Lat); // Convert lon/lat to Mapbox LngLat
  const { x, y } = map.project(point); // Project to pixel coordinates
  return { cx: x, cy: y }; // Return as object for use in SVG attributes
}

// Log map load event
map.on('load', async () => {
  console.log('Map loaded, adding layers now...');

  // Boston bike lanes
  map.addSource('boston-route', {
    type: 'geojson',
    data: 'data/boston_bike_route.geojson',
  });

  map.addLayer({
    id: 'bike-lanes',
    type: 'line',
    source: 'boston-route',
    paint: {
      'line-color': '#5fae52',
      'line-width': 3,
      'line-opacity': 0.6
    }
  });

  // Cambridge bike lanes
  map.addSource('cambridge-route', {
    type: 'geojson',
    data: 'data/cambridge_bike_route.geojson',
  });

  map.addLayer({
    id: 'cambridge-bike-lanes',
    type: 'line',
    source: 'cambridge-route',
    paint: {
      'line-color': '#5fae52',
      'line-width': 3,
      'line-opacity': 0.6
    }
  });

  let stations = [];
  let jsonData;
  try {
    const jsonurl = 'https://dsc106.com/labs/lab07/data/bluebikes-stations.json';

    jsonData = await d3.json(jsonurl);
    console.log('Loaded JSON Data:', jsonData);

    stations = jsonData.data.stations;
    console.log('Stations Array:', stations);

  } catch (error) {
    console.error('Error loading JSON:', error);
  }

  const svg = d3.select('#map').select('svg');

  const circles = svg
    .selectAll('circle')
    .data(stations)
    .enter()
    .append('circle')
    .attr('r', 5)
    .attr('fill', 'steelblue')
    .attr('stroke', 'white')
    .attr('stroke-width', 1)
    .attr('opacity', 0.8);

    function updatePositions() {
        circles
            .attr('cx', d => getCoords(d).cx)
            .attr('cy', d => getCoords(d).cy);
    }
    updatePositions(); 
    map.on('move', updatePositions);
    map.on('zoom', updatePositions);
    map.on('resize', updatePositions);
    map.on('moveend', updatePositions);

    try {
        const tripsUrl = 'https://dsc106.com/labs/lab07/data/bluebikes-traffic-2024-03.csv';

        const trips = await d3.csv(tripsUrl);
        console.log('Loaded Trips Data:', trips);

        const departures = d3.rollup(trips, v => v.length, d => d.start_station_id);
        const arrivals = d3.rollup(trips, v => v.length, d => d.end_station_id);
        
        stations.map((station) => {
            let id = station.Number;
            station.arrivals = arrivals.get(id) ?? 0;
            station.departures = departures.get(id) ?? 0;
            station.totalTraffic = station.arrivals + station.departures;
            return station;
        });

        console.log('Stations with Traffic Data:', stations);
        
        const validStations = stations.filter(d => d.totalTraffic !== undefined && !isNaN(d.totalTraffic));
        
        const radiusScale = d3.scaleSqrt()
            .domain([0, d3.max(validStations, d => d.totalTraffic)])
            .range([5, 20]);
        
        circles
            .attr('r', d => radiusScale(d.totalTraffic))
            .attr('fill', 'steelblue')
            .attr('fill-opacity', 0.6)
            .attr('stroke', 'white')
            .each(function (d) {
                // Add <title> for browser tooltips
                d3.select(this)
                    .append('title')
                    .text(
                        `${d.totalTraffic} trips (${d.departures} departures, ${d.arrivals} arrivals)`
                    );
            });

        updatePositions();

    } catch (error) {
        console.error('Error loading trips CSV:', error);
    }
});
