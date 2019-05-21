console.log('loading layers data')

var layersData = [
  {
<<<<<<< HEAD
    "name": "export-countries",
    "type": "mapbox",
    "path": "none",
    "addLayerParams": {
      "id": "export-countries",
=======
    "name": "export-countries-volumes",
    "type": "mapbox",
    "path": "none",
    "addLayerParams": {
      //"id": "export-countries-volumes",
>>>>>>> 7a6689b297a3e4ee47580a2e0e061f8a98253aea
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
          ["to-color", "#deebf7"],
          15.00,
          ["to-color", "#537895"]
        ],
        "fill-opacity": 0.8,
        "fill-outline-color": "rgb(250, 250, 250)"
      }
    },
    tooltip: function(_data) {
      return '<h5 class="text-center mb-0">' + _data.properties.name +
        '</h5><p class="text-center mb-0">Total Exports (million USD):<br />' +
         _data.properties.all_commodities_export + '</p>';
    }
  },
  {
<<<<<<< HEAD
    "name": "export-countries-highlighted",
    "type": "mapbox",
    "path": "none",
    "addLayerParams": {
      "id": "export-countries",
=======
    "name": "export-countries-volumes-highlighted",
    "type": "mapbox",
    "path": "none",
    "addLayerParams": {
      // "id": "export-countries-volumes-highlighted",
>>>>>>> 7a6689b297a3e4ee47580a2e0e061f8a98253aea
      "type": "fill",
      "source": {
        "type": "vector",
        "url": "mapbox://kristianln.cjvl9zsp80snn33po4igmbs80-1uw2l"
      },
      "layout": {
        "visibility": "visible"
      },
      "source-layer": "Global_data",
      "paint": {
        "fill-color": [
          "interpolate-hcl",
          ["exponential", 1.1],
          ["get", "normalised_export_2017"],
          2.00,
          ["to-color", "#deebf7"],
          15.00,
          ["to-color", "#537895"]
        ],
        "fill-opacity": 1,
        "fill-outline-color": "rgb(0, 0, 0)",
        'fill-translate': [0,-7]
      },
      "filter": ["==", "iso3", ""]
    },
    tooltip: function(_data) {
      console.log(_data);
      // pop tooltip with data.
    }
  },
  {
<<<<<<< HEAD
    "name": "import-countries",
    "type": "mapbox",
    "path": "none",
    "addLayerParams": {
      "id": "import-countries",
=======
    "name": "import-countries-volumes",
    "type": "mapbox",
    "path": "none",
    "addLayerParams": {
      // "id": "import-countries",
>>>>>>> 7a6689b297a3e4ee47580a2e0e061f8a98253aea
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
          ["to-color", "#fff7bc"],
          15.00,
          ["to-color", "#d95f0e"]
        ],
        "fill-opacity": 0.75,
        "fill-outline-color": "rgb(250, 250, 250)"
      }
    },
    tooltip: function(_data) {
      // pop tooltip with data.
      return '<h5 class="text-center mb-0">' + _data.properties.name +
        '</h5><p class="text-center mb-0">Total Imports (million USD):<br />' +
         _data.properties.all_commodities_import + '</p>';
    }
  },
  {
<<<<<<< HEAD
    "name": "import-countries-highlighted",
    "type": "mapbox",
    "path": "none",
    "addLayerParams": {
      "id": "import-countries",
=======
    "name": "import-countries-volumes-highlighted",
    "type": "mapbox",
    "path": "none",
    "addLayerParams": {
      // "id": "import-countries-highlighted",
>>>>>>> 7a6689b297a3e4ee47580a2e0e061f8a98253aea
      "type": "fill",
      "source": {
        "type": "vector",
        "url": "mapbox://kristianln.cjvl9zsp80snn33po4igmbs80-1uw2l"
      },
      "layout": {
        "visibility": "visible"
      },
      "source-layer": "Global_data",
      "paint": {
        "fill-color": [
          "interpolate-hcl",
          ["exponential", 1.1],
          ["get", "normalised_import_2017"],
          4.98,
          ["to-color", "#fff7bc"],
          15.00,
          ["to-color", "#d95f0e"]
        ],
        "fill-opacity": 1,
        "fill-outline-color": "rgb(0, 0, 0)",
        'fill-translate': [0,-7]
      },
      "filter": ["==", "iso3", ""]
    },
    tooltip: function(_data) {
      console.log(_data);
      // pop tooltip with data.
    }
  },
  {
<<<<<<< HEAD
    "name": "airports-mapbox-data",
=======
    "name": "busiest-airports",
>>>>>>> 7a6689b297a3e4ee47580a2e0e061f8a98253aea
    "type": "mapbox",
    "path": "none",
    "addLayerParams": {
      "default": {
<<<<<<< HEAD
        "id": "airports-mapbox-data",
        "type": "circle",
        "source": {
          "type": "vector",
          "url": "mapbox://kristianln.cjvlf8v0y0tca2rl9kgp0zoq3-8xp3c"
        },
        "source-layer": "Global_airports",

        "paint": {
          "circle-color": "#6991c7",
          "circle-opacity": 0.8,
          "circle-radius": 5
        }
      },
      "dim_a": {}
    },
    tooltip: function(_data) {
      return '<h5 class="mb-0">' + _data.properties.abbrev + '</h5>';
      // pop tooltip with data.
    }
  },
  {
    "name": "airports-mapbox-data-busiest",
    "type": "mapbox",
    "path": "none",
    "addLayerParams": {
      "default": {
        "id": "airports-mapbox-data",
=======
        // "id": "airports-mapbox-data-busiest",
>>>>>>> 7a6689b297a3e4ee47580a2e0e061f8a98253aea
        "type": "circle",
        "source": {
          "type": "vector",
          "url": "mapbox://kristianln.cjvlf8v0y0tca2rl9kgp0zoq3-8xp3c"
        },
        "source-layer": "Global_airports",

        "paint": {
          "circle-color": "#6991c7",
          "circle-opacity": 0.8,
          "circle-radius": 5
        },
        "filter": ["==", "top_20_busiest_airports", ""]
      },
      "dim_a": {}
    },
    tooltip: function(_data) {
      return '<p>' + _data.properties.abbrev + '</p>';
      // pop tooltip with data.
    }
  },
  {
<<<<<<< HEAD
    "name": "airports-mapbox-data-uk",
=======
    "name": "uK-airports-filter",
>>>>>>> 7a6689b297a3e4ee47580a2e0e061f8a98253aea
    "type": "mapbox",
    "path": "none",
    "addLayerParams": {
      "default": {
<<<<<<< HEAD
        "id": "airports-mapbox-data",
=======
        // "id": "airports-mapbox-data-uk",
>>>>>>> 7a6689b297a3e4ee47580a2e0e061f8a98253aea
        "type": "circle",
        "source": {
          "type": "vector",
          "url": "mapbox://kristianln.cjvlf8v0y0tca2rl9kgp0zoq3-8xp3c"
        },
        "source-layer": "Global_airports",

        "paint": {
          "circle-color": "#6991c7",
          "circle-opacity": 0.8,
          "circle-radius": 5
        },
        "filter": ["==", "iso3", ""]
      },
      "dim_a": {}
    },
    tooltip: function(_data) {
      return '<p>' + _data.properties.abbrev + '</p>';
      // pop tooltip with data.
    }
  },
  {
<<<<<<< HEAD
    "name": "heathrow-point",
=======
    "name": "heathrow-center",
>>>>>>> 7a6689b297a3e4ee47580a2e0e061f8a98253aea
    "type": "mapbox",
    "path": "none",
    "addLayerParams": {
      "default": {
<<<<<<< HEAD
        "id": "heathrow-point",
=======
        // "id": "heathrow-point",
>>>>>>> 7a6689b297a3e4ee47580a2e0e061f8a98253aea
        "type": "circle",
        "source": {
          "type": "vector",
          "url": "mapbox://ucfnlei.0o2mnjq1"
        },
        "source-layer": "Heathrow-3p4trr",
        "paint": {
          "circle-radius": 10,
          "circle-color": "blue"
        }
      }
    }},
<<<<<<< HEAD
    {
      "name": "airports-mapbox-data",
=======
       {
      "name": "uK-airports",
      "type": "mapbox",
      "path": "none",
      "addLayerParams": {
        "default": {
          // "id": "UKairports-mapbox-data",
          "type": "circle",
          "source": {
            "type": "vector",
            "url": "mapbox://kristianln.cjvne9hos03qt2xmbc389p414-253yc"
          },
          "source-layer": "UKFreightAirports",

          "paint": {
        // make circles larger as the user zooms from z12 to z22
        'circle-radius': [
            'match',
            ['get', 'size'],
            'small', 2,
            'mid', 4,
            'major', 6,
            /* other */ 4
        ],
        'circle-color': [
            'match',
            ['get', 'usage'],
            'civilian', '#5769D3',
            'military/civilian', '#38f9d7',
            'military', '#6f86d6',
            'spaceport', '#48c6ef',
            /* other */ '#ccc'
        ],
        'circle-stroke-color': [
            'match',
            ['get', 'usage'],
            'civilian', '#ccc',
            'military/civilian', '#ccc',
            'military', '#ccc',
            'spaceport', '#ccc',
            /* other */ '#ccc'
        ],
        'circle-stroke-width': 1
        }

      },

    tooltip: function(_data) {
      console.log(_data);
    }

  }},
    {
      "name": "global-airports",
>>>>>>> 7a6689b297a3e4ee47580a2e0e061f8a98253aea
      "type": "mapbox",
      "path": "none",
      "addLayerParams": {
        "default": {
<<<<<<< HEAD
          "id": "airports-mapbox-data",
=======
          // "id": "airports-mapbox-data",
>>>>>>> 7a6689b297a3e4ee47580a2e0e061f8a98253aea
          "type": "circle",
          "source": {
            "type": "vector",
            "url": "mapbox://kristianln.cjvlf8v0y0tca2rl9kgp0zoq3-8xp3c"
          },
          "source-layer": "Global_airports",

          "paint": {
        // make circles larger as the user zooms from z12 to z22
        'circle-radius': [
            'match',
            ['get', 'size'],
<<<<<<< HEAD
            'small', 3,
            'mid', 5,
            'major', 7,
            /* other */ 5
        ],
        //                 {
        //     'base': 1.75,
        //     'stops': [[2, 2], [12, 180]]
        // },
        // color circles by ethnicity, using a match expression
        // https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-match
        'circle-color': [
            'match',
            ['get', 'usage'],
            'civilian', '#a18cd1',
            'military/civilian', '#a6c0fe',
=======
            'small', 2,
            'mid', 4,
            'major', 6,
            /* other */ 4
        ],
        'circle-color': [
            'match',
            ['get', 'usage'],
            'civilian', '#5769D3',
            'military/civilian', '#38f9d7',
>>>>>>> 7a6689b297a3e4ee47580a2e0e061f8a98253aea
            'military', '#6f86d6',
            'spaceport', '#48c6ef',
            /* other */ '#ccc'
        ],
        'circle-stroke-color': [
            'match',
            ['get', 'usage'],
            'civilian', '#ccc',
            'military/civilian', '#ccc',
            'military', '#ccc',
            'spaceport', '#ccc',
            /* other */ '#ccc'
        ],
<<<<<<< HEAD
        'circle-stroke-width': 2
        }
        },
        "source-layer": "Heathrow_Station-20t8o9",
        "paint": {
          "circle-radius": 4,
          "circle-color": "red"
        }
      },

=======
        'circle-stroke-width': 0.5
        }
      },
        "dim_a":{}
      },
