{
  "name": "railways",
  "path": "./data/tq-railways-simplifi.json",
  "type": "geojson",
  "addLayerParams": {
    "default": {
      "type": "line",
      "layout": {
        "line-join": "round",
        "line-cap": "round"
      },
      "paint": {
        "line-color": "#888",
        "line-width": 2
      }
    }
  },
  tooltip: function(_data) {
    console.log(_data);

  }
}
