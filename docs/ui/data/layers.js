console.log('loading layers data')

var layersData = [{
    "name": "airports-json",
    "path": "./data/airports.json",
    "type": "geojson",
    "addLayerParams": {
      "default": {
        "type": "circle",
        "paint": {
          "circle-radius": [
            "match",
            ["get", "type"],
            "small", 3,
            "mid", 5,
            "major", 9,
            2
          ],
          "circle-color": [
            "match",
            ["get", "type"],
            "small", "#fbb03b",
            "mid", "#223b53",
            "major", "yellow",
            "#ccc"
          ]
        }
      },
      "dim_a": {}
    },
    tooltip: function(_data) {

      console.log( _data.properties.abbrev);
      // console.log( _data);
      // pop tooltip with data.
    }
  },
  {
    "name": "export-countries",
    "type": "mapbox",
    "path": "none",
    "addLayerParams": {
      "id": "export-countries",
      "type": "fill",
      "source": {
        "type": "vector",
        "url": "mapbox://kristianln.cjvl9zsp80snn33po4igmbs80-1uw2l"
      },
      "layout": {
        "visibility": "none"
      },
      "source-layer": "Global_data",
      "paint": {
        "fill-color": [
          "interpolate-hcl",
          ["exponential", 1.1],
          ["get", "normalised_export_2017"],
          2.00,
          ["to-color", "red"],
          15.00,
          ["to-color", "green"]
        ],
        "fill-opacity": 0.75,
        "fill-outline-color": "rgb(250, 250, 250)"
      }
    },
    tooltip: function(_data) {
      console.log( _data);
      // pop tooltip with data.
    }
  },
  {
    "name": "import-countries",
    "type": "mapbox",
    "path": "none",
    "addLayerParams": {
      "id": "import-countries",
      "type": "fill",
      "source": {
        "type": "vector",
        "url": "mapbox://kristianln.cjvl9zsp80snn33po4igmbs80-1uw2l"
      },
      "layout": {
        "visibility": "none"
      },
      "source-layer": "Global_data",
      "paint": {
        "fill-color": [
          "interpolate-hcl",
          ["exponential", 1.1],
          ["get", "normalised_import_2017"],
          4.98,
          ["to-color", "red"],
          15.00,
          ["to-color", "green"]
        ],
        "fill-opacity": 0.75,
        "fill-outline-color": "rgb(250, 250, 250)"
      }
    },
    tooltip: function(_data) {
      console.log( _data);
      // pop tooltip with data.
    }
  },
  {
    "name": "airports-mapbox-data",
    "type": "mapbox",
    "path": "none",
    "addLayerParams": {
      "default": {
        "id": "airports-mapbox-data",
        "type": "circle",
        "source": {
          "type": "vector",
          "url": "mapbox://kristianln.cjvlf8v0y0tca2rl9kgp0zoq3-8xp3c"
        },
        "source-layer": "Global_airports",

        "paint": {
          "circle-color": "#ff69b4",
          "circle-opacity": 0.8,
          "circle-radius": 5
        }
      },
      "dim_a": {}
    },
    tooltip: function(_data) {
      console.log(_data);
      return '<p>' + _data.properties.abbrev + '</p>';
      // pop tooltip with data.
    }
  },
  {
    "name": "ports",
    "path": "./data/ports.json",
    "type": "geojson",
    "addLayerParams": {
      "default": {
        "type": "circle",
        "paint": {
          "circle-radius": 3,
          "circle-color": "green"
        }
      }
    },
    tooltip: function(_data) {
      console.log( _data);
      // pop tooltip with data.
    }
  },
  {
    "name": "us-states",
    "path": "./data/us-states.json",
    "type": "geojson",
    "addLayerParams": {
      "type": "fill",
      "layout": {},
      "paint": {
        "fill-color": "#088",
        "fill-opacity": 0.8
      }
    },
    tooltip: function(_data) {
      console.log( _data);
      // pop tooltip with data.
    }
  },

  {
    "name": "china-demo-poly",
    "path": "./data/china-demo-poly.json",
    "type": "geojson",
    "addLayerParams": {
      "type": "fill",
      "layout": {},
      "paint": {
        "fill-color": "#088",
        "fill-opacity": 0.8
      }
    },
    tooltip: function(_data) {
      console.log( _data);
      // pop tooltip with data.
    }
  }
];
