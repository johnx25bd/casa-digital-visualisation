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


mapboxgl.accessToken = 'pk.eyJ1Ijoicm9iaXNvbml2IiwiYSI6ImNqbjM5eXEwdjAyMnozcW9jMzdpbGk5emoifQ.Q_S2qL8UW-UyVLikG_KqQA';
var map = new mapboxgl.Map({
  container: 'main-map', // container id
  style: 'mapbox://styles/mapbox/streets-v11', // stylesheet location
  center: [-74.50, 40], // starting position [lng, lat]
  zoom: 9 // starting zoom
});

// var map = new mapboxgl.Map({
//   container: "main-map",
//   center: [37.8, -96.9],
//   zoom: 2
// });

// .addLayer(new L.TileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"));


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


  }).catch(function(e) {
    console.log(e);
  });
