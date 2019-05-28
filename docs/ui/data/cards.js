var cardData = [
  {
    "extent": "global",
    "title": "World Trade: Exports",
    "content": `
    <div class='row mb-3'>
      <div class='col-6'>
          <h5>Export volumes, <span id='export-year'>2014</span></h5>
          </div>
          <div class='col-6'>
            <input id='exports-slider' class='' type='range' min='2014' max='2017' step='1' value='2014' />
          </div>
      </div>
    </div>
    <p>This map displays exports of eight categories of products by country are related respectively. The colour of polygons shows the total export volume. </p>

      <div id='exports-bar-chart' class='col-12'></div> <!-- We need to add a bar chart here. -->
      <!-- <img src='./assets/images/top5exporters.jpeg' class='img-fluid' alt='Hong Kong Airport'> -->
      <h4 class='display-4'>Facts</h4>
      <ul>
        <li>United States and China are magnates of exporting countries, followed by Germany, Japan and South Korea. </li>
        <li>In the barchart related to 2017 total export volumes, China is the largest exporting country in 2017, which leads the world with its exporting worth 2,200 billion US dollars. </li>
        <li>From the main eight categories, it can be seen that technical has become the major country’s exports for China and U.S. which have 981.57 billion dollars units and 376.46 billion dollars respectively. </li>
        <li>They both mainly export products in secondary sector. </li>
        <li>Organic products occupies the least shares of China’s total exports. Clothing occupies the least for U.S. </li>
      </ul>
    `,
    "layers": ['export-countries-volumes', 'export-countries-volumes-highlighted'],
    "flyTo": {
      "bearing": 0,
      "center": {"lng":-0.7973131555806958,"lat":34.84825706688895},
      "zoom": 1.2183705438114467,
      "pitch": 0
    },
    "featureContent": {
      // country-specific pie charts.
      "chartType": "bar"

    },
    loadCard: function(_i, _params) {

      // Set listener for slider:

      document.getElementById('exports-slider')
        .addEventListener('input', function(e) {
          var year = parseInt(e.target.value);

          colorCountriesBy(year, 'export');

          document.getElementById('export-year').textContent = year;
          // filterBy(year);
        });

      // Load countries layer with Exports choropleth colors

      var exportersBarChartParams = {
        "chartType": "bar",
        "valueType": "value", // or "amount"
        "title": "Top Five Exporting Countries",
        "dataPath": "./data/top_five_exporters.csv",
        "yAxisLabel": "Billions (USD)",
        'layerName': 'export-countries-volumes',

      };


      //createCustomBarChart(exportersBarChartParams, "#exports-bar-chart");
      createBarChart(exportersBarChartParams, "#exports-bar-chart");

      setFeatureContentText(_i, "country")

    },
    updateFeature: function(_featureMetadata, _lngLat) {
      console.log(_featureMetadata);

      var featureSelector = currentCardId() + ' .feature';

      var featureDiv = d3.select(featureSelector)
        .select('.card-body').html('');

      var headerSpan = featureDiv.append('h3')
        .classed('display-3 mb-0', true)
        .text(_featureMetadata.properties.name);

      featureDiv.append('p')
        .classed('header-span', true)
        .text('Exports by category (billion USD)')

      // featureDiv.append('p')
      //   .text('Total Exports (million USD): ' + _featureMetadata.properties.all_commodities_export);

      var featureContent = featureDiv
        .append('div')
        .classed('col-12', true)
        .append('div')
        .classed('row', true);

      featureContent.append('div')
        .classed('col-12 pie-chart-holder', true);

      var pieData = {
        data: {
          'Organic Products': _featureMetadata.properties.organic_products_export,
          'Chemicals': _featureMetadata.properties.chemicals_export,
          'Materials': _featureMetadata.properties.material_export,
          'Clothing': _featureMetadata.properties.clothing_export,
          'Metals': _featureMetadata.properties.metals_export,
          'Technicals': _featureMetadata.properties.technical_export,
          'Transportation': _featureMetadata.properties.transportation_export,
          'Miscellaneous goods': _featureMetadata.properties.miscellaneous_goods_export
        }
      };

      createPieChart(pieData, featureSelector + ' .pie-chart-holder');

    },

  },
  {
    "extent": "global",
    "title": "World Trade: Imports",
    "content": `
      <div class='row mb-3'>
        <div class='col-6'>
            <h5>Import volumes, <span id='import-year'>2014</span></h5>
            </div>
            <div class='col-6'>
              <input id='imports-slider' class='' type='range' min='2014' max='2017' step='1' value='2014' />
            </div>
        </div>
      </div>
      <p>This map displays the 2017 imports of eight categories of products by country are related respectively. The colour of polygons shows the total import volume.</p>
      <!--This is a comment. We should add a bar chart here from this file ./file.csv-->
      <div id='imports-bar-chart' class='col-12'></div> <!-- We need to add a bar chart here. -->
      <!-- <img src='./assets/images/top5Importers.jpeg' class='img-fluid' alt='Hong Kong Airport'> -->
      <h4 class='display-4'>Facts</h4>
      <ul>
        <li>United States and China are magnates of importing countries, followed by Germany, Japan. </li>
        <li>The United Kingdom ranked the fifth with 627 billion US dollars. </li>
        <li>Compare with the export, Non-Asia countries have taken quite a large share in the import trade. </li>
        <li>Technical and materials are both major import goods for all countries.</li>
        <li>In 2017, the import volumes of technical in US and China are up to 705.5 million US dollars and 627.45 million US dollars respectively.  </li>
        </ul>
        <iframe width="100%" height="100" scrolling="no" frameborder="no" allow="autoplay" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/553784094&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true"></iframe>
    `,

    "layers": ['import-countries-volumes','import-countries-volumes-highlighted'],
    "flyTo": {
      "bearing": 0,
      "center": {"lng":-0.7973131555806958,"lat":34.84825706688895},
      "zoom": 1.2183705438114467,
      "pitch": 0
    },
    "featureContent": {

    },
    loadCard: function(_i, _params) {

      // Set event listener for temporal slider
      document.getElementById('imports-slider')
        .addEventListener('input', function(e) {
          var year = parseInt(e.target.value);

          colorCountriesBy(year, 'import')

          document.getElementById('import-year').textContent = year;
        });

      // Set countries layer style to Imports choropleth colors
      var importersBarChartParams = {
        "chartType": "bar",
        "valueType": "value", // or "amount"
        "title": "Top Five Importing Countries",
        "dataPath": "./data/top_five_importers.csv",
        "yAxisLabel": "Billions (USD)",
        'layerName': 'import-countries-volumes',

      };


      createBarChart(importersBarChartParams, "#imports-bar-chart");
      // loadFeatureContent(_params.)

      setFeatureContentText(_i, "country")



    },
    updateFeature: function(_featureMetadata, _lngLat) {
      console.log(_featureMetadata);

      var featureSelector = currentCardId() + ' .feature';

      var featureDiv = d3.select(featureSelector)
        .select('.card-body').html('');

      var headerSpan = featureDiv.append('h3')
        .classed('display-3 mb-0', true)
        .text(_featureMetadata.properties.name);

      featureDiv.append('p')
        .classed('header-span', true)
        .text('Imports by category (billion USD)')

      var featureContent = featureDiv
        .append('div')
        .classed('col-12', true)
        .append('div')
        .classed('row', true);

      featureContent.append('div')
        .classed('col-12 pie-chart-holder', true);

      var pieData = {
        data: {
          'Organic Products': _featureMetadata.properties.organic_products_import,
          'Chemicals': _featureMetadata.properties.chemicals_import,
          'Materials': _featureMetadata.properties.material_import,
          'Clothing': _featureMetadata.properties.clothing_import,
          'Metals': _featureMetadata.properties.metals_import,
          'Technicals': _featureMetadata.properties.technical_import,
          'Transportation': _featureMetadata.properties.transportation_import,
          'Miscellaneous goods': _featureMetadata.properties.miscellaneous_goods_import
        }
      };

      createPieChart(pieData, featureSelector + ' .pie-chart-holder');
    }
  },
  {
    "extent": "global",
    "title": "Global Air Transport",
    "content": `<p>The map displays globally distributed airports across different geographical areas, as well as their passed-through amounts in the year of 2017 (thousand tons).</p>


      <div id='top-five-airports-bar-chart' class='col-12'></div>


      <img src='./assets/images/hk-airport.jpg' class='img-fluid' alt='Hong Kong Airport'>
      <figcaption class="figure-caption mb-4">   <!--This is a comment. We should add a bar chart here from this file ./file.csv-->
        Hong Kong International Airport from a passenger airliner. <a href="https://www.youtube.com/watch?v=LT4qH8OwuvI" target="_blank">Source</a>
      </figcaption>
      <h4 class='display-4'>Facts</h4>
      <ul>
        <li>when looking at the air transport mode, most airports in Asia are located around southeast, south and China’s coastal region.</li>
        <li>Most airports are concentrated in the Mediterranean and Latin America.</li>
        <li>The top five ranking based on the 2017 passed-through amounts will be displayed in the bar chart, and it is worth mentioning that three out of the five airports are located in Asia, the rest in America.</li>
        <li>Hong Kong has become the busiest cargo hub in the world, the passed- through amounts has reaches up to 5049.90 thousand tonnes.</li>
      </ul>
    `,
    "layers": ["global-airports",'global-airports-highlighted'],
    "flyTo": {
      "bearing": 0,
      "center": {"lng":-0.7973131555806958,"lat":34.84825706688895},
      "zoom": 1.2183705438114467,
      "pitch": 0
    },
    loadCard: function(_i, _params) {

      var topAirportsBarChartParams = {
        "chartType": "bar",
        "valueType": "value", // or "amount"
        "title": "Top Five Global Airports by Volume",
        "dataPath": "./data/top_five_airports.csv",
        "yAxisLabel": "Air traffic volumes (thousand tons)",
        'layerName': 'global-airports',

      };


      createBarChart(topAirportsBarChartParams, "#top-five-airports-bar-chart");



      setFeatureContentText(_i, "airport")


    },
    updateFeature: function(_featureMetadata, _lngLat) {
      // console.log(_featureMetadata.geometry.coordinates);

      var featureSelector = currentCardId() + ' .feature';

      var featureDiv = d3.select(featureSelector)
        .select('.card-body').html('');

      var airportCoords = 'Latitude: ' + String(_lngLat.lat.toFixed(5)) +
        '<br />Longitude: ' + String(_lngLat.lng.toFixed(5))

      featureDiv.append('h3')
        .classed('feature-subheader mb-0', true)
        .text('Airport');

      var featureRow = featureDiv.append('div')
        .classed('row', true);

      var featureAirportCode = featureRow.append('div')
        .classed('col-12', true);

      featureAirportCode.append('h1')
        .classed('airport-code', true)
        .text(_featureMetadata.properties.abbrev);

      $('.airport-code').fitText(0.3);

      var coordsList = featureAirportCode.append('dl')
        .classed('row', true);

      coordsList.append('dt')
        .classed('col-4', true)
        .text('Latitude:');

      coordsList.append('dd')
        .classed('col-8', true)
        .text(String(_lngLat.lat.toFixed(5)));

      coordsList.append('dt')
        .classed('col-4', true)
        .text('Longitude:');

      coordsList.append('dd')
        .classed('col-8', true)
        .text(String(_lngLat.lng.toFixed(5)));

      coordsList.append('dt')
        .classed('col-4', true)
        .text('Name:');

      coordsList.append('dd')
        .classed('col-8', true)
        .text(_featureMetadata.properties.airport_name);

      coordsList.append('dt')
        .classed('col-4', true)
        .text('Country:');

      coordsList.append('dd')
        .classed('col-8', true)
        .text(_featureMetadata.properties.name);


      coordsList.append('dt')
        .classed('col-4', true)
        .text('Size:');

      coordsList.append('dd')
        .classed('col-8', true)
        .text(_featureMetadata.properties.size);

      coordsList.append('dt')
        .classed('col-4', true)
        .text('Usage:');

      coordsList.append('dd')
        .classed('col-8', true)
        .text(_featureMetadata.properties.usage);

      featureAirportCode.append('button')
        .attr('type', 'button')
        .classed('btn btn-block btn-outline-primary mb-1', true)
        .text('Fly to airport')
        .on('click', function(d) {
          map.flyTo({
            "bearing": 0,
            "center": _featureMetadata.geometry.coordinates,
            "zoom": 12.5,
            "pitch": 0
          })
        });

      featureAirportCode.append('a')
          .attr('href', _featureMetadata.properties.wikipedia)
          .attr('target', '_blank')
        .append('button')
          .attr('type', 'button')
          .classed('btn btn-block btn-outline-primary mb-1', true)
          .text('More info ...');


    }
  },
  {
    "extent": "global",
    "title": "Global Sea Transport",
    "content": `<p>The map displays globally distributed ports across different geographical areas, as well as their shipped-through amounts in the year of 2017 (thousand TEUs). </p>
      <div class='card border-secondary mb-3'>
        <div class='card-body'>
          <p class="lead mb-0">Click on the circle the airport is located to show its rank in the global busiest airports ranking.
          </p>
        </div>
      </div>

      <div id='top-five-ports-bar-chart' class='col-12'></div>

      <h4 class='display-4'>Facts</h4>
      <ul>
        <li>The number of ports decreases with increasing latitude.</li>
        <li>Most ports in Asia are concentrated near the equator.</li>
        <li>More ports are concentrated in Mediterranean compared with North Africa. </li>
        <li> In continent, there are ports only locate in the countries near coast.</li>

      </ul>
      <div class="embed-responsive embed-responsive-16by9">
        <iframe  class="embed-responsive-item" width="560" height="315" src="https://www.youtube.com/embed/LHRfRfBqPL0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
      </div>
      <figcaption class="figure-caption mb-4">
        A container terminal in Malaysia. <a href="https://www.youtube.com/embed/LHRfRfBqPL0" target="_blank">Source</a>
      </figcaption>
    `,
    "layers": ["global-ports","global-ports-highlighted"],
    "flyTo": {
      "bearing": 0,
      "center": {"lng":-0.7973131555806958,"lat":34.84825706688895},
      "zoom": 1.2183705438114467,
      "pitch": 0
    },
    loadCard: function(_i, _params) {
      // console.log('card load!', _params);
      setFeatureContentText(_i, "port")

      var topPortsBarChartParams = {
        "chartType": "bar",
        "valueType": "value", // or "amount"
        "title": "Top Five Global Ports by Volume",
        "dataPath": "./data/top_five_ports.csv",
        "yAxisLabel": "Port traffic volumes (thousand TEU)",
        'layerName': 'global-ports',

      };


      createBarChart(topPortsBarChartParams, "#top-five-ports-bar-chart");


    },
    updateFeature: function(_featureMetadata, _lngLat) {

      var featureSelector = currentCardId() + ' .feature';

      var featureDiv = d3.select(featureSelector)
        .select('.card-body').html('');

      // var headerSpan = featureDiv.append('span');

      // var portCoords = 'Latitude: ' +  +
      //   '&nbsp;&nbsp; Longitude: ' + String(_featureMetadata.properties.longitude.toFixed(5))

      featureDiv.append('h5')
        .classed('feature-subheader mb-0', true)
        .text('Port');

      var featureHeader = featureDiv.append('h3')
        .classed('display-3', true)
        .text(titleCase(_featureMetadata.properties.port_name));

      var portContent = featureDiv.append('div')
        .classed('row', true)

      var portContent = portContent.append('div')
        .classed('col-12', true);

      var portTable = portContent.append('dl')
        .classed('row', true);

      portTable.append('dt')
        .classed('col-4', true)
        .text('Country:');

      portTable.append('dd')
        .classed('col-8', true)
        .text(_featureMetadata.properties.country_name);

      portTable.append('dt')
        .classed('col-4', true)
        .text('Latitude:');

      portTable.append('dd')
        .classed('col-8', true)
        .text(String(_featureMetadata.properties.latitude.toFixed(5)))

      portTable.append('dt')
        .classed('col-4', true)
        .text('Longitude:');

      portTable.append('dd')
        .classed('col-8', true)
        .text(String(_featureMetadata.properties.longitude.toFixed(5)))

      var imgSrc = "https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v10/static/" +
        _featureMetadata.properties.longitude + ',' + _featureMetadata.properties.latitude +
        ',11,0,0/1000x250?access_token=' + mapboxgl.accessToken;


      portContent.append('img')
        .classed('img-fluid', true)
        // .attr('height', '250px')
        .attr('src', imgSrc)
        .classed('static-satellite', true)



      var luckyUrl = "http://www.google.com/search?q=Port+of+" + _featureMetadata.properties.port_name + "+wikipedia&btnI"

      portContent.append('button')
        .classed('btn-lg btn-block btn-outline-primary mb-1', true)
        .text("Fly to port.")
        .on('click', function(d) {

          map.flyTo({
            "bearing": 0,
            "center": [_featureMetadata.properties.longitude,
              _featureMetadata.properties.latitude
            ],
            "zoom": 12.5,
            "pitch": 0
          })
        });

      portContent
        .append('a')
        .attr('href', luckyUrl)
        .attr('target', '_blank')
        .append('button')
        .classed('btn-lg btn-block btn-outline-primary', true)
        .text("More info ...");


      // fea

      // featureDiv.append('p')
      //   .text(_featureMetadata.properties.airport_name);
      //
      // featureDiv.append('a')
      //   .attr('href', _featureMetadata.properties.wikipedia)
      //   .attr('target', '_blank')
      // .append('p')
      //   .text('Wikipedia');
    }
  },

  {
    "extent": "national",
    // "cardNum": 3,
    "title": "The UK in the World",
    "content": `<p>This page shows the UK airports and ports. From the map, the number of airports and ports decrease with increasing latitude. Two pie charts show the destination and provenance of the trades by both air and sea in 2017. </p>
          <h4>UK Port Traffic By Origin</h4>
          <div id="uk-ports-pie-chart" class='pie-chart-holder'></div>
          <h4>UK Airport Traffic By Origin</h4>
          <div id="uk-airports-pie-chart" class='pie-chart-holder'></div>

          <!--<div class='card border-secondary mb-3'> -->
      <!--<div class='card border-secondary mb-3'>
        <div class='card-body'>
          <p class="lead mb-0">Click on the circle the airport or the port is located to show its rank in the global busiest airports ranking.
          </p>
        </div>
      </div>-->
    `,
    "layers": ["uK-airports", 'uK-ports',"uK-airports-highlighted", 'uK-ports-highlighted'],
    "flyTo": {
      "bearing": 0,
      "center": {"lng":-4.06477115607197,"lat":54.7898644198018},
      "zoom": 4.5,
      "pitch": 0
    },
    loadCard: function (_i, _params) {
      console.log(_i, _params)

      d3.csv("./data/uk-port-pie.csv")
        .then(function (data) {
          var pieData = {};

          data.forEach(function (row) {
            pieData[row.type] = +row.value;
          })

          var pieParams = {
            data: pieData
          };



          console.log('PieData', pieParams);

          createPieChart(pieParams, '#uk-ports-pie-chart');

        });

        d3.csv("./data/uk-airport-pie.csv")
          .then(function (data) {
            var pieData = {};

            data.forEach(function (row) {
              pieData[row.type] = +row.value;
            })

            var pieParams = {
              data: pieData
            };

            console.log('PieData', pieData);

            createPieChart(pieParams, '#uk-airports-pie-chart');

          });


        var cardId = "#" + _params.extent + '-card-' + i;

        d3.select(cardId + ' .feature')
          .classed('d-none', true);


      // setFeatureContentText(_i, "country")

    }
  },
  {
    "extent": "national",
    // "cardNum": 3,
    "title": "British Air Transport",
    "content": `<p>This page shows the freight airports in the United Kingdom.</p>

      <div id='top-five-uk-airports-bar-chart' class='col-12'></div>

<figcaption class="figure-caption mb-4">
        The bar chart for The United Kingdom's airports.
      </figcaption>
     <p>The bar chart shows the top five busiest airports in the UK. It is clear that the value of the goods transported by Heathrow airport is much higher than any other airports (around 1.7 million tons), which is ten times more than the second (Manchester airport).
</p>
    `,
    "layers": ["uK-airports",'uK-airports-highlighted'],
    "flyTo": {
      "bearing": 0,
      "center": {"lng":-4.06477115607197,"lat":54.7898644198018},
      "zoom": 4.5,
      "pitch": 0
    },
    loadCard: function (_i, _params) {



            var topUKAirportsBarChartParams = {
              "chartType": "bar",
              "valueType": "value", // or "amount"
              "title": "Top Five British Airports by Volume",
              "dataPath": "./data/top_five_ukairports.csv",
              "yAxisLabel": "Airport traffic volumes (thousand tons)",
              'layerName': 'uK-airports',

            };


            createBarChart(topUKAirportsBarChartParams, "#top-five-uk-airports-bar-chart");

                    var cardId = "#" + _params.extent + '-card-' + i;

                    d3.select(cardId + ' .feature')
                      .classed('d-none', true);
    }
  },
  {
    "extent": "national",
    "title": "British Maritime Transport",
    "content":  `<p>This page shows the freight ports in the United Kingdom.</p>
      <div class='card border-secondary mb-3'>
        <div class='card-body'>
          <p class="lead mb-0">The heatmap display shipping traffic volumes based on AIS pings.
          </p>
        </div>
      </div>
      <div id='top-five-uk-ports-bar-chart' class='col-12'></div>
<figcaption class="figure-caption mb-4">
        The bar chart for The United Kingdom's ports.
      </figcaption>
     <p>The bar chart shows that the port of London is the busiest port in the UK, which transported about 50 million teus of goods in 2017, almost 20 million teus higher than the second.</p>
 `,
    "layers": ['uk-ais-points',"uK-ports", "uK-ports-highlighted"],
    "flyTo": {
      "bearing": 0,
      "center": {"lng":-4.06477115607197,"lat":54.7898644198018},
      "zoom": 4.5,
      "pitch": 0
    },
    loadCard: function (_i, _params) {

            var topUKPortsBarChartParams = {
              "chartType": "bar",
              "valueType": "value", // or "amount"
              "title": "Top Five British Ports by Volume",
              "dataPath": "./data/top_five_ukports.csv",
              "yAxisLabel": "Port traffic volumes (thousand TEU)",
              'layerName':'uK-ports',

            };


            createBarChart(topUKPortsBarChartParams, "#top-five-uk-ports-bar-chart");

                    var cardId = "#" + _params.extent + '-card-' + i;

                    d3.select(cardId + ' .feature')
                      .classed('d-none', true);

    }
  },
  {
    "extent": "local",
    "title": "Heathrow: A critical airport",
    "content": `<p>Heathrow is the busiest UK airport by both passenger traffic and cargo traffic. Heathrow Airport is used by over 80 airlines flying to 185 destinations in 84 countries. To the runway and four terminal buildings, it is one of the busiest airports in the UK and the world. The airport is the primary hub of British Airways and is a base for Virgin Atlantic. It has four passenger terminals (numbered 2 to 5) and a cargo terminal. </p>
      <div class='card border-secondary mb-3'>
        <div class='card-body'>
          <p class="lead mb-0">This page shows the facilities around Heathrow Airport in 5 kilometer's radius.
          </p>
        </div>
      </div>
      <div class="embed-responsive embed-responsive-16by9">
        <iframe class='embed-responsive-item' width="560" height="315" src="https://www.youtube.com/embed/LI_apMKa2c0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
      </div>
      <figcaption class="figure-caption mb-4">
        A Tale of Modern Britain. <a href="https://youtu.be/LI_apMKa2c0" target="_blank">Source</a>
      </figcaption>
      <h4>Heathrow Freight Traffic (thousand tons)</h4>
      <div id="heathrow-pie-chart" class='pie-chart-holder'></div>

    <p>The pie chart shows that the international goods transtation in Heathrow is more than it for domestic goods transportation. </p>
    `,
    "layers": ["heathrow-stations", "heathrow-center", "heathrow-hotels", "heathrow-restaurants", "heathrow-buffer", '3d-buildings'],//"heathrow-stations",
    "flyTo": {
      "bearing": 0,
      "center": {"lng":-0.4570810632882285,"lat":51.46984899553564},
      "zoom": 11.5,
      "pitch": 0
    },
    loadCard: function(_i, _params) {
      console.log("HEATHROW LOAD CARD", _i, _params);

      // map.setStyle(mapboxSatellite);

      var heathrowTourParams = {
        "Terminal 2": {
          "bearing": 200,
          "center": {"lng":-0.4486882364210487,"lat":51.47359905325979},
          "zoom": 16.5,
          "pitch": 70
        },
        "Terminal 3": {
          "bearing": 130,
          "center": {"lng":-0.45806017135078037,"lat":51.47203158686838},
          "zoom": 16,
          "pitch": 70
        },
        "Terminal 4": {
          "bearing": 330,
          "center": {"lng":-0.4464386965286167,"lat":51.45880884719156},
          "zoom": 16.7,
          "pitch": 70
        },
        "Terminal 5": {
          "bearing": 90,
          "center": {"lng":-0.48900859468392355,"lat":51.47234217585134},
          "zoom": 16.44994533191072,
          "pitch": 70
        },
        "Runways": {
          "bearing": 0,
          "center": {"lng":-0.45851946795733056,"lat":51.469904797147706},
          "zoom": 13.694469215066832,
          "pitch": 0
        }
      }

      var cardId = "#" + _params.extent + '-card-' + i,
        featureSelector = cardId + ' .feature',
        legendSelector = cardId + ' .legend';
      var featureContent = d3.select(featureSelector)
        .append('div')
        .classed('col-12', true);

      featureContent.append('h1')
        .classed('display-4', true)
        .text('A tour of Heathrow');

      featureContent.selectAll('button')
        .data(Object.keys(heathrowTourParams)).enter()
        .append('button')
        .attr('type', 'button')
        .classed('btn btn-lg btn-block btn-outline-primary', true)
        .text(function(d) {
          return d;
        })
        .on('click', function(d) {
          map.flyTo(heathrowTourParams[d]);
        });


      d3.csv("./data/heathrow-pie.csv")
        .then(function (data) {
          var pieData = {};

          data.forEach(function (row) {
            pieData[row.type] = +row.value;
          })

          var pieParams = {
            data: pieData
          };

          createPieChart(pieParams, '#heathrow-pie-chart');

        });

    }
  },
  {
    "extent": "local",
    "title": "Port of London: A major port",
    "content":  `<p> The port of London was once the largest port in the world. The port facilities are located along River Thames and stretch from the capital to the North Sea. The seaport is managed by the Port of London Authority which has overseen its increment and construction since 1908. Various vessels such as roll-on-roll-off ferries and cruise liners are handled in the port. The port of London also receives a variety of cargo from various parts of the world. </p>
      <div class='card border-secondary mb-3'>
        <div class='card-body'>
          <p class="lead mb-0">This page shows the facilities around Port of London in 5 kilometer's radius.
          </p>
        </div>
      </div>
      <img src='./assets/images/London-port.jpg' class='img-fluid' alt='Port of London'>
      <figcaption class="figure-caption mb-4">
        Port of London. <a href="https://youtu.be/IINJU5k2WuY">Source</a>
      </figcaption>
      <h4>Port of London Freight Traffic (thousand tons)</h4>
      <div id="london-port-pie-chart" class='pie-chart-holder'></div>


    <figcaption class="figure-caption mb-4">The pie chart shows the inwards and outwards for domestic and international transportation.</figcaption>
    `,
    "layers": ["tilbury-buffer", "tilbury-center", "tilbury-stations", "tilbury-schools", "tilbury-restaurants", "3d-buildings",],
    "flyTo": {
      "bearing": 0,
      "center": {"lng":0.34804926378694745,"lat":51.46306234902639},
      "zoom": 11.5,
      "pitch": 0
    },
    loadCard: function(_i, _params) {
      var cardId = "#" + _params.extent + '-card-' + i,
        featureSelector = cardId + ' .feature',
        legendSelector = cardId + ' .legend';

      d3.select(featureSelector)
        .classed('d-none', true);

      d3.csv("./data/london-port-pie.csv")
        .then(function (data) {
          var pieData = {};

          data.forEach(function (row) {
            pieData[row.type] = +row.value;
          })

          var pieParams = {
            data: pieData
          };

          createPieChart(pieParams, '#london-port-pie-chart');

        });

        // d3.select(legendSelector)
        //   .classed('d-none', true);

    }
  },



]