>>>>>>> 7a6689b297a3e4ee47580a2e0e061f8a98253aea
    tooltip: function(_data) {
      console.log(_data);
    }

  },
<<<<<<< HEAD
=======

>>>>>>> 7a6689b297a3e4ee47580a2e0e061f8a98253aea
  {
    "name": "heathrow-hotels",
    "type": "mapbox",
    "path": "none",
    "addLayerParams": {
      "default": {
<<<<<<< HEAD
        "id": "heathrow-hotels",
=======
        // "id": "heathrow-hotels",
>>>>>>> 7a6689b297a3e4ee47580a2e0e061f8a98253aea
        "type": "circle",
        "source": {
          "type": "vector",
          "url": "mapbox://ucfnlei.5c940sk4"
        },
        "source-layer": "Heathrow_Hotel-10lk8m",
        "paint": {
          "circle-radius": 4,
<<<<<<< HEAD
          "circle-color": "gray"
=======
          "circle-color": "grey"
>>>>>>> 7a6689b297a3e4ee47580a2e0e061f8a98253aea
        }
      }
    },
    tooltip: function(_data) {
      console.log(_data);
    }

  },
  {
    "name": "heathrow-restaurants",
    "type": "mapbox",
    "path": "none",
    "addLayerParams": {
      "default": {
<<<<<<< HEAD
        "id": "heathrow-restaurants",
=======
        // "id": "heathrow-restaurants",
>>>>>>> 7a6689b297a3e4ee47580a2e0e061f8a98253aea
        "type": "circle",
        "source": {
          "type": "vector",
          "url": "mapbox://ucfnlei.5zqbtsdc"
        },
        "source-layer": "Heathrow_restaurant-drs6o5",
        "paint": {
          "circle-radius": 4,
          "circle-color": "brown"
        }
      }
    },
    tooltip: function(_data) {
      console.log(_data);
    }

  },
  {
    "name": "heathrow-buffer",
    "type": "mapbox",
    "path": "none",
    "addLayerParams": {
      "default": {
<<<<<<< HEAD
        "id": "heathrow-buffer",
=======
        // "id": "heathrow-buffer",
>>>>>>> 7a6689b297a3e4ee47580a2e0e061f8a98253aea
        "type": "fill",
        "source": {
          "type": "vector",
          "url": "mapbox://ucfnlei.0wo2dyp3"
        },
        "source-layer": "Heathrow-7fyjdj",
        "paint": {
          "fill-color": "#9795f0",
          "fill-opacity": 0.2
        }
<<<<<<< HEAD

        // "paint": {
        //   "line-color": "#ff69b4",
        //   "line-width": 1
        // }
=======
>>>>>>> 7a6689b297a3e4ee47580a2e0e061f8a98253aea
      }
    },
    tooltip: function(_data) {
      console.log(_data);
    }

  },
  {
<<<<<<< HEAD
    "name": "tilbury-point",
=======
    "name": "tilbury-center",
>>>>>>> 7a6689b297a3e4ee47580a2e0e061f8a98253aea
    "type": "mapbox",
    "path": "none",
    "addLayerParams": {
      "default": {
<<<<<<< HEAD
        "id": "tilbury-point",
=======
        // "id": "tilbury-point",
>>>>>>> 7a6689b297a3e4ee47580a2e0e061f8a98253aea
        "type": "circle",
        "source": {
          "type": "vector",
          "url": "mapbox://ucfnlei.2uwuevhf"
        },
        "source-layer": "Port_of_Tilbury-7w0i1u",
        "paint": {
          "circle-radius": 10,
          "circle-color": "green"
        }
      }
    },
    tooltip: function(_data) {
      console.log(_data);
    }

  },
  {
    "name": "tilbury-stations",
    "type": "mapbox",
    "path": "none",
    "addLayerParams": {
      "default": {
<<<<<<< HEAD
        "id": "tilbury-stations",
=======
        // "id": "tilbury-stations",
>>>>>>> 7a6689b297a3e4ee47580a2e0e061f8a98253aea
        "type": "circle",
        "source": {
          "type": "vector",
          "url": "mapbox://ucfnlei.d31i56v7"
        },
        "source-layer": "Tilbury_Station-0r7h8t",
        "paint": {
          "circle-radius": 4,
          "circle-color": "red"
        }
      }
    },
    tooltip: function(_data) {
<<<<<<< HEAD
      console.log(_data);
=======
      return "Transit station"
>>>>>>> 7a6689b297a3e4ee47580a2e0e061f8a98253aea
    }

  },
  {
    "name": "tilbury-schools",
    "type": "mapbox",
    "path": "none",
    "addLayerParams": {
      "default": {
<<<<<<< HEAD
        "id": "tilbury-schools",
=======
        // "id": "tilbury-schools",
>>>>>>> 7a6689b297a3e4ee47580a2e0e061f8a98253aea
        "type": "circle",
        "source": {
          "type": "vector",
          "url": "mapbox://ucfnlei.9wglwlup"
        },
        "source-layer": "Tilbury_School-1s7kw8",
        "paint": {
          "circle-radius": 4,
          "circle-color": "blue"
        }
      }
    },
    tooltip: function(_data) {
<<<<<<< HEAD
      console.log(_data);
=======
        return "School"
>>>>>>> 7a6689b297a3e4ee47580a2e0e061f8a98253aea
    }

  },
  {
    "name": "tilbury-restaurants",
    "type": "mapbox",
    "path": "none",
    "addLayerParams": {
      "default": {
<<<<<<< HEAD
        "id": "tilbury-restaurants",
=======
        // "id": "tilbury-restaurants",
>>>>>>> 7a6689b297a3e4ee47580a2e0e061f8a98253aea
        "type": "circle",
        "source": {
          "type": "vector",
          "url": "mapbox://ucfnlei.01nbv3qq"
        },
        "source-layer": "Tilbury_Restaurant-9m8bys",
        "paint": {
          "circle-radius": 4,
          "circle-color": "brown"
        }
      }
    },
    tooltip: function(_data) {
<<<<<<< HEAD
      console.log(_data);
=======
      return "Restaurant";
>>>>>>> 7a6689b297a3e4ee47580a2e0e061f8a98253aea
    }

  },
  {
    "name": "tilbury-buffer",
    "type": "mapbox",
    "path": "none",
    "addLayerParams": {
      "default": {
<<<<<<< HEAD
        "id": "tilbury-buffer",
=======
        // "id": "tilbury-buffer",
>>>>>>> 7a6689b297a3e4ee47580a2e0e061f8a98253aea
        "type": "fill",
        "source": {
          "type": "vector",
          "url": "mapbox://ucfnlei.bw1fkj0o"
        },
        "source-layer": "port-a1biar",
        "paint": {
          "fill-color": "#a3bded",
          "fill-opacity": 0.2
        }
<<<<<<< HEAD

        // "paint": {
        //   "line-color": "#ff69b4",
        //   "line-width": 1
        // }
=======
>>>>>>> 7a6689b297a3e4ee47580a2e0e061f8a98253aea
      }
    },
    tooltip: function(_data) {
      console.log(_data);
    }

  },
