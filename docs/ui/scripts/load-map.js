// SOURCES
// https://docs.mapbox.com/mapbox-gl-js/example/scroll-fly-to/

// Globals

var dims = {
  h: window.innerHeight,
  w: window.innerWidth
}

var activeCardNum = null,
  inAnimation = false,
  firstMove = true,
  numLoadedFiles = 0;

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

            //var prevCoordinates = null;

            if (layerData.tooltip) {
              //console.log('Layer have tooltip',layerData.name);
              map.on('mouseenter', layerData.name, function(e) {
                //console.log(e.features[0]);
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
              //console.log(layerData.highlight);
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

                //var features = map.queryRenderedFeatures(e.point);

                //var currentISO3 = features[0].properties.iso3;

                map.setFilter(layerData.name + '-highlighted', ['==', 'iso3', '']);
                d3.selectAll('.bar') // + currentISO3)
                  .classed('active', false)
                  .style('fill-opacity', '0.7');
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

        $('#landing-page').modal('show');

        d3.selectAll('#landing-text')
          .transition()
          .duration(2000)
          .style('opacity', 0.2)
          .on('end', function() {
            firstMove = false;
          });

      });
    }).catch(function(error) {
      console.log(error);
    });
})(layersData)



// EVENT LISTENERS
// Adapted from from https://docs.mapbox.com/mapbox-gl-js/example/scroll-fly-to/

window.onscroll = function() {

  if (!$('body').hasClass('scrolling')) {
    if (isNextCardOnScreen(activeCardNum + 1)) {
      // console.log("On screen!");
      setActiveCard(activeCardNum + 1);
    } else if (isPriorCardOnScreen(activeCardNum - 1)) {
      setActiveCard(activeCardNum - 1);
    }
  }

};


$('#next-card').on('click', function(e) {
  e.preventDefault();

  var t = this;
  $(this).addClass('clicking');

  setTimeout(function(el) {
    $(el).removeClass('clicking');
  }, 100, t);

  // $('#file-add').collapse('hide');


  if (activeCardNum < cardData.length) {
    scrollToCard(activeCardNum + 1)
    // setActiveCard(activeCardNum + 1);
  }
})

$('#previous-card').on('click', function(e) {
  e.preventDefault();

  var t = this;
  $(this).addClass('clicking');


  setTimeout(function(el) {
    $(el).removeClass('clicking');
  }, 100, t)

  // $('#file-add').collapse('hide');

  // console.log("Previous", activeCardNum);
  if (activeCardNum > 0) {
    scrollToCard(activeCardNum - 1)
    // setActiveCard(activeCardNum - 1);
    // scrollToCard(activeCardNum);
  }
})

$('.jump-to-view').on('click', function(e) {

  $(this).addClass('clicking')
    .delay(100).removeClass('clicking');


  e.preventDefault();
  var jumpToExtent = this.id.split('-')[0];
  var targetCard = cardData.findIndex(function(c) {
    return c.extent == jumpToExtent
  });
  scrollToCard(targetCard);
  // setActiveCard(targetCard);

})

// d3.select('#landing-content h1')
//   .on('mouseenter', function () {
//     if (firstMove) {
//       d3.select('#landing-text')
//         .transition()
//         .duration(1000)
//         .style('opacity', 0.2);
//       setTimeout(function () {
//         firstMove = false;
//       }, 1000);
//     }
//
//   })

d3.selectAll('.modal-content')
  .on('mousemove', function() {
    console.log('mouse moving');
    var visibility = (d3.mouse(this)[1] / window.innerHeight);
    if (firstMove) {
      d3.select('#landing-text')
        .transition()
        .duration(visibility * 1000)
        .style('opacity', visibility)
        .on('end', function() {
          firstMove = false;
        });
    } else {
      d3.select('#landing-text')
        .style('opacity', visibility);
    }

  })

