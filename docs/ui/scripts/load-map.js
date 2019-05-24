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
  style: 'mapbox://styles/mapbox/light-v10', // stylesheet location
  center: [50, 10], // starting position [lng, lat]
  zoom: 1
  // maxBounds: [[-180,-90], [180,90]]
});

map.addControl(new mapboxgl.NavigationControl(), 'top-left');
// map.addControl(new mapboxgl.ScaleControl(), 'bottom-left');
var scale = new mapboxgl.ScaleControl({
  maxWidth: 80,
  unit: 'imperial'
});
map.addControl(scale, 'bottom-left');


var popup = new mapboxgl.Popup({
  closeButton: false,
  closeOnClick: false,
  anchor: 'left'
});

var loadedData = {};

// LOAD LAYERS
// Load and organize all data
(function(_layersData) { // IIFE

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

      for (var i = 0; i < values.length; i++) {
        if (values[i].type === 'mapbox') {
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

      // Once all data is loaded, add to map
      map.on('load', function() {
        layersData.forEach(function(layerData) {
          // console.log(layerData);
          if (layerData.name != "cards") {
            var dataKey = layerData.name;
            if (layerData.type == "geojson") {

              map.addSource(dataKey + '-source', {
                "type": "geojson",
                "data": loadedData[dataKey].data
              });
            }

            map.addLayer(buildAddLayerParams(layerData), "country-label");

            if (layerData.tooltip) {
              map.on('mouseenter', layerData.name, function(e) {
                var tooltipContent = layerData.tooltip(e.features[0]);
                if (tooltipContent != undefined) {

                  // Change the cursor style as a UI indicator.
                  map.getCanvas().style.cursor = 'pointer';
                  // console.log(e);
                  var coordinates = e.lngLat;
                  var description = e.features[0].properties.description;

                  // Ensure that if the map is zoomed out such that multiple
                  // copies of the feature are visible, the popup appears
                  // over the copy being pointed to.
                  while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                    coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
                  }

                  // Populate the popup and set its coordinates
                  // based on the feature found.
                  popup.setLngLat(coordinates)
                    .setHTML(tooltipContent)
                    .addTo(map);
                  // show tooltipcontent
                }
              });

              map.on('mouseleave', layerData.name, function(e) {
                map.getCanvas().style.cursor = '';
                popup.remove();
              })
            }
            if (layerData.highlight) {
              map.on("mousemove", layerData.name, function(e) {

                  var features = map.queryRenderedFeatures(e.point);

                  var currentISO3 = features[0].properties.iso3;

                  var feature = features[0];

                  if (e.features.length > 0) {
                    // console.log("LAYREDATA>", layerData, currentISO3);
                      map.setFilter(layerData.name +'-highlighted', ['==', 'iso3', currentISO3]);
                  }
                  });

                      // When the mouse leaves the state-fill layer, update the feature state of the
                      // previously hovered feature.
              map.on("mouseleave", layerData.name, function() {

                  map.setFilter(layerData.name +'-highlighted', ['==', 'iso3', '']);
              });
            }
            map.on('click', layerData.name, function(e) {
              if (cardData[activeCardNum].updateFeature) {

                var targetLayers = cardData[activeCardNum].layers;

                var renderedFeatures = map.queryRenderedFeatures(e.point);

                var featureOfInterest = renderedFeatures.find(function(feature) {
                  return targetLayers.includes(feature.layer.id);
                })

                cardData[activeCardNum]
                  .updateFeature(featureOfInterest, e.lngLat);

              }
            });

          }
        });

        // LOAD CARDS
        loadCards(cardData);
        setActiveCard(0);

      });
    }).catch(function(error) {
      console.log(error);
    });
})(layersData)



// EVENT LISTENERS
// Adapted from from https://docs.mapbox.com/mapbox-gl-js/example/scroll-fly-to/

window.onscroll = function() {

  if ( !$('body').hasClass('scrolling') ) {
    if (isNextCardOnScreen(activeCardNum + 1)) {
      console.log("On screen!");
      setActiveCard(activeCardNum + 1);
    } else if (isPriorCardOnScreen(activeCardNum - 1)) {
      setActiveCard(activeCardNum - 1);
    }    
  }


  //
  // for (var i = 0; i < cardData.length; i++) {
  //   console.log(i);
  //   if (((i == activeCardNum + 1) || (i == activeCardNum - 1))
  //       && !$('body').hasClass('scrolling') ) {
  //
  //       console.log('card', i);
  //     }
  //   }
};


$('#next-card').on('click', function(e) {
  e.preventDefault();

  var t = this;
  $(this).addClass('clicking');

  setTimeout(function (el) {
    $(el).removeClass('clicking');
  }, 100, t);

  if (activeCardNum < cardData.length) {
    scrollToCard(activeCardNum + 1)
    // setActiveCard(activeCardNum + 1);
  }
})

$('#previous-card').on('click', function(e) {
  e.preventDefault();

  var t = this;
  $(this).addClass('clicking');

  setTimeout(function (el) {
    $(el).removeClass('clicking');
  }, 100, t)

  // console.log("Previous", activeCardNum);
  if (activeCardNum > 0) {
    scrollToCard(activeCardNum - 1)
    // setActiveCard(activeCardNum - 1);
    // scrollToCard(activeCardNum);
  }
})

$('.jump-to-view').on('click', function(e) {

  $(this).addClass('clicking')
    .delay(100).removeClass('clicking')

  e.preventDefault();
  var jumpToExtent = this.id.split('-')[0];
  var targetCard = cardData.findIndex(function(c) {
    return c.extent == jumpToExtent
  });
  scrollToCard(targetCard);
  // setActiveCard(targetCard);

})