<<<<<<< HEAD
  {
    "name": "ports",
=======
      {
    "name": "uK-ports",
    "path": "./data/uk-ports.json",
    "type": "geojson",
    "addLayerParams": {
      "default": {
        "type": "circle",
        "paint":{
        // make circles larger as the user zooms from z12 to z22
        'circle-radius': [
            'match',
            ['get', 'harborsize'],
            'V', 2,
            'S', 4,
            'M', 6,
            'L', 8,
            /* other */ 5
        ],
        'circle-color':
         [
             'match',
            ['get', 'harbortype'],
             'coastal', '#f83600',
             'lake', '#ff5858',
             'river', '#fee140',


             /* other */ '#cfd9df'
         ]
        ,
        'circle-stroke-color':
            [
            'match',
            ['get', 'harbortype'],
             'coastal', '#ccc',
             'lake', '#ccc',
             'river', '#ccc',

            /* other */ '#ccc'
        ]
        ,
        'circle-stroke-width': 0.5
        }

      }
    },
    tooltip: function(_data) {
      console.log(_data);

      // Could deal with hyphenated words too ...
      var portName = _data.properties.port_name.toLowerCase().split(' ');

      portName = portName.map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')

      return "<p class='mb-0'>"  + portName + "</p>";
    }
  },

  {
    "name": "global-ports",
>>>>>>> 7a6689b297a3e4ee47580a2e0e061f8a98253aea
    "path": "./data/ports.json",
    "type": "geojson",
    "addLayerParams": {
      "default": {
        "type": "circle",
        "paint":{
        // make circles larger as the user zooms from z12 to z22
        'circle-radius': [
            'match',
            ['get', 'harborsize'],
            'V', 2,
            'S', 4,
            'M', 6,
            'L', 8,
            /* other */ 5
        ],
<<<<<<< HEAD
        //                 {
        //     'base': 1.75,
        //     'stops': [[2, 2], [12, 180]]
        // },
        // color circles by ethnicity, using a match expression
        // https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-match
=======
>>>>>>> 7a6689b297a3e4ee47580a2e0e061f8a98253aea
        'circle-color':
         [
             'match',
            ['get', 'harbortype'],
<<<<<<< HEAD
             'CB', '#1F2E75',
             'CN', '#1F2E75',
             'CT', '#1F2E75',
             'LC', '#00AEDA',
             'RB', '#5769D3',
             'RN', '#5769D3',
             'RT', '#5769D3',

             /* other */ '#cfd9df'
=======
             'coastal', '#f83600',
             'lake', '#ff5858',
             'river', '#fee140',


             /* other */ '#808080'
>>>>>>> 7a6689b297a3e4ee47580a2e0e061f8a98253aea
         ]
        ,
        'circle-stroke-color':
            [
            'match',
            ['get', 'harbortype'],
<<<<<<< HEAD
             'CB', '#ccc',
             'CN', '#ccc',
             'CT', '#ccc',
             'LC', '#ccc',
             'RB', '#ccc',
             'RN', '#ccc',
             'RT', '#ccc',
=======
             'coastal', '#ccc',
             'lake', '#ccc',
             'river', '#ccc',
>>>>>>> 7a6689b297a3e4ee47580a2e0e061f8a98253aea

            /* other */ '#ccc'
        ]
        ,
        'circle-stroke-width': 0.5
        }

      }
    },
    tooltip: function(_data) {
      console.log(_data);

      // Could deal with hyphenated words too ...
      var portName = _data.properties.port_name.toLowerCase().split(' ');

      portName = portName.map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')

      // portName.charAt(portName.indexOf('-') + 1).toUpperCase()

      return "<h5 class='mb-0'>"  + portName + "</h5>";
    }
  },
  {
<<<<<<< HEAD
    "name": "ports-busiest",
=======
    "name": "busiest-global-ports",
>>>>>>> 7a6689b297a3e4ee47580a2e0e061f8a98253aea
    "path": "./data/ports.json",
    "type": "geojson",
    "addLayerParams": {
      "default": {
        "type": "circle",
        "paint": {
          "circle-radius": 3,
          "circle-color": "#537895"
        },
        "filter": ["==", "top_20_busiest_ports", ""]
      }
    },
    tooltip: function(_data) {
      console.log(_data);
      // pop tooltip with data.
    }
  },
  {
<<<<<<< HEAD
    "name": "ports-uk",
=======
    "name": "uK-ports-filter",
>>>>>>> 7a6689b297a3e4ee47580a2e0e061f8a98253aea
    "path": "./data/ports.json",
    "type": "geojson",
    "addLayerParams": {
      "default": {
        "type": "circle",
        "paint": {
          "circle-radius": 3,
          "circle-color": "#537895"
        },
        "filter": ["==", "iso3", ""]
      }
    },
    tooltip: function(_data) {
      console.log(_data);
      // pop tooltip with data.
    }
  },
  {
<<<<<<< HEAD
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
      console.log(_data);
      // pop tooltip with data.
    }
  },

  {
=======
>>>>>>> 7a6689b297a3e4ee47580a2e0e061f8a98253aea
    "name": "3d-buildings",
    "path": "none",
    "type": "mapbox",
    "addLayerParams": {
<<<<<<< HEAD
      'id': '3d-buildings',
=======
      // 'id': '3d-buildings',
>>>>>>> 7a6689b297a3e4ee47580a2e0e061f8a98253aea
      'source': 'composite',
      'source-layer': 'building',
      'filter': ['==', 'extrude', 'true'],
      'type': 'fill-extrusion',
      'minzoom': 10,
      'paint': {
        'fill-extrusion-color': '#aaa',

        // use an 'interpolate' expression to add a smooth transition effect to the
        // buildings as the user zooms in
        'fill-extrusion-height': [
          "interpolate", ["linear"],
          ["zoom"],
          15, 0,
          15.05, ["get", "height"]
        ],
        'fill-extrusion-base': [
          "interpolate", ["linear"],
          ["zoom"],
          15, 0,
          15.05, ["get", "min_height"]
        ],
        'fill-extrusion-opacity': .6
      }
    }
  },
<<<<<<< HEAD
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
      console.log(_data);
      // pop tooltip with data.
    }
  }
=======
>>>>>>> 7a6689b297a3e4ee47580a2e0e061f8a98253aea
];