// File upload function call
dropJSON(document.getElementById("drop-zone"),
  function(_data, _files) {
    // dropped - do something with data

    console.log(_data);
    console.log(_files);

    var layerColor = d3.scaleOrdinal(d3.schemeSet2)
      .domain(d3.range(8));
    // from https://stackoverflow.com/questions/20590396/d3-scale-category10-not-behaving-as-expected


    for (i in _files) {
      if (!isNaN(i)) {

        if (numLoadedFiles == 0) {
          d3.select('#add-layer-button')
            .text('Manage layers');
        }

        var c = layerColor(numLoadedFiles);
        var f = _files[i];

        // if (_data)
        var points = _data.features.filter(function(feature) {
            return feature.geometry.type == "Point";
          }),
          lines = _data.features.filter(function(feature) {
            return feature.geometry.type == "LineString";
          }),
          polygons = _data.features.filter(function(feature) {
            return feature.geometry.type == "Polygon";
          });

        if (points.length > 0) {

          console.log('Adding points from', f.name);

          var pointData = {
            type: "FeatureCollection",
            features: points
          }

          var layerId = "loaded-points-" + f.name.split('.')[0];

          map.addLayer({

            "id": layerId, // should be file name
            // Random code from https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
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
            "filter": ["==", "$type", "Point"],
          });

          addLayerToLayerList(pointData, 'point', layerId, c);


        }

        if (lines.length > 0) {
          console.log('Adding lines from', f.name);

          console.log(lines);

          var lineData = {
            type: "FeatureCollection",
            features: lines
          }

          var layerId = "loaded-lines-" + f.name.split('.')[0];

          map.addLayer({

            "id": layerId, // should be file name
            // Random code from https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
            "type": "line",
            "source": {
              "type": "geojson",
              "data": _data // this is inefficient - should extract only point features.
              // but we will just filter below :/
            },
            "layout": {
              "line-join": "round",
              "line-cap": "round"
            },
            "paint": {
              "line-color": c,
              "line-width": 5
            },

            "filter": ["==", "$type", "LineString"]
          });

          addLayerToLayerList(lineData, 'line', layerId, c);

        }


        if (polygons.length > 0) {
          console.log('Adding polygons from', f.name);

          console.log(polygons);

          var polygonData = {
            type: "FeatureCollection",
            features: polygons
          }

          var layerId = "loaded-polygons-" + f.name.split('.')[0];

          map.addLayer({

            "id": layerId, // should be file name
            // Random code from https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
            "type": "fill",
            "source": {
              "type": "geojson",
              "data": polygonData // this is inefficient - should extract only point features.
              // but we will just filter below :/
            },
            "layout": {},
            "paint": {
              "fill-color": c,
              "fill-opacity": 0.8,
              'fill-outline-color': 'black'
            },

            "filter": ["==", "$type", "Polygon"]
          });

          addLayerToLayerList(polygonData, 'polygon', layerId, c);        }

        numLoadedFiles += 1;

      }

    }



    // Add to list of loaded files
    // including color of points
    // Include visibility toggle ... ...


    function addLayerToLayerList(_layerData, _layerType, _layerId, _c) {

      var layerList = d3.select('#loaded-list');

      layerList.append('dt')
        .classed('col-1', true)
        .append('span')
        .classed('loaded-layer-toggle', true)
        .classed(_layerType, true)
        .classed('active', true)
        .style('background', function () {
          if (_layerType == 'line') {
            // From https://learn.shayhowe.com/html-css/setting-backgrounds-and-gradients/
            return 'linear-gradient(to bottom right, white 40%, ' + c + ' 40%, ' + c + ' 60%, white 60%)';
          }
        })
        .style('background-color', function () {
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
        })


      var dd = layerList.append('dd')
        .classed('col-5', true);

      dd.text(_layerId.split('-').slice(2).join('-') + ' (' + _layerType + ')');
        // Here we could add highlight on layer entry hover ...

      layerList.append('dd')
        .classed('col-6', true)
        .append('button')
        .classed('btn btn-outline-secondary ml-4', true)
        .text('Zoom to layer')
        .on('click', function() {

          // from https://stackoverflow.com/questions/35586360/mapbox-gl-js-getbounds-fitbounds
          var bounds = turf.bbox(_layerData);

          map.fitBounds(bounds, {
            padding: 200
          });
        });
    }

  }
);
