var cardData = [
  {
    "extent": "global",
    "title": "World Trade: Exports",
    "content": "<p>Celerisque suscipit semper purus fringilla habitasse hac dignissim nibh facilisis torquent imperdiet semper dictum praesent dictum parturient. Ullamcorper ullamcorper cubilia fringilla adipiscing nisl condimentum parturient vestibulum cursus purus parturient condimentum ante ullamcorper platea senectus semper. Ultricies curae egestas molestie blandit parturient nullam fusce etiam laoreet adipiscing facilisi sociosqu per a posuere mi. Nisi condimentum odio magnis a a duis metus morbi sagittis habitant hac lacinia condimentum arcu nullam a morbi vestibulum parturient pulvinar nunc hendrerit vestibulum himenaeos.</p><p>Sagittis nisi libero interdum hac curabitur nam duis a congue parturient justo bibendum congue nibh litora.Tempor parturient.</p><p>Celerisque suscipit semper purus fringilla habitasse hac dignissim nibh facilisis torquent imperdiet semper dictum praesent dictum parturient. Ullamcorper ullamcorper cubilia fringilla adipiscing nisl condimentum parturient vestibulum cursus purus parturient condimentum ante ullamcorper platea senectus semper. Ultricies curae egestas molestie blandit parturient nullam fusce etiam laoreet adipiscing facilisi sociosqu per a posuere mi. Nisi condimentum odio magnis a a duis metus morbi sagittis habitant hac lacinia condimentum arcu nullam a morbi vestibulum parturient pulvinar nunc hendrerit vestibulum himenaeos.</p><p>Sagittis nisi libero interdum hac curabitur nam duis a congue parturient justo bibendum congue nibh litora.Tempor parturient.</p><div id='exports-bar-chart' class='col-12'></div><p>Celerisque suscipit semper purus fringilla habitasse hac dignissim nibh facilisis torquent imperdiet semper dictum praesent dictum parturient. Ullamcorper ullamcorper cubilia fringilla adipiscing nisl condimentum parturient vestibulum cursus purus parturient condimentum ante ullamcorper platea senectus semper. Ultricies curae egestas molestie blandit parturient nullam fusce etiam laoreet adipiscing facilisi sociosqu per a posuere mi. Nisi condimentum odio magnis a a duis metus morbi sagittis habitant hac lacinia condimentum arcu nullam a morbi vestibulum parturient pulvinar nunc hendrerit vestibulum himenaeos.</p><p>Sagittis nisi libero interdum hac curabitur nam duis a congue parturient justo bibendum congue nibh litora.Tempor parturient.</p>",
    "layers": ['export-countries'],
    "flyTo": {
      "bearing": 0,
      "center": [99.44084624, 22.10876354],
      "zoom": 2,
      "pitch": 0
    },
    "featureContent": {
      // country-specific pie charts.
      "chartType": "bar"

    },
    loadCard: function (_i, _params) {
      // Load countries layer with Exports choropleth colors
      console.log(_i, _params)

      var exportersBarChartParams = {
        "chartType": "bar",
        "valueType": "value", // or "amount"
        "title": "Top Five Exporting Countries",
        "dataPath": "./data/top_five_exporters.csv",
        "yAxisLabel": "Billions (USD)",

      };


      createBarChart(exportersBarChartParams, "#exports-bar-chart");
      // loadFeatureContent(_params.)

    },
    updateFeature: function (_featureMetadata) {
      console.log(_featureMetadata);

      var featureSelector = '#' + cardData[activeCardNum].extent
        + '-card-' + activeCardNum + ' .feature';

      var featureDiv = d3.select( featureSelector )
        .select('.card-body').html('');

      featureDiv.append('h4')
        .text(_featureMetadata.properties.name)

      var featureContent = featureDiv
        .append('div')
          .classed('col-12', true)
        .append('div')
          .classed('row', true);

      featureContent.append('div')
        .classed('col-6', true)
        .append('p')
        .text('Total Exports: ' + _featureMetadata.properties.all_commodities_export);

      featureContent.append('div')
        .classed('col-6 pie-chart', true);

      var pieData = {a: "xxxx"};

      buildPieChart(featureSelector + ' .pie-chart', pieData);



    }
  },
  {
    "extent": "global",
    "title": "World Trade: Imports",
    "content": "<p>Celerisque suscipit semper purus fringilla habitasse hac dignissim nibh facilisis torquent imperdiet semper dictum praesent dictum parturient. Ullamcorper ullamcorper cubilia fringilla adipiscing nisl condimentum parturient vestibulum cursus purus parturient condimentum ante ullamcorper platea senectus semper. Ultricies curae egestas molestie blandit parturient nullam fusce etiam laoreet adipiscing facilisi sociosqu per a posuere mi. Nisi condimentum odio magnis a a duis metus morbi sagittis habitant hac lacinia condimentum arcu nullam a morbi vestibulum parturient pulvinar nunc hendrerit vestibulum himenaeos.</p><div id='imports-bar-chart' class='col-12'></div><p>Sagittis nisi libero interdum hac curabitur nam duis a congue parturient justo bibendum congue nibh litora.Tempor parturient.</p><p>Celerisque suscipit semper purus fringilla habitasse hac dignissim nibh facilisis torquent imperdiet semper dictum praesent dictum parturient. Ullamcorper ullamcorper cubilia fringilla adipiscing nisl condimentum parturient vestibulum cursus purus parturient condimentum ante ullamcorper platea senectus semper. Ultricies curae egestas molestie blandit parturient nullam fusce etiam laoreet adipiscing facilisi sociosqu per a posuere mi. Nisi condimentum odio magnis a a duis metus morbi sagittis habitant hac lacinia condimentum arcu nullam a morbi vestibulum parturient pulvinar nunc hendrerit vestibulum himenaeos.</p><p>Sagittis nisi libero interdum hac curabitur nam duis a congue parturient justo bibendum congue nibh litora.Tempor parturient.</p><p>Celerisque suscipit semper purus fringilla habitasse hac dignissim nibh facilisis torquent imperdiet semper dictum praesent dictum parturient. Ullamcorper ullamcorper cubilia fringilla adipiscing nisl condimentum parturient vestibulum cursus purus parturient condimentum ante ullamcorper platea senectus semper. Ultricies curae egestas molestie blandit parturient nullam fusce etiam laoreet adipiscing facilisi sociosqu per a posuere mi. Nisi condimentum odio magnis a a duis metus morbi sagittis habitant hac lacinia condimentum arcu nullam a morbi vestibulum parturient pulvinar nunc hendrerit vestibulum himenaeos.</p><p>Sagittis nisi libero interdum hac curabitur nam duis a congue parturient justo bibendum congue nibh litora.Tempor parturient.</p>",
    "layers": ['import-countries'],
    "flyTo": {
      "bearing": 0,
      "center": [99.44084624, 22.10876354],
      "zoom": 2,
      "pitch": 0
    },
    "featureContent": {

    },
    loadCard: function ( _params ) {
      // Set countries layer style to Imports choropleth colors
      var importersBarChartParams = {
        "chartType": "bar",
        "valueType": "value", // or "amount"
        "title": "Top Five Importing Countries",
        "dataPath": "./data/top_five_importers.csv",
        "yAxisLabel": "Billions (USD)",

      };


      createBarChart(importersBarChartParams, "#imports-bar-chart");
      // loadFeatureContent(_params.)

    },
    updateFeature: function (_featureMetadata) {
      console.log(_featureMetadata);
    }
  },
  {
  "extent": "global",
  "title": "Air Transport",
  "content": "<p>Celerisque suscipit semper purus fringilla habitasse hac dignissim nibh facilisis torquent imperdiet semper dictum praesent dictum parturient. Ullamcorper ullamcorper cubilia fringilla adipiscing nisl condimentum parturient vestibulum cursus purus parturient condimentum ante ullamcorper platea senectus semper. Ultricies curae egestas molestie blandit parturient nullam fusce etiam laoreet adipiscing facilisi sociosqu per a posuere mi. Nisi condimentum odio magnis a a duis metus morbi sagittis habitant hac lacinia condimentum arcu nullam a morbi vestibulum parturient pulvinar nunc hendrerit vestibulum himenaeos.</p><p>Sagittis nisi libero interdum hac curabitur nam duis a congue parturient justo bibendum congue nibh litora.Tempor parturient.</p><p>Celerisque suscipit semper purus fringilla habitasse hac dignissim nibh facilisis torquent imperdiet semper dictum praesent dictum parturient. Ullamcorper ullamcorper cubilia fringilla adipiscing nisl condimentum parturient vestibulum cursus purus parturient condimentum ante ullamcorper platea senectus semper. Ultricies curae egestas molestie blandit parturient nullam fusce etiam laoreet adipiscing facilisi sociosqu per a posuere mi. Nisi condimentum odio magnis a a duis metus morbi sagittis habitant hac lacinia condimentum arcu nullam a morbi vestibulum parturient pulvinar nunc hendrerit vestibulum himenaeos.</p><p>Sagittis nisi libero interdum hac curabitur nam duis a congue parturient justo bibendum congue nibh litora.Tempor parturient.</p><p>Celerisque suscipit semper purus fringilla habitasse hac dignissim nibh facilisis torquent imperdiet semper dictum praesent dictum parturient. Ullamcorper ullamcorper cubilia fringilla adipiscing nisl condimentum parturient vestibulum cursus purus parturient condimentum ante ullamcorper platea senectus semper. Ultricies curae egestas molestie blandit parturient nullam fusce etiam laoreet adipiscing facilisi sociosqu per a posuere mi. Nisi condimentum odio magnis a a duis metus morbi sagittis habitant hac lacinia condimentum arcu nullam a morbi vestibulum parturient pulvinar nunc hendrerit vestibulum himenaeos.</p><p>Sagittis nisi libero interdum hac curabitur nam duis a congue parturient justo bibendum congue nibh litora.Tempor parturient.</p>",
  "layers": ["airports-mapbox-data"],
  "flyTo": {
    "bearing": 0,
    "center": [99.44084624, 22.10876354],
    "zoom": 2,
    "pitch": 0
  },
  loadCard: function ( _params ) {

  },
  updateFeature: function (_featureMetadata) {
    console.log(_featureMetadata);
  }
},{
  "extent": "global",
  // "cardNum": 2,
  "title": "Sea Transport",
  "content": "<p>Celerisque suscipit semper purus fringilla habitasse hac dignissim nibh facilisis torquent imperdiet semper dictum praesent dictum parturient. Ullamcorper ullamcorper cubilia fringilla adipiscing nisl condimentum parturient vestibulum cursus purus parturient condimentum ante ullamcorper platea senectus semper. Ultricies curae egestas molestie blandit parturient nullam fusce etiam laoreet adipiscing facilisi sociosqu per a posuere mi. Nisi condimentum odio magnis a a duis metus morbi sagittis habitant hac lacinia condimentum arcu nullam a morbi vestibulum parturient pulvinar nunc hendrerit vestibulum himenaeos.</p><p>Sagittis nisi libero interdum hac curabitur nam duis a congue parturient justo bibendum congue nibh litora.Tempor parturient.</p><p>Celerisque suscipit semper purus fringilla habitasse hac dignissim nibh facilisis torquent imperdiet semper dictum praesent dictum parturient. Ullamcorper ullamcorper cubilia fringilla adipiscing nisl condimentum parturient vestibulum cursus purus parturient condimentum ante ullamcorper platea senectus semper. Ultricies curae egestas molestie blandit parturient nullam fusce etiam laoreet adipiscing facilisi sociosqu per a posuere mi. Nisi condimentum odio magnis a a duis metus morbi sagittis habitant hac lacinia condimentum arcu nullam a morbi vestibulum parturient pulvinar nunc hendrerit vestibulum himenaeos.</p><p>Sagittis nisi libero interdum hac curabitur nam duis a congue parturient justo bibendum congue nibh litora.Tempor parturient.</p><p>Celerisque suscipit semper purus fringilla habitasse hac dignissim nibh facilisis torquent imperdiet semper dictum praesent dictum parturient. Ullamcorper ullamcorper cubilia fringilla adipiscing nisl condimentum parturient vestibulum cursus purus parturient condimentum ante ullamcorper platea senectus semper. Ultricies curae egestas molestie blandit parturient nullam fusce etiam laoreet adipiscing facilisi sociosqu per a posuere mi. Nisi condimentum odio magnis a a duis metus morbi sagittis habitant hac lacinia condimentum arcu nullam a morbi vestibulum parturient pulvinar nunc hendrerit vestibulum himenaeos.</p><p>Sagittis nisi libero interdum hac curabitur nam duis a congue parturient justo bibendum congue nibh litora.Tempor parturient.</p>",
  "layers": ["ports"],
  "flyTo": {
    "bearing": 0,
    "center": [40.15591514, 51.51830379],
    "zoom": 2.5,
    "pitch": 0
  },
  loadCard: function ( _params ) {

  }
},{
  "extent": "global",
  // "cardNum": 3,
  "title": "UK Trading Partners",
  "content": "<p>Celerisque suscipit semper purus fringilla habitasse hac dignissim nibh facilisis torquent imperdiet semper dictum praesent dictum parturient. Ullamcorper ullamcorper cubilia fringilla adipiscing nisl condimentum parturient vestibulum cursus purus parturient condimentum ante ullamcorper platea senectus semper. Ultricies curae egestas molestie blandit parturient nullam fusce etiam laoreet adipiscing facilisi sociosqu per a posuere mi. Nisi condimentum odio magnis a a duis metus morbi sagittis habitant hac lacinia condimentum arcu nullam a morbi vestibulum parturient pulvinar nunc hendrerit vestibulum himenaeos.</p><p>Sagittis nisi libero interdum hac curabitur nam duis a congue parturient justo bibendum congue nibh litora.Tempor parturient.</p><p>Celerisque suscipit semper purus fringilla habitasse hac dignissim nibh facilisis torquent imperdiet semper dictum praesent dictum parturient. Ullamcorper ullamcorper cubilia fringilla adipiscing nisl condimentum parturient vestibulum cursus purus parturient condimentum ante ullamcorper platea senectus semper. Ultricies curae egestas molestie blandit parturient nullam fusce etiam laoreet adipiscing facilisi sociosqu per a posuere mi. Nisi condimentum odio magnis a a duis metus morbi sagittis habitant hac lacinia condimentum arcu nullam a morbi vestibulum parturient pulvinar nunc hendrerit vestibulum himenaeos.</p><p>Sagittis nisi libero interdum hac curabitur nam duis a congue parturient justo bibendum congue nibh litora.Tempor parturient.</p><p>Celerisque suscipit semper purus fringilla habitasse hac dignissim nibh facilisis torquent imperdiet semper dictum praesent dictum parturient. Ullamcorper ullamcorper cubilia fringilla adipiscing nisl condimentum parturient vestibulum cursus purus parturient condimentum ante ullamcorper platea senectus semper. Ultricies curae egestas molestie blandit parturient nullam fusce etiam laoreet adipiscing facilisi sociosqu per a posuere mi. Nisi condimentum odio magnis a a duis metus morbi sagittis habitant hac lacinia condimentum arcu nullam a morbi vestibulum parturient pulvinar nunc hendrerit vestibulum himenaeos.</p><p>Sagittis nisi libero interdum hac curabitur nam duis a congue parturient justo bibendum congue nibh litora.Tempor parturient.</p>",
  "layers": ["china-demo-poly"],
  "flyTo": {
    "bearing": 0,
    "center": [110.776993, 23.210617],
    "zoom": 5.5,
    "pitch": 0
  }
},
{
  "extent": "national",
  // "cardNum": 3,
  "title": "The UK in the World",
  "content": "<p>Celerisque suscipit semper purus fringilla habitasse hac dignissim nibh facilisis torquent imperdiet semper dictum praesent dictum parturient. Ullamcorper ullamcorper cubilia fringilla adipiscing nisl condimentum parturient vestibulum cursus purus parturient condimentum ante ullamcorper platea senectus semper. Ultricies curae egestas molestie blandit parturient nullam fusce etiam laoreet adipiscing facilisi sociosqu per a posuere mi. Nisi condimentum odio magnis a a duis metus morbi sagittis habitant hac lacinia condimentum arcu nullam a morbi vestibulum parturient pulvinar nunc hendrerit vestibulum himenaeos.</p><p>Sagittis nisi libero interdum hac curabitur nam duis a congue parturient justo bibendum congue nibh litora.Tempor parturient.</p><p>Celerisque suscipit semper purus fringilla habitasse hac dignissim nibh facilisis torquent imperdiet semper dictum praesent dictum parturient. Ullamcorper ullamcorper cubilia fringilla adipiscing nisl condimentum parturient vestibulum cursus purus parturient condimentum ante ullamcorper platea senectus semper. Ultricies curae egestas molestie blandit parturient nullam fusce etiam laoreet adipiscing facilisi sociosqu per a posuere mi. Nisi condimentum odio magnis a a duis metus morbi sagittis habitant hac lacinia condimentum arcu nullam a morbi vestibulum parturient pulvinar nunc hendrerit vestibulum himenaeos.</p><p>Sagittis nisi libero interdum hac curabitur nam duis a congue parturient justo bibendum congue nibh litora.Tempor parturient.</p><p>Celerisque suscipit semper purus fringilla habitasse hac dignissim nibh facilisis torquent imperdiet semper dictum praesent dictum parturient. Ullamcorper ullamcorper cubilia fringilla adipiscing nisl condimentum parturient vestibulum cursus purus parturient condimentum ante ullamcorper platea senectus semper. Ultricies curae egestas molestie blandit parturient nullam fusce etiam laoreet adipiscing facilisi sociosqu per a posuere mi. Nisi condimentum odio magnis a a duis metus morbi sagittis habitant hac lacinia condimentum arcu nullam a morbi vestibulum parturient pulvinar nunc hendrerit vestibulum himenaeos.</p><p>Sagittis nisi libero interdum hac curabitur nam duis a congue parturient justo bibendum congue nibh litora.Tempor parturient.</p>",
  "layers": ["china-demo-poly"],
  "flyTo": {
    "bearing": 0,
    "center": [8.43025502683804, 53.19428441594809],
    "zoom": 5,
    "pitch": 0
  }
},
{
  "extent": "national",
  // "cardNum": 3,
  "title": "British Air Transport",
  "content": "<p>Celerisque suscipit semper purus fringilla habitasse hac dignissim nibh facilisis torquent imperdiet semper dictum praesent dictum parturient. Ullamcorper ullamcorper cubilia fringilla adipiscing nisl condimentum parturient vestibulum cursus purus parturient condimentum ante ullamcorper platea senectus semper. Ultricies curae egestas molestie blandit parturient nullam fusce etiam laoreet adipiscing facilisi sociosqu per a posuere mi. Nisi condimentum odio magnis a a duis metus morbi sagittis habitant hac lacinia condimentum arcu nullam a morbi vestibulum parturient pulvinar nunc hendrerit vestibulum himenaeos.</p><p>Sagittis nisi libero interdum hac curabitur nam duis a congue parturient justo bibendum congue nibh litora.Tempor parturient.</p><p>Celerisque suscipit semper purus fringilla habitasse hac dignissim nibh facilisis torquent imperdiet semper dictum praesent dictum parturient. Ullamcorper ullamcorper cubilia fringilla adipiscing nisl condimentum parturient vestibulum cursus purus parturient condimentum ante ullamcorper platea senectus semper. Ultricies curae egestas molestie blandit parturient nullam fusce etiam laoreet adipiscing facilisi sociosqu per a posuere mi. Nisi condimentum odio magnis a a duis metus morbi sagittis habitant hac lacinia condimentum arcu nullam a morbi vestibulum parturient pulvinar nunc hendrerit vestibulum himenaeos.</p><p>Sagittis nisi libero interdum hac curabitur nam duis a congue parturient justo bibendum congue nibh litora.Tempor parturient.</p><p>Celerisque suscipit semper purus fringilla habitasse hac dignissim nibh facilisis torquent imperdiet semper dictum praesent dictum parturient. Ullamcorper ullamcorper cubilia fringilla adipiscing nisl condimentum parturient vestibulum cursus purus parturient condimentum ante ullamcorper platea senectus semper. Ultricies curae egestas molestie blandit parturient nullam fusce etiam laoreet adipiscing facilisi sociosqu per a posuere mi. Nisi condimentum odio magnis a a duis metus morbi sagittis habitant hac lacinia condimentum arcu nullam a morbi vestibulum parturient pulvinar nunc hendrerit vestibulum himenaeos.</p><p>Sagittis nisi libero interdum hac curabitur nam duis a congue parturient justo bibendum congue nibh litora.Tempor parturient.</p>",
  "layers": ["airports-mapbox-data"],
  "flyTo": {
    "bearing": 0,
    "center": [8.43025502683804, 53.19428441594809],
    "zoom": 5,
    "pitch": 0
  }
},
{
  "extent": "national",
  // "cardNum": 3,
  "title": "British Maritime Transport",
  "content": "<p>Celerisque suscipit semper purus fringilla habitasse hac dignissim nibh facilisis torquent imperdiet semper dictum praesent dictum parturient. Ullamcorper ullamcorper cubilia fringilla adipiscing nisl condimentum parturient vestibulum cursus purus parturient condimentum ante ullamcorper platea senectus semper. Ultricies curae egestas molestie blandit parturient nullam fusce etiam laoreet adipiscing facilisi sociosqu per a posuere mi. Nisi condimentum odio magnis a a duis metus morbi sagittis habitant hac lacinia condimentum arcu nullam a morbi vestibulum parturient pulvinar nunc hendrerit vestibulum himenaeos.</p><p>Sagittis nisi libero interdum hac curabitur nam duis a congue parturient justo bibendum congue nibh litora.Tempor parturient.</p><p>Celerisque suscipit semper purus fringilla habitasse hac dignissim nibh facilisis torquent imperdiet semper dictum praesent dictum parturient. Ullamcorper ullamcorper cubilia fringilla adipiscing nisl condimentum parturient vestibulum cursus purus parturient condimentum ante ullamcorper platea senectus semper. Ultricies curae egestas molestie blandit parturient nullam fusce etiam laoreet adipiscing facilisi sociosqu per a posuere mi. Nisi condimentum odio magnis a a duis metus morbi sagittis habitant hac lacinia condimentum arcu nullam a morbi vestibulum parturient pulvinar nunc hendrerit vestibulum himenaeos.</p><p>Sagittis nisi libero interdum hac curabitur nam duis a congue parturient justo bibendum congue nibh litora.Tempor parturient.</p><p>Celerisque suscipit semper purus fringilla habitasse hac dignissim nibh facilisis torquent imperdiet semper dictum praesent dictum parturient. Ullamcorper ullamcorper cubilia fringilla adipiscing nisl condimentum parturient vestibulum cursus purus parturient condimentum ante ullamcorper platea senectus semper. Ultricies curae egestas molestie blandit parturient nullam fusce etiam laoreet adipiscing facilisi sociosqu per a posuere mi. Nisi condimentum odio magnis a a duis metus morbi sagittis habitant hac lacinia condimentum arcu nullam a morbi vestibulum parturient pulvinar nunc hendrerit vestibulum himenaeos.</p><p>Sagittis nisi libero interdum hac curabitur nam duis a congue parturient justo bibendum congue nibh litora.Tempor parturient.</p>",
  "layers": ["ports"],
  "flyTo": {
    "bearing": 0,
    "center": [8.43025502683804, 53.19428441594809],
    "zoom": 5,
    "pitch": 0
  }
},
{
  "extent": "local",
  "title": "Heathrow: A critical airport",
  "content": "<p>Celerisque suscipit semper purus fringilla habitasse hac dignissim nibh facilisis torquent imperdiet semper dictum praesent dictum parturient. Ullamcorper ullamcorper cubilia fringilla adipiscing nisl condimentum parturient vestibulum cursus purus parturient condimentum ante ullamcorper platea senectus semper. Ultricies curae egestas molestie blandit parturient nullam fusce etiam laoreet adipiscing facilisi sociosqu per a posuere mi. Nisi condimentum odio magnis a a duis metus morbi sagittis habitant hac lacinia condimentum arcu nullam a morbi vestibulum parturient pulvinar nunc hendrerit vestibulum himenaeos.</p><p>Sagittis nisi libero interdum hac curabitur nam duis a congue parturient justo bibendum congue nibh litora.Tempor parturient.</p><p>Celerisque suscipit semper purus fringilla habitasse hac dignissim nibh facilisis torquent imperdiet semper dictum praesent dictum parturient. Ullamcorper ullamcorper cubilia fringilla adipiscing nisl condimentum parturient vestibulum cursus purus parturient condimentum ante ullamcorper platea senectus semper. Ultricies curae egestas molestie blandit parturient nullam fusce etiam laoreet adipiscing facilisi sociosqu per a posuere mi. Nisi condimentum odio magnis a a duis metus morbi sagittis habitant hac lacinia condimentum arcu nullam a morbi vestibulum parturient pulvinar nunc hendrerit vestibulum himenaeos.</p><p>Sagittis nisi libero interdum hac curabitur nam duis a congue parturient justo bibendum congue nibh litora.Tempor parturient.</p><p>Celerisque suscipit semper purus fringilla habitasse hac dignissim nibh facilisis torquent imperdiet semper dictum praesent dictum parturient. Ullamcorper ullamcorper cubilia fringilla adipiscing nisl condimentum parturient vestibulum cursus purus parturient condimentum ante ullamcorper platea senectus semper. Ultricies curae egestas molestie blandit parturient nullam fusce etiam laoreet adipiscing facilisi sociosqu per a posuere mi. Nisi condimentum odio magnis a a duis metus morbi sagittis habitant hac lacinia condimentum arcu nullam a morbi vestibulum parturient pulvinar nunc hendrerit vestibulum himenaeos.</p><p>Sagittis nisi libero interdum hac curabitur nam duis a congue parturient justo bibendum congue nibh litora.Tempor parturient.</p>",
  "layers": ["ports"],
  "flyTo": {
    "bearing": 0,
    "center": [-0.4172184, 51.457262],
    "zoom": 12.9,
    "pitch": 0
  }
},
{
  "extent": "local",
  "title": "Portsmouth: A major port",
  "content": "<p>Celerisque suscipit semper purus fringilla habitasse hac dignissim nibh facilisis torquent imperdiet semper dictum praesent dictum parturient. Ullamcorper ullamcorper cubilia fringilla adipiscing nisl condimentum parturient vestibulum cursus purus parturient condimentum ante ullamcorper platea senectus semper. Ultricies curae egestas molestie blandit parturient nullam fusce etiam laoreet adipiscing facilisi sociosqu per a posuere mi. Nisi condimentum odio magnis a a duis metus morbi sagittis habitant hac lacinia condimentum arcu nullam a morbi vestibulum parturient pulvinar nunc hendrerit vestibulum himenaeos.</p><p>Sagittis nisi libero interdum hac curabitur nam duis a congue parturient justo bibendum congue nibh litora.Tempor parturient.</p><p>Celerisque suscipit semper purus fringilla habitasse hac dignissim nibh facilisis torquent imperdiet semper dictum praesent dictum parturient. Ullamcorper ullamcorper cubilia fringilla adipiscing nisl condimentum parturient vestibulum cursus purus parturient condimentum ante ullamcorper platea senectus semper. Ultricies curae egestas molestie blandit parturient nullam fusce etiam laoreet adipiscing facilisi sociosqu per a posuere mi. Nisi condimentum odio magnis a a duis metus morbi sagittis habitant hac lacinia condimentum arcu nullam a morbi vestibulum parturient pulvinar nunc hendrerit vestibulum himenaeos.</p><p>Sagittis nisi libero interdum hac curabitur nam duis a congue parturient justo bibendum congue nibh litora.Tempor parturient.</p><p>Celerisque suscipit semper purus fringilla habitasse hac dignissim nibh facilisis torquent imperdiet semper dictum praesent dictum parturient. Ullamcorper ullamcorper cubilia fringilla adipiscing nisl condimentum parturient vestibulum cursus purus parturient condimentum ante ullamcorper platea senectus semper. Ultricies curae egestas molestie blandit parturient nullam fusce etiam laoreet adipiscing facilisi sociosqu per a posuere mi. Nisi condimentum odio magnis a a duis metus morbi sagittis habitant hac lacinia condimentum arcu nullam a morbi vestibulum parturient pulvinar nunc hendrerit vestibulum himenaeos.</p><p>Sagittis nisi libero interdum hac curabitur nam duis a congue parturient justo bibendum congue nibh litora.Tempor parturient.</p>",
  "layers": ["ports"],
  "flyTo": {
    "bearing": 0,
    "center": [-1.074524,  50.808575],
    "zoom": 12.5,
    "pitch": 0
  }
},
{
  "extent": "local",
  "title": "Conclusion",
  "content": "<p>Celerisque suscipit semper purus fringilla habitasse hac dignissim nibh facilisis torquent imperdiet semper dictum praesent dictum parturient. Ullamcorper ullamcorper cubilia fringilla adipiscing nisl condimentum parturient vestibulum cursus purus parturient condimentum ante ullamcorper platea senectus semper. Ultricies curae egestas molestie blandit parturient nullam fusce etiam laoreet adipiscing facilisi sociosqu per a posuere mi. Nisi condimentum odio magnis a a duis metus morbi sagittis habitant hac lacinia condimentum arcu nullam a morbi vestibulum parturient pulvinar nunc hendrerit vestibulum himenaeos.</p><p>Sagittis nisi libero interdum hac curabitur nam duis a congue parturient justo bibendum congue nibh litora.Tempor parturient.</p><p>Celerisque suscipit semper purus fringilla habitasse hac dignissim nibh facilisis torquent imperdiet semper dictum praesent dictum parturient. Ullamcorper ullamcorper cubilia fringilla adipiscing nisl condimentum parturient vestibulum cursus purus parturient condimentum ante ullamcorper platea senectus semper. Ultricies curae egestas molestie blandit parturient nullam fusce etiam laoreet adipiscing facilisi sociosqu per a posuere mi. Nisi condimentum odio magnis a a duis metus morbi sagittis habitant hac lacinia condimentum arcu nullam a morbi vestibulum parturient pulvinar nunc hendrerit vestibulum himenaeos.</p><p>Sagittis nisi libero interdum hac curabitur nam duis a congue parturient justo bibendum congue nibh litora.Tempor parturient.</p><p>Celerisque suscipit semper purus fringilla habitasse hac dignissim nibh facilisis torquent imperdiet semper dictum praesent dictum parturient. Ullamcorper ullamcorper cubilia fringilla adipiscing nisl condimentum parturient vestibulum cursus purus parturient condimentum ante ullamcorper platea senectus semper. Ultricies curae egestas molestie blandit parturient nullam fusce etiam laoreet adipiscing facilisi sociosqu per a posuere mi. Nisi condimentum odio magnis a a duis metus morbi sagittis habitant hac lacinia condimentum arcu nullam a morbi vestibulum parturient pulvinar nunc hendrerit vestibulum himenaeos.</p><p>Sagittis nisi libero interdum hac curabitur nam duis a congue parturient justo bibendum congue nibh litora.Tempor parturient.</p>",
  "layers": [],
  "flyTo": {
    "bearing": 0,
    "center": [99.44084624, 22.10876354],
    "zoom": 2,
    "pitch": 0
  }
}


]
