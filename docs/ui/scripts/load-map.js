/*

This code was written for a UCL masters project in 2019.

*/

// Set global variables
var dims = {
  h: window.innerHeight,
  w: window.innerWidth
}

var activeCardNum = null,
  firstMove = null,
  numLoadedFiles = 0;

// Instantiate mapbox map:
mapboxgl.accessToken = 'pk.eyJ1Ijoicm9iaXNvbml2IiwiYSI6ImNqbjM5eXEwdjAyMnozcW9jMzdpbGk5emoifQ.Q_S2qL8UW-UyVLikG_KqQA';

var map = new mapboxgl.Map({
  container: 'main-map',
  style: 'mapbox://styles/mapbox/light-v10',
  center: [50, 10],
  zoom: 1
});

map.addControl(
  new mapboxgl.NavigationControl(),
  'top-left'
);

map.addControl(
  new mapboxgl.ScaleControl({
    maxWidth: 80,
    unit: 'imperial'
  }),
  'bottom-left'
);

var popup = new mapboxgl.Popup({
  closeButton: false,
  closeOnClick: false,
  anchor: 'left'
});


// LOAD LAYERS
// Load and organize all data

// A holder variable for data loaded via promises
var loadedData = {};

// Immediately-invoked function expression that
// accepts array of objects containing information
// about each layer to load
(function(_layersData) {

  // An empty array to hold promises in the order
  // that they are created
  var dataPromises = [];

  layersData.forEach(function(layerData) {

    // Create promises for our two supported non-mapbox
    // file types, `csv` and `json`.
    if (layerData.type != "mapbox") {
      var filename = layerData.path;
      var filetype = filename.split('.'),
        filetype = filetype[filetype.length - 1];
      if (filetype == "csv") {
        dataPromises.push(d3.csv(filename));
      } else if (filetype == "json") {
        dataPromises.push(d3.json(filename));
      } else {
        console.log("Error with file", filename +
          ". Please pass a valid file to load.");
      }
    } else {
      // A custom promise simply to make mapbox layers interoperable
      // with csv and json promises created above.
      var mapboxPromise = new Promise(function(resolve, reject) {
        resolve(layerData);
      })

      dataPromises.push(mapboxPromise)
    }
  });

  // This method was employed to ensure that different load times did
  // not cause problems in page load. The `values` array passed into
  // .then() contains data returned from each promise in the original
  // order found in dataPromises.
  Promise.all(dataPromises)
    .then(function(values) {

      // Loop through values to build loadedData object, which
      // contains information about each layer including parsed JSON,
      // referenced by layersData[i].name - which is also used as the
      // layer id when loaded into the mapbox map.
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

          filetype = filetype[filetype.length - 1];

          loadedData[filekey] = {
            filetype: filetype,
            data: values[i]
          };
        }
      }

      // Load layers onto map and set event listeners.
      // This will only execute once the map is loaded
      map.on('load', function() {
        layersData.forEach(function(layerData) {

          var dataKey = layerData.name;
          if (layerData.type == "geojson") {
            // addSource with unique identifier string,
            // to be referenced later on addLayer.
            map.addSource(dataKey + '-source', {
              "type": "geojson",
              "data": loadedData[dataKey].data
            });
          }

          // buildAddLayerParams returns a mapbox-compliant object
          // defining layer parameters
          map.addLayer(buildAddLayerParams(layerData), "country-label");
          // ^^ place added layer
          // underneath country labels.

          if (layerData.tooltip) {

            // Set listeners on map to display and remove tooltip, as defined in
            // layersData[i].tooltip() method, which returns tooltip contents.
            map.on('mouseenter', layerData.name, function(e) {
              var tooltipContent = layerData.tooltip(e.features[0]);
              // Opportunity for bug by assuming the first
              // feature will be the appropriate one ... 😬
              if (tooltipContent != undefined) {

                // This code and comments from https://docs.mapbox.com/mapbox-gl-js/example/popup-on-hover/
                // - thanks Mapbox! 🙏

                // Change the cursor style as a UI indicator.
                map.getCanvas().style.cursor = 'pointer';

                // Accesssible from mouseenter event.
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
              }
            });

            map.on('mouseleave', layerData.name, function(e) {
              map.getCanvas().style.cursor = '';
              popup.remove();
            })
          }

          // Similarly, display highlight layer on feature mouseenter,
          // and remove highlighted feature on mouseleave.
          if (layerData.highlight) {
            map.on("mousemove", layerData.name, function(e) {

              var features = map.queryRenderedFeatures(e.point);
              var currentISO3 = features[0].properties.code;
              if (typeof currentISO3 === 'undefined') {
                return;
              } else {
                var feature = features[0];

                if (e.features.length > 0) {
                  map.setFilter(layerData.name + '-highlighted', ['==', 'code', currentISO3]);
                }

                d3.selectAll('.' + currentISO3)
                  .classed('active', true)
                  .style('fill-opacity', '1');
              }
            });

            // When the mouse leaves the state-fill layer, update the feature state of the
            // previously hovered feature.
            map.on("mouseleave", layerData.name, function(e) {

              map.setFilter(layerData.name + '-highlighted', ['==', 'code', '']);
              d3.selectAll('.bar')
                .classed('active', false)
                .style('fill-opacity', '0.7');
            });

            }

            if (layerData.highlight_size) {

              map.on("mousemove", layerData.name, function(e) {

                  var features = map.queryRenderedFeatures(e.point);
                  console.log(features[0].properties)
                  var currentSize = features[0].properties.size;
                  if (typeof currentSize === 'undefined'){
                    return;
                  } else {
                    var feature = features[0];

                    d3.selectAll('.' + layerData.name + '_' + currentSize)
                        .classed('active', true)
                        .style('font-weight','bold');
                  }
              });
              // When the mouse leaves the state-fill layer, update the feature state of the
              // previously hovered feature.
              map.on("mouseleave", layerData.name, function(e) {

                  d3.selectAll('.textLegend')
                      .style('font-weight','normal')
                      .classed('active', false);
              });
            }
            // Highlight the categories in the data when the matching legends are hovered.
            if (layerData.highlight_type) {

              map.on("mousemove", layerData.name, function(e) {

                  var features = map.queryRenderedFeatures(e.point);
                  var currentType = features[0].properties.type;

                  if (typeof currentType === 'undefined'){
                    return;
                  } else {
                    var feature = features[0];
                    // Names with "/" isn't valid selectors in d3, so we need to account for that.
                    if (currentType.includes('/')){
                      currentType = 'MA';
                    }

                    d3.selectAll('.' + layerData.name + '_' + currentType)
                        .style('font-weight','bold')
                        .classed('active', true);
                  }
              });
              // When the mouse leaves the state-fill layer, update the feature state of the
              // previously hovered feature.
              map.on("mouseleave", layerData.name, function(e) {

                  d3.selectAll('.textLegend')
                      .classed('active', false)
                      .style('font-weight','normal');
              });
            }

          map.on('click', layerData.name, function(e) {
            if (cardData[activeCardNum].updateFeature) {

              var targetLayers = cardData[activeCardNum].layers;
              var renderedFeatures = map.queryRenderedFeatures(e.point);

              // This is a more reliable pattern than pulling the first feature
              // from what is returned from .queryRenderedFeatures() vvv
              var featureOfInterest = renderedFeatures.find(function(feature) {
                return targetLayers.includes(feature.layer.id);
              })

              // A custom method call to update the  feature content area
              // of the card - see additional airport info on the
              // Global Air Transport card
              cardData[activeCardNum]
                .updateFeature(featureOfInterest, e.lngLat);
            }
          });
        });

        // LOAD CARDS, and switch to card 0.
        loadCards(cardData);
        setActiveCard(0);

        // This resolves a bug we had where the model needed
        // two clicks to close ...
        $('#landing-page').modal('show');

        // In the next two statements we create a cheeky
        // landing page interactive effect 😏
        d3.selectAll('#landing-header')
          .on('mouseenter', function() {
            if (firstMove == null) {
              firstMove = d3.mouse(this)[1];
            }
          })
          // But with a fallback ... almost every user, if confused,
          // will click on the only element on the screen ...
          .on('click', function() {
            d3.select('#landing-text')
              .transition()
              .duration(500)
              .style('opacity', 1)
              .on('end', function() {
                firstMove = false; // to deactivate mousemove opacity effect
              });
          })

        d3.select('.modal-content')
          .on('mousemove', function() {
            if (firstMove) {
              var visibility = ((d3.mouse(this)[1] - firstMove)
                / (window.innerHeight));

              d3.select('#landing-text')
                .style('opacity', visibility);
            }
          })

      });
    }).catch(function(error) {
      console.log(error);
    });
})(layersData)


