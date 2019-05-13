// SOURCES
// https://docs.mapbox.com/mapbox-gl-js/example/scroll-fly-to/

// Globals

var dims = {
  h: window.innerHeight,
  w: window.innerWidth
}

var activeCardNum = null;
var inAnimation = false;

// Instantiate map:
mapboxgl.accessToken = 'pk.eyJ1Ijoicm9iaXNvbml2IiwiYSI6ImNqbjM5eXEwdjAyMnozcW9jMzdpbGk5emoifQ.Q_S2qL8UW-UyVLikG_KqQA';
var map = new mapboxgl.Map({
  container: 'main-map', // container id
  style: 'mapbox://styles/mapbox/streets-v11', // stylesheet location
  center: [50, 10], // starting position [lng, lat]
  zoom: 2 // starting zoom
});

map.addControl(new mapboxgl.ScaleControl({
  maxWidth: 100
}));
map.addControl(new mapboxgl.NavigationControl());
// map.addControl(new mapboxgl.ScaleControl({position: 'bottom-right'}));

var cardData = [],
  loadedData = {};

// LOAD LAYERS

// Load and organize all data
d3.json('./data/layers.json')
  .then(function(layersData) {

    var dataPromises = [];


    layersData.forEach(function(layerData) {
      if (layerData.type != "mapbox") {
        var filename = layerData.path;
        var filetype = filename.split('.'),
          filetype = filetype[filetype.length - 1];
        if (filetype == "csv") {
          dataPromises.push(d3.csv(filename));
        } else if (filetype == "json") {
          dataPromises.push(d3.json(filename));
        } else {
          console.log("Error with file", filename,
            ". Please pass a valid file to load.");
        }
      } else {
        var mapboxPromise = new Promise(function(resolve, reject) {
          resolve(layerData);
        })
        dataPromises.push(mapboxPromise)
      }

    });



    Promise.all(dataPromises)
      .then(function(values) {
        console.log('-_-------___-----___------__-------------_----')
        // console.log(layersData)
        console.log(values)

        for (var i = 0; i < values.length; i++) {
          // console.log(i);
          console.log(values[i]);
          if (layersData[i].name === 'cards') {
            cardData = values[i];
            console.log("includes cards", values[i]);
          } else if (values[i].type === 'mapbox') {
            console.log(values[i]);
            loadedData[values[i].name] = {
              filetype: "mapbox",
              data: layersData[i]
            }
          } else { // all other types
            filename = layersData[i].path;

            var filetype = layersData[i].path.split('.'),
              filekey = layersData[i].name;

            // filekey = filekey[filekey.length - 1]; // should be file name ...
            filetype = filetype[filetype.length - 1];

            loadedData[filekey] = {
              filetype: filetype,
              data: values[i]
            };
          }
        }

        // layersData = layersData.slice(1, layersData.length);
        // console.log('slice', layersData.slice(1, layersData.length));
        // console.log(layersData);

        // Once all data is loaded, add to map
        map.on('load', function() {
          layersData.forEach(function(layerData) {
            console.log(layerData);
            if (layerData.name != "cards") {
              var dataKey = layerData.name;
              if (layerData.type == "geojson") {
                map.addSource(dataKey + '-source', {
                  "type": "geojson",
                  "data": loadedData[dataKey].data
                });
              }

              map.addLayer(buildAddLayerParams(layerData));

            }
          });

          // LOAD CARDS
          loadCards(cardData);
          setActiveCard(0);
        });
      }).catch(function(e) {
        console.log(e);
      });
  })
  .catch(function(e) {
    console.log(e);
  });



// EVENT LISTENERS
window.onscroll = function() {
  for (var i = 0; i < cardData.length; i++) {
    if (isElementOnScreen(i) && inAnimation == false) {
      setActiveCard(i);
      break;
    }
  }
};


$('#next-card').on('click', function(e) {
  e.preventDefault();
  if (activeCardNum < cardData.length) {
    setActiveCard(activeCardNum + 1);
  }

})

$('#previous-card').on('click', function(e) {
  e.preventDefault();
  console.log("Previous", activeCardNum);
  if (activeCardNum > 0) {
    setActiveCard(activeCardNum - 1);
    scrollToCard(cardNum);

  }

})



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
