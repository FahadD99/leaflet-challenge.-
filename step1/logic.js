// Function to determine marker size based on magnitude Thank you for all your help Dan on this homework
function markerSize(magnitude) {
  return magnitude * 10;
};

// Function to determine color based on magnitude
function getColor(m) {
	return m > 5  ? '#F03816' :
	       m > 4  ? '#EF8A07' :
	       m > 3  ? '#EFA820' :
	       m > 2  ? '#EFC300' :
	       m > 1  ? '#FFEF7A' :
	                '#A2EF73';
}

// Store dataset
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"

// Perform a GET request to the query URL
d3.json(queryUrl, (data) => {
  // create earthquakes layer using geoJSON
  var earthquakes = L.geoJSON(data, {
    // Create circle markers located at each earthquake site with varying radius size and color based on magnitude
    pointToLayer: function(feature, latlng) {
        return new L.CircleMarker(latlng, {
        	radius: markerSize(feature.properties.mag), 
          fillOpacity: 0.8,
          color: "black",
          weight: 0.5,
          fillColor: getColor(feature.properties.mag)
        });
    },
    // Include popups that provide additional information about the earthquake
    onEachFeature: function (feature, layer) {
        layer.bindPopup("<h3>" + feature.properties.place +
        "</h3><hr><p> Magnitude: " + feature.properties.mag + "</p>");
    }
  });

  // Define variables for our base layers
  var lightmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 22,
    id: "mapbox.light",
    accessToken: API_KEY
  });

  // Create a baseMaps object
  var baseMaps = {
    "Light Map": lightmap,
  };

  // Create an overlay object
  var overlayMaps = {
    "Earthquakes": earthquakes,
  };

  // Define a map object
  var myMap = L.map("map", {
    center: [50, -110],
    zoom: 4,
    layers: [lightmap, earthquakes]
  });
  
  // Create legend from seperate map layers to ensure placement and visibility
  var legend = L.control({position: 'bottomright'});

  legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend'),
    magnitudes = [0, 1, 2, 3, 4, 5],
    labels = [];
    // Loop through magnitude intervals and generate a label with a coloured square for each interval
    for (var i = 0; i < magnitudes.length; i++) {
      div.innerHTML +=
      '<i style="background:' + getColor(magnitudes[i] + 1) + '"></i> ' +
			magnitudes[i] + (magnitudes[i + 1] ? '&ndash;' + magnitudes[i + 1] + '<br>' : '+');
    }
    return div;
  };

  // Add legend to the map
  legend.addTo(myMap);

  // Pass map layers into layer control
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: true
  }).addTo(myMap);
});

