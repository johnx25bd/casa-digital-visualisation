// var mapLeaflet = L.map('L-map').setView([51,505, -0.09], 13)
//
// L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
//     attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
//     maxZoom: 18,
//     id: 'mapbox.streets',
//     accessToken: 'pk.eyJ1Ijoicm9iaXNvbml2IiwiYSI6ImNqbjM5eXEwdjAyMnozcW9jMzdpbGk5emoifQ.Q_S2qL8UW-UyVLikG_KqQA'
// }).addTo(mapLeaflet);


// Globals

var dims = {
  h: window.innerHeight,
  w: window.innerWidth
}

var transform = d3.geoTransform({
    point: projectPoint
  }),

  path = d3.geoPath().projection(transform);

// what about projection?



// https://bost.ocks.org/mike/leaflet/

var map = new L.Map("main-map", {
    center: [37.8, -96.9],
    zoom: 2
  })
  .addLayer(new L.TileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"));


// Load and organize all data
var dataFiles = ["./data/us-states.json", "./data/airports.csv", "./data/countries.json"],
  dataPromises = [],
  loadedData = {};

dataFiles.forEach(function(filename) {

  var filetype = filename.split('.'),
    filetype = filetype[filetype.length - 1];

  if (filetype == "csv") {
    dataPromises.push(d3.csv(filename));
  } else if (filetype == "json") {
    dataPromises.push(d3.json(filename));
  } else {
    console.log("Please pass a valid file to load.");
  }
});

Promise.all(dataPromises)
  .then(function(values) {

    for (var i = 0; i < values.length; i++) {
      filename = dataFiles[i];

      var filetype = filename.split('.'),
        filekey = filetype[1].split('/');

      filekey = filekey[filekey.length - 1]; // should be file name ...
      filetype = filetype[filetype.length - 1];

      // possibly - have to solve typecasting to numbers for each file ...
      // if (filekey == 'airports') {
      //
      //   console.log(values[i].map(x => x.lon += x.lon; ))
      //
      //   //values[i] = values[i]
      // }
      loadedData[filekey] = {
        filetype: filetype,
        data: values[i]
      };
    }

    console.log("Data successfully loaded with Promise.all()!")

    loadPolygons(loadedData['us-states'].data, 'us-states');

    loadAirports(loadedData['airports'].data);

    loadPolygons(loadedData['countries'].data, 'countries')


  }).catch(function (e) {
    console.log(e);
  });

var svg = d3.select(map.getPanes().overlayPane).append("svg"),
  g = svg.append("g").attr("class", "leaflet-zoom-hide");




// Use Leaflet to implement a D3 geometric transformation.
function projectPoint(x, y) {
  var point = map.latLngToLayerPoint(new L.LatLng(y, x));
  this.stream.point(point.x, point.y);
}

function loadPolygons(collection, layer) {
  var geodata;
  if (collection.type == "FeatureCollection") {
    geodata = collection.features;
  } else if (collection.type == "GeometryCollection") {
    geodata = collection.geometries;
  }


  console.log(collection);
  var feature = g.append('g')
    .classed(layer + '-g', true)
  .selectAll("path")
    .data(geodata)
    .enter().append("path");

  map.on("moveend", reset);
  // from https://github.com/Leaflet/Leaflet/pull/3278
  reset();

  // Reposition the SVG to cover the features.
  function reset() {
    var bounds = path.bounds(collection),
      topLeft = bounds[0],
      bottomRight = bounds[1];

    console.log(topLeft, bottomRight);

    // svg.attr("width", bottomRight[0] - topLeft[0])
    //   .attr("height", bottomRight[1] - topLeft[1])
    //   .style("left", topLeft[0] + "px")
    //   .style("top", topLeft[1] + "px");

    svg.attr("width", dims.w)
      .attr("height", dims.h)
     .style("left", topLeft[0] + "px")
     .style("top", topLeft[1] + "px");

    g.attr("transform", "translate(" + -topLeft[0] + "," + -topLeft[1] + ")");

    feature.attr("d", path);
  }
}

function loadAirports (points) {

  var airports = g.append('g')
      .classed('airports-g', true)
    .selectAll('circle')
      .data(points)
      .enter().append('circle');

  airports
    .attr("cx", function(d) {
      return map.latLngToLayerPoint([d.lat, d.lon]).x;
    })
    .attr("cy", function(d) {
      return map.latLngToLayerPoint([d.lat, d.lon]).y;
    })
    .attr("r","5px")
    .style("fill","red");


    // from https://github.com/Leaflet/Leaflet/pull/3278
    reset();

    map.on("moveend", reset);
    // Reposition the SVG to cover the features.
    function reset() {
      var bounds = path.bounds(loadedData['us-states'].data),
        topLeft = bounds[0],
        bottomRight = bounds[1];

      console.log('xxx, ', bounds, topLeft, bottomRight);

      svg.attr("width", dims.w)
        .attr("height", dims.h)
       .style("left", topLeft[0] + "px")
       .style("top", topLeft[1] + "px");

      g.attr("transform", "translate(" + -topLeft[0] + "," + -topLeft[1] + ")");

      airports
      .attr("cx", function(d) {
        return map.latLngToLayerPoint([d.lat, d.lon]).x;
      })
      .attr("cy", function(d) {
        return map.latLngToLayerPoint([d.lat, d.lon]).y;
      });
    }
}