// EVENT LISTENERS
// Adapted from from https://docs.mapbox.com/mapbox-gl-js/example/scroll-fly-to/
window.onscroll = function() {
  if (!$('body').hasClass('scrolling')) {
    if (isNextCardOnScreen()) {
      setActiveCard(activeCardNum + 1);
    } else if (isPriorCardOnScreen(activeCardNum - 1)) {
      setActiveCard(activeCardNum - 1);
    }
  }
};

// Attached to the "next" arrow on map nav.
$('#next-card').on('click', function(e) {
  e.preventDefault();

  var t = this;

  // Feedback for user to feel like their click worked
  $(this).addClass('clicking');

  setTimeout(function(el) {
    $(el).removeClass('clicking');
  }, 100, t);

  if (activeCardNum < cardData.length) {
    scrollToCard(activeCardNum + 1) // setActiveCard() is called
                                    // within scrollToCard()
  }
});

// Attached to the "back" arrow on map nav
// (probably could functionalize this - quite
// repetitive of the above block ... )
$('#previous-card').on('click', function(e) {
  e.preventDefault();

  var t = this;

  $(this).addClass('clicking');
  setTimeout(function(el) {
    $(el).removeClass('clicking');
  }, 100, t)

  if (activeCardNum > 0) {
    scrollToCard(activeCardNum - 1)
  }
})

