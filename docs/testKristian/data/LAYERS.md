# layers.js

The `./layers.js` file assigns list of objects to a global variable, `layersData`. Each object in the list has the information needed to add the layer to the map.

Some layers are loaded from `geojson` files stored in this folder (`data/`); others are loaded from Mapbox as vector tilesets. These objects have `"type": "mapbox"` as one of their attributes.

An example layer object is explained below. This code could be copied and executed in the browser console and should work.

```javascript

var exampleMapboxLayerObject = layersData[2];

console.log("Layer type:", exampleMapboxLayerObject.type);
// outputs "mapbox"

// The layer will be added to the map by passing addLayerParams ..


console.log("Object passed into map.addLayer() method on map load:\n", exampleMapboxLayerObject.addLayerParams.default);

// ... into the map.addLayer() method, as on line 116 of ../scripts/load-map.js

// So changing the style as defined in addLayerParams in layers.js will change the style on the map:


```
