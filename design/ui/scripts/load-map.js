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
  center: [50, 10], // starting position [lng, lat]
  zoom: 2 // starting zoom
});

// var map = new mapboxgl.Map({
//   container: "main-map",
//   center: [37.8, -96.9],
//   zoom: 2
// });

// .addLayer(new L.TileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"));


// LOAD LAYERS

// Load and organize all data
var dataFiles = ["./data/us-states.json", "./data/airports.json", "./data/countries.json", "./data/cards.json"],
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

    // Once all data is loaded, add to map
    map.on('load', function() {

      map.addSource("us-states", {
        "type": "geojson",
        "data": loadedData['us-states'].data
      });

      map.addSource("airports", {
        "type": "geojson",
        "data": loadedData['airports'].data
      });

      map.addSource("countries", {
        "type": "geojson",
        "data": loadedData['countries'].data
      });


      map.addLayer({
        "id": "us-states-polys",
        "type": "fill",
        "source": "us-states",
        'layout': {},
        'paint': {
          'fill-color': '#088',
          'fill-opacity': 0.8
        }
      });

      // map.addLayer({
      //   "id": "countries-polys",
      //   "type": "fill",
      //   "source": "countries",
      //   'layout': {},
      //   'paint': {
      //     'fill-color': '#088',
      //     'fill-opacity': 0.8
      //   }
      // });

      map.addLayer({
        "id": "points",
        "type": "circle",
        "source": "airports",
        "paint": {
          "circle-radius": [
            'match',
            ['get', 'type'],
            'small', 3,
            'mid', 5,
            'major', 9,
            // 'Hispanic', '#e55e5e',
            // 'Asian', '#3bb2d0',
            /* other */ 2
            ],
          "circle-color": [
            'match',
            ['get', 'type'],
            'small', '#fbb03b',
            'mid', '#223b53',
            'major', 'yellow',
            // 'Hispanic', '#e55e5e',
            // 'Asian', '#3bb2d0',
            /* other */ '#ccc'
            ]

        },
      });

      // LOAD CARDS
      loadCards(loadedData["cards"].data);
      //

    });


  }).catch(function(e) {
    console.log(e);
  });



  // Cards:
  /*
  Cards will have a number of attributes and methods, which
  will be read when the updateCard() function is called.

  content: "<h1></h1>" // html string, or object / array of html elements.
                          // ^^ easier but less flexible
                          // this would include d3 graphics ?
  layers: [... layer names, i.e. file names], // layers to load
  flyTo: {
      bearing: 0,
      center: [-0.15591514, 51.51830379],
      zoom: 15.5,
      pitch: 20 // for 3d effect
    },



  */


  function updateCard(card) {
    //

    // update card div content, or scroll to card.

    // map.flyTo(_card.flyTo)

    // updateLegend(_card.layers)

  }

  function updateLegend(layers) {
    // iterate through array of layers
    // Add each layer's legend to .legend div
  }


  function loadCards(cards) {
    // iterate through and load cards into .cards div

    cards.forEach(function (cardData) {


      console.log(cardData)
    });

    var cardsEls = d3.select('#cards').selectAll('.card')
      .data(cards).enter().append('p');

    cardsEls.text(function (d) {
        return d.title;
      })

  }