$('.jump-to-view').on('click', function(e) {
  e.preventDefault();

  $(this).addClass('clicking')
    .delay(100).removeClass('clicking');

  // Find first card in that extent in cardData,
  // and switch to it.
  var jumpToExtent = this.id.split('-')[0];
  var targetCard = cardData.findIndex(function(c) {
    return c.extent == jumpToExtent;
  });
  scrollToCard(targetCard);
})



// This attaches a number of event listeners to #drop-zone
// and handles the loading of local geojson features onto the map
dropJSON(document.getElementById("drop-zone"),
  // The callback ... should convert to a promise for continuity,
  // or async await.
  function(_data, _files) {

    var layerColor = d3.scaleOrdinal(d3.schemeSet2)
      .domain(d3.range(8));
    // from https://stackoverflow.com/questions/20590396/d3-scale-category10-not-behaving-as-expected

    if (numLoadedFiles == 0) {
      d3.select('#add-layer-button')
        .text('Manage layers');
    }

    // Get hex color specific to features in this file
    // Will restart cycle after 8 files are loaded.
    var c = layerColor(numLoadedFiles);

    var f = _files[0];

    // Get arrays of Point, Linestring and Polygon features
    var points = _data.features.filter(function(feature) {
        return feature.geometry.type == "Point";
      }),
      lines = _data.features.filter(function(feature) {
        return feature.geometry.type == "LineString";
      }),
      polygons = _data.features.filter(function(feature) {
        return feature.geometry.type == "Polygon";
      });


    // The next blocks add the filtered layers to the list, coloring
    // them similarly and adding elements to enable users to toggle
    // layers on and off and zoom to layer extent.

    if (points.length > 0) {

      // Now it is GeoJSON!
      var pointData = {
        type: "FeatureCollection",
        features: points
      }

      var layerId = "loaded-points-" + f.name.split('.')[0] +
        '-' + Math.random().toString(36).substring(7);
      // ^^ Random bit added to prevent bugs from occurring if two files of the
      // same name are loaded. From  https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript

      // Note that no extra styling based on layer attributes is included here.
      // Would love to extend to that, but UX might get very complicated very quickly ...
      map.addLayer({
        "id": layerId,
        "type": "circle",
        "source": {
          "type": "geojson",
          "data": pointData
        },
        "paint": {
          "circle-radius": {
            "stops": [
              [0, 5],
              [5, 6],
              [8, 7],
              [11, 9],
              [16, 15]
            ]
          },
          "circle-color": c,
          "circle-stroke-width": 1,
          "circle-stroke-color": "black"
        },
      });
      addLayerToLayerList(pointData, 'point', layerId, c);
    }

    if (lines.length > 0) {

      var lineData = {
        type: "FeatureCollection",
        features: lines
      }

      var layerId = "loaded-lines-" + f.name.split('.')[0] +
        '-' + Math.random().toString(36).substring(7);

      map.addLayer({
        "id": layerId,
        "type": "line",
        "source": {
          "type": "geojson",
          "data": lineData
        },
        "layout": {
          "line-join": "round",
          "line-cap": "round"
        },
        "paint": {
          "line-color": c,
          "line-width": 5
        },
      });
      addLayerToLayerList(lineData, 'line', layerId, c);
    }

    if (polygons.length > 0) {

      var polygonData = {
        type: "FeatureCollection",
        features: polygons
      }

      var layerId = "loaded-polygons-" + f.name.split('.')[0] +
        '-' + Math.random().toString(36).substring(7);;

      map.addLayer({
        "id": layerId,
        "type": "fill",
        "source": {
          "type": "geojson",
          "data": polygonData
        },
        "layout": {},
        "paint": {
          "fill-color": c,
          "fill-opacity": 0.8,
          'fill-outline-color': 'black'
        },
      });

      addLayerToLayerList(polygonData, 'polygon', layerId, c);
    }

    numLoadedFiles += 1;


    // A local function to add to list of loaded files
    // including color of points
    // Include visibility toggle ... ...
    function addLayerToLayerList(_layerData, _layerType, _layerId, _c) {

      var layerList = d3.select('#loaded-list');

      // Add legend icons with toggle-able click events to switch
      // layer visibility on and off.
      layerList.append('dt')
        .classed('col-2', true)
        .append('span')
        .classed('loaded-layer-toggle', true)
        .classed(_layerType, true)
        .classed('active', true)
        .style('background', function() {
          if (_layerType == 'line') {
            // From https://learn.shayhowe.com/html-css/setting-backgrounds-and-gradients/
            return 'linear-gradient(to bottom right, white 40%, '
              + c + ' 40%, ' + c + ' 60%, white 60%)';
          }
        })
        .style('background-color', function() {
          if (_layerType != 'line') {
            console.log(_c);
            return _c;
          } else {
            return null;
          }
        })
        .on('click', function() {

          var visibility = map.getLayoutProperty(_layerId, 'visibility');

          if (visibility === 'visible') {
            map.setLayoutProperty(_layerId, 'visibility', 'none');
            d3.select(this).classed('active', false);
          } else {
            d3.select(this).classed('active', true);
            map.setLayoutProperty(_layerId, 'visibility', 'visible');
          }
        });

      // Add layer and feature type name
      var dd = layerList.append('dd')
        .classed('col-6', true)
        .append('p');

      dd.text(_layerId.split('-').slice(2).join('-') + ' (' + _layerType + ')');
      // // Hooks for future extensions - commented for efficiency's sake
      // .on('mouseenter', function () {
      //   // highlight layer by _layerId
      //   return;
      // })
      // .on('mouseleave', function () {
      //   // unhighlight layer ...
      //   return;
      // });

      // Zoom to button ...
      layerList.append('dd')
        .classed('col-4', true)
        .append('button')
        .classed('btn btn-outline-secondary ml-4', true)
        .text('Zoom to layer')
        .on('click', function() {

          // from https://stackoverflow.com/questions/35586360/mapbox-gl-js-getbounds-fitbounds
          // Sadly, our only use of turf.js in this project ...
          var bounds = turf.bbox(_layerData);

          map.fitBounds(bounds, {
            padding: 200
          });
        });
    }
  }
);
