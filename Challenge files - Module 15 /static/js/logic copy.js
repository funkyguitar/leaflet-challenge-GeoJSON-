let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })

  let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  }); 
  
  // Create a baseMaps object.
  let baseMaps = {
    "Street Map": street,
    "Topographic Map": topo
  };

  // Create an overlays object.
let earthquakes = new L.LayerGroup();

	var overlayMap = { 
		"Earthquakes": earthquakes
	}

  // Create a new map.
  // Edit the code to add the earthquake data to the layers.
  let myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [street, earthquakes]
  });

  // Create a layer control that contains our baseMaps.
  // Be sure to add an overlay Layer that contains the earthquake GeoJSON.
  L.control.layers(baseMaps, overlayMap, {
    collapsed: false
  }).addTo(myMap);

  let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson";

  d3.json(queryUrl).then(function (data) {
    console.log(data.features);

    function getValue(x) {
        return x > 90 ? "#E31A1C" :
               x > 70 ? "#FC4E2A" :
               x > 50 ? "#FD8D3C" :
               x > 30 ? "#FEB24C" :
               x > 10 ? "#FED976" :
                   "#FFEDA0";
    }
    

    function style(feature) {
        return {
            opacity: 1,
            fillOpacity: 1,
            fillColor: getValue(feature.geometry.coordinates[2]),
            color: "#000000",
            radius: feature.properties.mag * 3,
            stroke: true,
            weight: 0.5
        };
    }
    
        var dat = L.geoJson(data, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, style(feature));
        },
        onEachFeature: function (feature, layer) {
          layer.bindPopup(
            "Magnitude: "
            + feature.properties.mag
          );
        }
    });
    dat.addTo(earthquakes);

    earthquakes.addTo(myMap)

    var legend = L.control({ position: "bottomright" });
    legend.onAdd = function() {
      var div = L.DomUtil.create("div", "info legend");
      var limits = [-10, 10, 30, 50, 70, 90]
      var colors = ["#FFEDA0", "#FED976", "#FEB24C", "#FD8D3C", "#FC4E2A", "#E31A1C"]
  
      for (var i = 0; i < limits.length; i++) {
        console.log(colors[i]);
        div.innerHTML +=
          "<i style='background: " + colors[i] + "'></i> " +
          limits[i] + (limits[i + 1] ? "&ndash;" + limits[i + 1] + "<br>" : "+");
        }
        return div;
      };
    
    
      legend.addTo(myMap);
  





    })
