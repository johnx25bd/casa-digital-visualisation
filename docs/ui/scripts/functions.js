
/*
@param {object} _layerData: Object defining layer
returns parameters ready to pass into mapboxgl.Map().addLayer()
*/
function buildAddLayerParams(_layerData) {
    if (_layerData.type == 'geojson') {
    var outputParams = {};
    outputParams.id = _layerData.name;
    outputParams.source = _layerData.name + '-source';
      // ^^ as defined in map.addSource(), ./load-map.js#L131
    outputParams = { ...outputParams,
      ..._layerData.addLayerParams.default ?
      _layerData.addLayerParams.default :
        _layerData.addLayerParams
    };
    return outputParams;
    } else if (_layerData.type == 'mapbox') {
    var outputParams = _layerData.addLayerParams.default ?
      _layerData.addLayerParams.default :
      _layerData.addLayerParams;

    outputParams.id = _layerData.name;

    return outputParams;
    }
}

/*
  Returns CSS selector for currently loaded card.
*/
function currentCardId() {
  return '#' + cardData[activeCardNum].extent
    + '-card-' + activeCardNum;
}

/*
@param {int} _cardNum: card number to build selector
Returns CSS id selector for that card as string.
*/
function getCardId(_cardNum) {
  return '#' + cardData[_cardNum].extent
    + '-card-' + _cardNum;
}

/*
Tests if next card is visible in over half of window
based on current active card.
*/
function isNextCardOnScreen() {

  var nextCardNum = activeCardNum + 1;

  if (activeCardNum == cardData.length - 1) {
    return false;
  }
  // Adapted from https://docs.mapbox.com/mapbox-gl-js/example/scroll-fly-to/
  var element = document.querySelector("div[data-index='" + String(nextCardNum) + "']")
  var bounds = element.getBoundingClientRect();

  return bounds.top < window.innerHeight / 2;
}

/*
Tests if prior card is visible in over half of window
based on current active card.
*/
function isPriorCardOnScreen(_cardNum) {
  var priorCardNum = activeCardNum - 1;

  // Adapted from https://docs.mapbox.com/mapbox-gl-js/example/scroll-fly-to/
  var element = document.querySelector("div[data-index='" + String(priorCardNum) + "']")
  var bounds = element.getBoundingClientRect();

  return bounds.bottom > window.innerHeight / 2;
}

/*
@param {array} _cards: array of objects defining cards in order
*/
function loadCards(_cards) {

  // Bind and load cards into .cards div
  var cardsHolder = d3.select('#story-cards');

  var cardEls = cardsHolder.selectAll('div')
    .data(_cards).enter()
    .append('div')
    .attr('id', function(d, i) {
      return d.extent + "-card-" + String(i);
    })
    .attr('data-index', function(d, i) {
      return i;
    })
    .attr('class', function(d) {
      return d.extent + ' card-body app-card col-12';
    })
    .on('click', function(d, i) {
      setActiveCard(i);
    });

  cardEls.append('h1')
    .text(function(d) {
      return d.title;
    });

  // Interactive feature content area:
  var featureContent = cardEls.append('div')
    .classed('card feature mb-2', true)
    .append('div')
    .classed('card-body', true);

  featureContent.append('p')
    .classed('card-title lead mb-0', true)
    .text(''); // Set as empty for now.

  featureContent.append('div')
    .classed('col-12 feature-content', true);


  // Build legend for each card
  var legendContent = cardEls.append('div')
    .classed('card legend', true)
    .append('div')
    .classed('card-body', true);

  legendContent.append('h3')
    .classed('card-title', true)
    .text('Legend');

  legendContent.append('div')
    .classed('col-12 legend-content', true);


  // Additional facts area:
  var additionalContent = cardEls.append('div')

  additionalContent.append('div')
    .classed('col-12', true)
    .html(function(d) {
      return d.content;
    });

  // Loop through _cards array, executing custom .loadCard()
  // method for each and building legends.
  for (i in _cards) {
    var card = _cards[i];

    if (card.loadCard) {
      card.loadCard(i, card);
    }

    /// Loading legends /////
    createLegends(i,card.layers);
  }
}

/*
A function to show card layers as defined in cardData[_cardNum]
@param {int} _cardNum: The card number to load layers for.
*/
function showCardLayers(_cardNum) {

  var layers = cardData[_cardNum].layers;

  // Loop through every layer loaded onto the map ...
  Object.keys(loadedData).forEach(function(layer) {

    // ... and check if it should be loaded.
    if (layers.includes(layer)) {
      map.setLayoutProperty(layer, 'visibility', 'visible');
    } else {
      map.setLayoutProperty(layer, 'visibility', 'none');
    }

  });
}

/*
A helper function to convert strings to title case
@param {string} _str: The string to convert to title case
@param {string} _separator: the separator on which to split
  the string to convert. Default ' ' - with layer ids often '-'
*/
function titleCase(_str,_separator=' ') {
  // Directly from https://medium.freecodecamp.org/three-ways-to-title-case-a-sentence-in-javascript-676a9175eb27
  // 🙏🙏🙏🙏🙏🙏🙏
  return _str.toLowerCase().split(_separator).map(function(word) {
    return (word.charAt(0).toUpperCase() + word.slice(1));
  }).join(' '); // << always returns with spaces
}

/*
Sets active card, loads layers and flies to card extent.
@param {int} _cardNum: Target active card.
*/
function setActiveCard(_cardNum) {

  if (_cardNum === activeCardNum) {
    return;
  }

  // Load layers and trigger map animated flyto:
  map.flyTo(cardData[_cardNum].flyTo);
  showCardLayers(_cardNum);

  // Update state of interface
  $("div[data-index='" + String(_cardNum) + "']")
    .addClass('active');
  $("div[data-index='" + String(activeCardNum) + "']")
    .removeClass('active');

  $('.jump-to-view.active').removeClass('active');

  $('#' + cardData[_cardNum].extent + '-view')
    .addClass('active');

  // Finally, set new activeCardNum
  activeCardNum = _cardNum;

}

/*
Sets active card, and animates scrolling of content divs.
@param {int} _cardNum: Target active card.
*/
function scrollToCard(_cardNum) {
  // adapted from https://stackoverflow.com/questions/6677035/jquery-scroll-to-element

  // So as not to disrupt ongoing animation
  // (many bugs with this early on)
  if (!$('body').hasClass('scrolling')) {

    $('body').addClass('scrolling');

    // Deactivate scroll option for 1.2 seconds
    setTimeout(function () {
      $('body').removeClass('scrolling');
    }, 1200)

    setActiveCard(_cardNum);

    var id = getCardId(_cardNum);

    // Scroll to proper position regardless of whether
    // the file drop zone is visible or not.
    if ($('#file-add').hasClass('show')) {
      var scrollTopVal = $(id).offset().top
        - $('#file-add').height() - (70 + 63);
    } else  {
      var scrollTopVal = $(id).offset().top - (70 + 63);
    }

    // Collapse drop zone
    $('#file-add').collapse('hide');

    // jQuery animated scroll
    $([document.documentElement, document.body]).animate({
      scrollTop: scrollTopVal
    }, 1000);
  }
}

/*
A helper to set feature content text on load
@param {int} _cardNum: card to update feature title
@param {string} _layer: layer unit which triggers feature
  content pane update on click.
*/
function setFeatureContentText (_cardNum, _layer) {
  console.log("SetFeatureContext", _cardNum)
  var cardId = getCardId(_cardNum);

  d3.select(cardId + ' .card-title')
    .text('Click on a ' + _layer + ' to learn more.')
}

/////////////////////// D3 Functions ///////////////////////////////////
////////////////////////////////////////////////////////////////////////
/////////////////////// Charts /////////////////////////////////////////

/*
createBarChart create generic bar charts, using a set user-specified parameters
_params is a dictionary containing the following:
-------------------------------------------------
_params.dataPath: The relative path to the data
_params.yAxisLabel: The y-axis label
_params.title: Title of the bar chart
_params.valueType: The type of the data, determining the labelling of the y-ticks
-params.layerName: The name of the layer, which the bar chart is intended to interact with.
--------------------------------------------------
A parent id is meant to be provided, to contain the bar chart, besides the dictionary.
*/
function createBarChart(_params, _parentEl) {
  // Organizing the input data
  var file = _params.dataPath,
    y_legend = _params.yAxisLabel,
    title = _params.title,
    type = _params.valueType,
    layerOfInterest = _params.layerName;

  // Inherit the width from the parent node.
  var width = d3.select(_parentEl).node().getBoundingClientRect().width,
    height = width * 0.3 ,
    margin = 0;
  // Setting up the svg element for the bar chart to be contained in
  var svg = d3.select(_parentEl)
    .append("svg")
    .attr('height', height * 1.5)
    .attr('width', width - 15)
    .attr('preserveAspectRatio', 'xMinYMin meet')
    .attr(
      'viewBox',
      '0 0 ' +
      (width + margin + margin) * 1.3 +
      ' ' +
      (height + margin + margin)
    );
    // Defining the container for the tooltip.
  var div = d3.select(_parentEl).append("div")
    .attr("class", "tooltip")
    .style("display", "none");
  // Appending the title to svg.
  svg.append("text")
    .attr("transform", "translate(" + width * 0.1 + ",0)")
    .attr("x", width * 0.1)
    .attr("y", width * 0.1)
    .attr("font-size", "24px")
    .text(title)

  // Defining the the two axis
  var xScale = d3.scaleBand().range([0, width]).padding(0.4),
    yScale = d3.scaleLinear().range([height, 0]); //height

  // Defining the g to contain the actual graph
  var g = svg.append("g")
    .classed('chart-body', true)
    .attr("transform", "translate(" + margin + 70 + "," + margin + 80 + ")");

  // Reading in the data
  d3.csv(file).then(function(data) {
    data.forEach(function(d) {
      d.value = +d.value;
    });

    // Placing the data on the axis
    xScale.domain(data.map(function(d) {
      return d.name;
    }));
    yScale.domain([0, d3.max(data, function(d) {
      return d.value;
    })]);

    // Setting the axis title and the tick-marks the x-axis.
    g.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(xScale))
      .append("text")
      .attr("y", height * 0.2)
      .attr("x", width * 0.45)
      .attr("text-anchor", "end")
      .attr("stroke", "black")
      .text("Name");

    // Setting the axis title and the tick-marks the y-axis.
    g.append("g")
      .call(d3.axisLeft(yScale).tickFormat(function(d) {
          if (type == 'value') {
            return "$" + d;
          } else if (type == 'amount') {
            return d;
          }
        })
      .ticks(10))
      .append("text")
      .attr("transform", "rotate(0)")
      .attr("y", 5)
      .attr("dy", "-2.1em")
      .attr("text-anchor", "end")
      .attr("stroke", "black")
      .text(y_legend);

    // Appending the actual bars using rect elements
    g.selectAll(".bar")
      .data(data)
      .enter().append("rect")
      .attr("class", function(d){
        return 'bar '+d.code;
      })
      .attr("x", function(d) {
        return xScale(d.name);
      })
      .attr("y", function(d) {
        return yScale(d.value);
      })
      .attr("width", xScale.bandwidth())
      .attr("height", function(d) {
        return height - yScale(d.value);
      })
      .style('fill-opacity','0.7')
      // Enabling the interactivity when hovering
      .on('mouseenter', function(d) {

        d3.selectAll('.' + d.code)
            .classed('active', true)
            .style('fill-opacity','1');

        map.setFilter(layerOfInterest +'-highlighted', ['==', 'code', d.code]);
      })
      .on("mousemove", function(d){
        div
          .text('Value: '+d.value)
          .style('display','block')
          .style('opacity','1')
          .style('font-weight','bold')
          .style("left", (d3.mouse(this)[0]) + "px")
          .style("top", (d3.mouse(this)[1]) + "px");
      })
      .on("mouseout", function(d) {
             map.setFilter(layerOfInterest +'-highlighted', ['==', 'code', '']);

             d3.selectAll('.bar')
                 .classed('active', false)
                 .style('fill-opacity','0.7')

            div.style('opacity','0')
      });
  });
}
/*
createPieChart create generic pie charts, using a set user-specified parameters
_params is a dictionary containing the following:
-------------------------------------------------
_params.data: A dictionary containing the categories as keys and the values as values.
_params.title: Title of the pie chart.
--------------------------------------------------
A parent id is meant to be provided, to contain the bar chart, besides the dictionary.
*/
function createPieChart(_params, _parentEl) {

  // Adopting the width (and height) from the parent element.
  var width = d3.select(_parentEl).node().getBoundingClientRect().width,
    height = width / 2;

  // Defining the parameters to be used based on the input.
  var id = _parentEl,
    _title = _params.title,
      data = _params.data;

  // The radius of the pieplot is half the width or half the height (smallest one).
  var radius = Math.min(width, height) / 2;

  // Append the svg object to pre-allocated div.
  var svg = d3.select(id)
    .append("svg")
    .attr("width", width * 1)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + width / 4 + "," + height / 2 + ")"); //" + width / 2 + "

  // Extracting the color domain for setting the colors right after
  var dataDomain = Object.keys(data)
  // console.log('Data Domain: '+dataDomain)
  // console.log('Replace: '+dataDomain[0].replace(/ /g,'_'))
  // Set the color scale
  var color = d3.scaleOrdinal()
    .domain(dataDomain)
    .range(d3.schemeDark2);

  // Compute the position of each group on the pie:
  var pie = d3.pie()
    .sort(null) // Do not sort group by size, to ensure that the order is always the same
    .value(function(d) {
      return d.value;
    });

  // Store the transformed data
  var data_ready = pie(d3.entries(data))

  // The arc generator
  var arc = d3.arc()
    .innerRadius(radius * 0.5) // This is the size of the donut hole
    .outerRadius(radius * 0.8)

  // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
  svg
    .append('g')
    .selectAll('path')
    .data(data_ready)
    .enter()
    .append('path')
    .attr('d', arc)
    .attr('fill', function(d) {
      return color(d.data.key);
    })
    .attr('class',function(d,i){
      return 'piearc ' + dataDomain[i].replace(/ /g,'_');
    })
    // Enable the interactivity.
    .on("mouseenter", function(d,i) {
        text = svg.append("text")
            .attr("transform", function(d, i) {return "translate(0,0)";})//return "translate(" + arc.centroid(d, i) + ")"
            .attr("dy", ".5em")
            .style("text-anchor", "middle")
            .attr("class", "on")
            .text(d.data.value);

        d3.selectAll('.' + dataDomain[i].replace(/ /g,'_'))
            .classed('active', true)
            .style('font-weight','bold');
      })
    .on("mouseout", function(d) {
           text.remove();
           d3.selectAll('.textLegend')
               .classed('active', false)
               .style('font-weight','normal');
    })
    .attr("stroke", "white")
    .style("stroke-width", "2px")
    .style("opacity", 0.70);

  // Adding a title
  svg
    .append('text')
    .attr('x', 0) //
    .attr('y', -180)
    .attr('text-anchor', 'middle')
    .classed('title', true)
    .text(_title);

  // Setting the g for the legends
  var legends = svg
    .append('g')
    .attr('transform', 'translate(' + width / 2 + ',' + height * -.5 + ')') // 300,-140
    .selectAll('.legends')
    .data(data_ready);

  // Appending a g for each of the legends
  var legend = legends
    .enter()
    .append('g')
    .classed('legends', true)
    .attr('transform', function(d, i) {
      return "translate(-80," + (i + 1) * 20 + ")";
    });

  // Appending the colored boxes next to the legends, on the g just defined.
  legend
    .append('rect')
    // Adjust these for the size of the colored boxes.
    .attr('width', 15)
    .attr('height', 15)
    .attr('fill', function(d) {
      return color(d.data.key);
    });
  // Appending the actual legend text.
  legend
    .append('text')
    .text(function(d, i) {
      return dataDomain[i];
    })
    .attr('fill', function(d) {
      return color(d.data.key);
    })
    .attr('class',function(d,i){
      return 'textLegend '+dataDomain[i].replace(/ /g,'_');
    })
    .attr('x', 25)
    .attr('y', 15)
    // Enabling the interactivity
    .on("mouseenter", function(d,i) {

        text = svg.append("text")
            .attr("transform",'translate(0,0)')
            .attr("dy", ".5em")
            .style("text-anchor", "middle")
            .attr("class", "on")
            .text(d.data.value);

        d3.selectAll('.' + dataDomain[i].replace(/ /g,'_'))
            .classed('active', true)
            .style('opacity','2')
            .style('font-weight','bold');
      })
    .on("mouseout", function(d) {
           text.remove();
           d3.selectAll('.piearc')
               .classed('active', false)
               .style('opacity','0.7');

          d3.selectAll('.textLegend')
              .classed('active',false)
              .style('font-weight','normal');
    })
}
/////////////////////// Legends /////////////////////////////////////////
/*
createLegends create generic legends for each layer, based on the specified layers in each card.
The function takes two inputs, the card number and the layers in the card.
The legends are built based on fixed sixes, depending of the data type.
See below for more information.
-------------------------------------------------
_cardNum: The card number.
_layers: A list of the names of the layers contained in the card.
--------------------------------------------------
*/
function createLegends(_cardNum,_layers){
  // Extracting parent id for the legends to be contained in.
  var _id = getCardId(_cardNum) + ' .legend-content';
  // Defining some initial parameters, used to place the legends dynamically as the layers are processed.
  var titleOffset = 25,
      elementOffset = 50,
      circleOffset = 30,
      sourceSpace = 20,
      sourceTitleOffset = 125,
      sourceTitleToSourcesOffset = 30,
      prevType = null,
      prevSetSize = null,
      prevSize = null,
      prevURLS = null,
      howLong = 0,
      maxWidth = 0;

// Determining the length of the div dynamically.
for (layer of _layers){

  // The highlight layer should not be processed, to avoid double legends.
  if (!layer.includes('highlighted')){

    // Getting the actual layer from the layers.js file.
    var layerOfInterest = layersData.find(function (l) {
      return l.name == layer;
    });

    // Extracting the data type of the layer.
    var type = layerOfInterest.addLayerParams.default ?
      layerOfInterest.addLayerParams.default.type :
      layerOfInterest.addLayerParams.type;

    // Storing the name of the layer, to be used later in the filter process.
    var layerName = layer;
    // A legend for a fill layer gets a size of 100px plus some additional spize depending on the number of
    // of sources underlying the layer. The source title get 40 px and each source gets 20 px.
    if (type == 'fill'){

      howLong += (2*50 + (100*0.4 + 0.2*100*layerOfInterest.source.url.length));

    } else if (type == 'circle'){

      var paint = {
        'circle-radius': map.getPaintProperty(layer,'circle-radius'),
        'circle-color' : map.getPaintProperty(layer,'circle-color')
      };
      // Each point gets 40 px and so does the title. For this type of layer, the sourec title gets a little less space, because
      // perhaps is a little to much - that could always be perfected, the ability to generic and dynamically built the legends is an achievement in itself.
      if (paint['circle-color'] || paint['circle-radius']){
        // The circle layers can either represent categories or a single point.
        if ((Array.isArray(paint['circle-color'])) && (Array.isArray(paint['circle-radius']))){
          // It is either the number of types or the number of sizes that determines the length, depening on which is the longest.
          if (paint['circle-color'].length >= paint['circle-radius'].length){
            howLong += ((((paint['circle-color'].length - 1) / 2))*40 + (100*0.4 + 0.2*100*(layerOfInterest.source.url.length+1)));
          } else {
            howLong += ((((paint['circle-radius'].length - 1) / 2))*40 + (100*0.4 + 0.2*100*(layerOfInterest.source.url.length + 1)));
          }
        // if it is a single point circle layer, it get's the same size as the fill layer.
        } else {
          howLong += (2*40 + (100*0.4 + 0.2*100*layerOfInterest.source.url.length));
        }
      } else {
        howLong += (2*50 + (100*0.4 + 0.2*100*layerOfInterest.source.url.length));
      }
    // This type is for the 3d-builds, which is meant to be mentioned in the legends.
    } else if (type == 'fill-extrusion'){
      howLong += 0
    // The heatmap legend is similar to the fill legend.
    } else if (type == 'heatmap'){
      howLong += (2*50 + (100*0.4 + 0.2*100*layerOfInterest.source.url.length));
    }
    // defining the width based on the longest source name.
    if (layerOfInterest.source.content[0].length>maxWidth){
      maxWidth = layerOfInterest.source.content[0].length;
    }
  }
}
  // Setting the final width based on the longest source name found above.
  var width = 300,
      widthExtent = width + 5*maxWidth

  // Setting the svg element for the legends to be built on.
  var svg = d3.select(_id)
    .append('svg')
    .attr('id','card_'+_cardNum)

      .attr('width',widthExtent)
      .attr("height", howLong)

    var iter = 0;
    // Time to go over each layer, and built the legend on the go.
    for (layer of _layers){

      // Getting parameters for the legends, firstly by locating the layer of interest in the
      // layers.js file, based on the name.
      if (!layer.includes('highlighted')){
        var layerOfInterest = layersData.find(function (l) {
          return l.name == layer;
        });

        var type = layerOfInterest.addLayerParams.default ?
          layerOfInterest.addLayerParams.default.type :
          layerOfInterest.addLayerParams.type;

        var title = layerOfInterest.source.content,
            sourceNames = layerOfInterest.source.name,
            sourceTypes = layerOfInterest.source.type,
            sourceURL = layerOfInterest.source.url;

        sourceData = []

        for (var ele = 0; ele < sourceURL.length;ele ++){
          sourceData.push({'name':sourceNames[ele],
                           'type':sourceTypes[ele],
                           'url':sourceURL[ele]})
        }
        // Extracting the paint to be used for constructing the legends,
        // which depending on the type, comes in different format.
        if (type == 'fill'){

          var paint = map.getPaintProperty(layer,'fill-color');

        } else if (type == 'circle'){

          var paint = {
            'circle-radius': map.getPaintProperty(layer,'circle-radius'),
            'circle-color' : map.getPaintProperty(layer,'circle-color')
          };

        } else if (type == 'heatmap'){

          var paint = {
            'heatmap-color' : map.getPaintProperty(layer,'heatmap-color')
          }
          var heatmapColors = []

          for (var i = 4; i < paint['heatmap-color'].length;i += 2){
            heatmapColors.push(paint['heatmap-color'][i])
          }

          paint = heatmapColors;

        } else {
          return;
        }
      }
      else {
        return;
      }
      ///////// Defining the data ///////////////////////////
      // Setting up the data, based on the extracted paint property of the layer of interest.
      // This is where the support functions are in use.
      if (typeof paint.length == 'undefined'){
        // Circles - if the size is not included in the paint:
        if (typeof paint['circle-radius'].length == 'undefined'){

          var [color,data] = structureData(type,paint);
          var setSize = false;
        } else {
          var [color,data,size,sizedata] = structureData(type,paint);
          var setSize = true;
        }
        // Setting the size between each point (_offSet) and the size of the point (_elementWidth)
        var _offSet = 30;
        var _elementWidth = 15;

      } else {

        var [color,data] = structureData(type,paint);

        if (type == 'heatmap'){
          type = 'fill';
        }

        // The legend for the heatmap is built similar to the legend for the fill, so instead of
        // having multiple methods, we just change the type to fill.
        if (paint.length > 1) {
          // Defining parameters for the "gradient" legend
          // If the step size is increased, a more smooth "gradient" fill is obtained, but topPortsBarChartParams
          // puts a greater demand on the browser, as more objects need to be loaded.
          var step = 20;
          var _offSet = (width/step);
          var _elementWidth = (width*2/step);

        } else {
          // If the fill is just a single color - as a buffer or so.
          var _offSet = 15;
          var _elementWidth = 50;

        }
      }
      // This is where the dynamically adjustment takes place, base on the fixed sizes belonging to
      // each type of legend.
    ///////////////////////////////////////////////////////
      if (prevType == 'fill'){

        titleOffset += (125 + (75*0.4+0.2*75*(prevURLS)))
        elementOffset += (125 + (75*0.4+0.2*75*(prevURLS)))
      // We want the legend to be a little more condense, if the circle layer has multiple categories
      // which is why each point gets 40 px compared to 47, seen below, if there is only one point.
      } else if (prevType == 'circle' && prevSize > 1) {

          titleOffset += ((prevSize + 1)*40+ + (75*0.4+0.2*75*(prevURLS))),
          elementOffset += ((prevSize + 1)*40 + (75*0.4+0.2*75*(prevURLS)));

      } else if (prevType == 'circle' && prevSize == 1) {
        titleOffset += ((prevSize+1)*47+ + (75*0.4+0.2*75*(prevURLS))),
        elementOffset += ((prevSize + 1)*46 + (75*0.4+0.2*75*(prevURLS)));
      }
    // It is assmued that the first legend is a fill, but if not, we correct that assumption.
    // The source title is offSet by the number of categories plus one (for the title), either type or color, which ever is the longest
    if ((iter == 0) && (type =='circle')){
      if (setSize){
        if (data.length >= sizedata.length){
          sourceTitleOffset = (data.length + 1)*40;
        } else {
          sourceTitleOffset = (sizedata.length + 1)*40;
        }
      }
      else {
        sourceTitleOffset = (data.length + 1.5)*40;
      }
    }
    // Time to append the elements.
    /////////////////////////// Generic /////////////////////////////////////////////////////////
    // Appending the title
      svg
        .append('g')
        .append('text')
        .attr('x',0)//
        .attr('y',titleOffset)
        .attr('text-anchor','start')
        .classed('title',true)
        .text(title);
    ///////////////////////////////////////////////////////////////////////////////////////////
    // The structure of the legend differes, depending on the type of the data underlying the
    // legend, with the main difference being that fill-based legens are built horisontally and
    // point-based legends are built vertically.
      if (type == 'fill'){//type == 'fill'
        // Defining the individual g's
        var legends = svg
              .append('g')
              .selectAll('.legends')
              .data(data);
        // Appending horisontally
        var legend = legends
              .enter()
              .append('g')
              .classed('legends',true)
              .attr('transform',function(d,i) {return "translate(" + (i)*_offSet + ","+elementOffset+")";});//*(width/_step)

        // The boxes themselves
        legend
          .append('rect')
          .attr('width',_elementWidth)
          .attr('height',15)
          .attr('fill',function(d,i){return color(i);});

        // Appending legend text.
        legend
          .append('text')
          .text(function(d,i){ return d.value;})
          .attr('x',5)
          .attr('y',35)

      } else if (type == 'circle'){
        // Defining the individual g's
        var legends = svg
              .append('g')
              .selectAll('.legends')
              .data(data);
        // Appending vertically.
        var legend = legends
              .enter()
              .append('g')
              .classed('legends',true)
              .attr('transform',function(d,i) {return "translate(0,"+ (elementOffset+(i)*_offSet) + ")";});//*(width/_step)

        // The boxes themselves.
        legend
              .append('circle')
              .attr('cx',_elementWidth)
              .attr('cy',_elementWidth)
              .attr('r',_elementWidth/2)
              .style('fill',function(d,i){return color[i];});

        ////////////// Adding interactivity ///////////////////
        if (layerOfInterest.highlight_type){
          var highlightTypeName = layerOfInterest.name;
          // If interaction is of interest for the layer, we interact with the filter on that layer.
          // We class the legend entry, by layer name and data label, so the interaction between
          // the map and the card is ensured when both points and text legends are hovered.
          legend
              .append('text')
              // Assigning classes based on the type names. However names with "/" isn't
              // valid selectors in d3, so we need to account for that.
              .attr("class",function(d,i){
                if(data[i].includes('/')){
                  return 'textLegend ' + highlightTypeName+'_MA ';
                } else {
                  return 'textLegend ' + highlightTypeName+'_' + data[i];
                }
              })
              .text(function(d,i){ return data[i];})
              .attr('x',50)
              .attr('y',20)
              .on('mouseenter', function(d,i) {

                hoverClass = this.getAttribute('class').split(' ');
                nameOfLayer = hoverClass[1].split('_')[0];
                nameOfObject = hoverClass[1].split('_')[1];

                map.setFilter(nameOfLayer +'-highlighted', ['==', 'type', nameOfObject]);
                console.log(hoverClass[1])
                d3.selectAll('.'+hoverClass[1])
                  .style('font-weight','bold');
              })
              .on("mouseout", function(d,i) {
                map.setFilter(nameOfLayer +'-highlighted', ['==', 'type', '']);

                d3.selectAll('.textLegend')
                  .style('font-weight','normal');
              });
        // If no interaction is desired, just built the legend
        } else {
          legend
              .append('text')
              .text(function(d,i){ return data[i];})
              .attr('x',50)
              .attr('y',20)
        }

        }
        // To avoid legacy
        prevSetSize = false;
        // If the size is of interest, a legend is built next to the type legend.
        if ((setSize==true) && (typeof size != 'undefined')) {

          var legends = svg
                .append('g')
                .selectAll('.legends')
                .data(sizedata);

          var legend = legends
                .enter()
                .append('g')
                .classed('legends',true)
                .attr('transform',function(d,i) {return "translate(175," + (elementOffset + (i)*_offSet) + ")";});//*(width/_step)

          legend
                .append('circle')
                .attr('cx',_elementWidth)
                .attr('cy',_elementWidth)
                .attr('r',function(d,i) {return size[i]*1;})//
                .style('fill','white')
                .style('stroke','black');

          if (layerOfInterest.highlight_size){
            // If interaction is of interest for the layer, we interact with the filter on that layer.
            // We class the legend entry, by layer name and data label, so the interaction between
            // the map and the card is ensured when both points and text legends are hovered.
            var highlightSizeName = layerOfInterest.name;
            legend
                .append('text')
                .attr("class",function(d,i){
                  return 'textLegend ' + highlightSizeName+'_' + sizedata[i];
                })
                .text(function(d,i){ return sizedata[i];})
                .attr('x',50)
                .attr('y',20)
                .on('mouseenter', function(d,i) {

                  hoverClass = this.getAttribute('class').split(' ');
                  nameOfLayer = hoverClass[1].split('_')[0];
                  nameOfObject = hoverClass[1].split('_')[1];

                  map.setFilter(nameOfLayer +'-highlighted', ['==', 'size', nameOfObject]);
                  d3.selectAll('.'+hoverClass[1])
                    .style('font-weight','bold');
                })
                .on("mouseout", function(d,i) {

                  map.setFilter(nameOfLayer +'-highlighted', ['==', 'size', '']);
                  d3.selectAll('.textLegend')
                    .style('font-weight','normal');
                });
          // If no interaction is desired, just built the legend
          } else {
            legend
                .append('text')
                .text(function(d,i){ return sizedata[i];})
                .attr('x',50)
                .attr('y',20)
          }

        }
        // Store some information of the processed layer, to be used in the next iteration.
        if (setSize==true){
          if (data.length >= sizedata.length){
            prevSize = data.length;
          } else {
            prevSize = sizedata.length;
            prevSetSize = true;
            setSize = false;
          }
        } else {
            prevSize = data.length;
        }
      // Depending of the type of the processed layer, the source is offset by a certain amount.
      // Very similar to what we have seen earlier, some of this could be written more elegantly.
      if ((iter > 0) && (type == 'fill')){

        sourceTitleOffset += (100 + (75*0.4+0.2*75*sourceURL.length))

      } else if ((iter > 0) && (type == 'circle')) {

        if (prevSetSize==true){

          sourceTitleOffset += (sizedata.length)*40 + (100*0.4+0.2*100*sourceURL.length);

        } else if (prevSize > 1) {

          sourceTitleOffset += (data.length + 1)*40 + (75*0.4+0.2*75*sourceURL.length);

        } else if ( prevSize == 1) {
          sourceTitleOffset += (data.length + 1)*47 + (75*0.4+0.2*75*sourceURL.length);
        }
      }
      // Appending the source title.
      svg
        .append('text')
        .attr('x',0)//
        .attr('y',sourceTitleOffset)
        .attr('text-anchor','start')
        .classed('title',true)
        .text('Sources');

      // Creating individual g's for the sources
      var sources = svg
            .append('g')
            .selectAll('.sources')
            .data(sourceData)

      var source = sources
            .enter()
            .append('g')
            .classed('sources',true)

      // Appending the actual source content
      source
        .append("a")
        .attr("xlink:href", function(d){ return d.url})
        .attr('target', 'blank')
        .append('text')
        .text(function(d,i){ return (d.name+', '+d.type);})
        .attr('x',0)
        .attr('y',function(d,i){ return ((sourceTitleOffset+sourceTitleToSourcesOffset)+(i*sourceSpace));})

    // Extract, append, repeat.
    iter += 1;
    prevType = type;
    prevURLS = sourceURL.length;
    }
}
/////////////////////// Support functions /////////////////////////////////////////
/*
structureData structure the data in the desired format, depending on the layer type.
The function takes three inputs, the layer type, the paint of the layer and
optionally the number of steps wished (for 'gradient' fill legends).
-------------------------------------------------
_dataType: The layer type.
_dataPaint: The paint property of the layer of interest.
_step: The desired number of steps.
--------------------------------------------------
*/
function structureData(_dataType,_dataPaint,_step = 20){

  if (_dataType == 'fill'){
    // If the layer is fill, and the colorng is created using interpolation, the legend
    // needs to reflect that.
    if (Array.isArray(_dataPaint)){

      // The colors are fixed positioned in the paint.
      var color1 = _dataPaint[4][1],
          color2 = _dataPaint[6][1];

      // Use the other support fuction to interpolate the colors.
      var color = interpolateColors(_dataType,[color1,color2],_step);

      var data = [];

      // Create the legend texts.
      for (var ele = 0; ele < _step; ele++){

        if (ele === 0){
            data.push({'id':ele, 'value':'Low'});
        } else if (ele === (_step - 1)){
            data.push({'id':ele, 'value':'High'});
        } else {
          data.push({'id': ele, 'value':''})
        }
      }

    } else {
      // If the fill layer has only one color, reflect that.
      var color = interpolateColors(_dataType,_dataPaint,1);
      var data = [{'id':1,'value':'fill'}];
    }
  ////////////////////////// CIRCLES /////////////////////////////////////////
  } else if (_dataType == 'circle'){

    // If there are multiple categories, reflect that.
    if (Array.isArray(_dataPaint['circle-color'])){
      var color = [];
      var data = [];

      for (var i = 3; i < (_dataPaint['circle-color'].length);i +=2){
        color.push(_dataPaint['circle-color'][i]);
        data.push(_dataPaint['circle-color'][i-1])
      }
      color.push('#cfd9df')
      data.push('Other')
    } else {

      // If there are one category, reflect that.
      var color = [_dataPaint['circle-color']]
      var data = ['point']
    }
    // Checking if the size should be included in the legend.
    if (Array.isArray(_dataPaint['circle-radius'])){
      var size = [];
      var sizedata = [];

      for (var i = 3; i < (_dataPaint['circle-radius'].length);i +=2){
        size.push(_dataPaint['circle-radius'][i]);
        sizedata.push(_dataPaint['circle-radius'][i-1])
      }
      size.push(5)
      sizedata.push('Other')

      var setSize = true;
    }

  } else if (_dataType == 'heatmap'){

    var substep = [];
    // Getting the number of colors used in the heatmap
    for (var i = 0; i < _step; i += _dataPaint.length){
      substep.push(i);
    }
    console.log('The substeps are: '+substep)
    // Getting the colors
    var color = interpolateColors(_dataType,_dataPaint,_step);

    var data = [];
    // Setting the text labels
    for (var ele = 0; ele < _step; ele++){

      if (ele === 0){
          data.push({'id':ele, 'value':'Low'});
      } else if (ele === (_step - 1)){
          data.push({'id':ele, 'value':'High'});
      } else {
        data.push({'id': ele, 'value':''})
      }
    }
  // Catch all data type for which methods aren't defined.
  } else {
    console.log(_dataType,': ERROR:  I dont know this datatype!')
    return;
  }
  // Return the needed variables, depending on if size matters or not.
  if (setSize){

    return [color,data,size,sizedata];

  } else {

    return [color,data];
  }
}
/*
interpolateColors creates the color ramp for the fill/heatmap legends.
The function takes two inputs, the colors contained in the layer and the desired number of steps.
-------------------------------------------------
_colors: The colors contained in the layer.
_step: The desired number of steps.
--------------------------------------------------
*/
function interpolateColors(_type='fill',_colors,_step = 1){
  if (_type =='fill'){
    // If there is only one color in the layer:
    if (!Array.isArray(_step)){
      var steps = [1,_step];
    } else {
      var steps = _step;
    }
    // If there is only one color in the layer:
    if (!Array.isArray(_colors)){
      var colors = [_colors];
    } else {
      var colors = _colors;
    }
    // Create the color ramp.
    var color = d3.scaleLinear()
        .domain(steps)
        .range(colors)
        .interpolate(d3.interpolateRgb);
  } else{
    var color = d3.scaleLinear()
        .domain([0,_step/3,_step*(2/3),_step])
        .range(['#67a9cf','#5fe265','#ef8a62','#b21818'])
        .interpolate(d3.interpolateRgb);
  }
  return color;

}


/*
⚠⚠⚠ EXPERIMENTAL! ⚠⚠⚠
Preps target drop zone to accept geojson files to visualize
from the local upload feature
@param {object} _targetEl: the selection of the
  html element where files are meant to be dropped
@param {function} _callback: the callback function to
  invoke once file data has been loaded into the browser
*/
function dropJSON(_targetEl, _callback) {
  // Adapted from https://stackoverflow.com/questions/8869403/drag-drop-json-into-chrome/
  // Disable default drag & drop functionality
  _targetEl.addEventListener('dragenter', function(e) {
    e.preventDefault();
  });
  _targetEl.addEventListener('dragover', function(e) {
    e.preventDefault();
  });

  // Prepare area for file drop!
  _targetEl.addEventListener('drop', function(event) {

    var file = event.dataTransfer.files;

    if (file.length > 1) {
      alert('Please only upload one geojson file at a time.\nWe will load the first file you dropped 😉');
      // ^^ Opportunity for extension - multi-file and zip uploads.
      // Also shapefiles to geojson in the browser!
      // https://github.com/calvinmetcalf/shapefile-js
    }

    var reader = new FileReader();

    reader.onloadend = function() {
      var data = JSON.parse(this.result);

      // Should add geojson validator, like this:
      // https://github.com/craveprogramminginc/GeoJSON-Validation
      // Code would be;
      // if (GJV.valid(data)) {
      //    _callback(data, file);
      // } else {
      //    alert('Please upload a valid geojson file!');j
      //    return;
      // }

      _callback(data, file);
    };

    reader.readAsText(event.dataTransfer.files[0]);
    event.preventDefault();
  });
}


/*
fitText jQuery plugin, for scaling airport codes
@param {float} kompressor: scaling factor
@param {object} options: optional pixel values:
  minFontSize
  maxFontSize
(Attaches a method to the jquery object.)
*/
(function ( $ ){
  // Directly from https://github.com/davatron5000/FitText.js
  $.fn.fitText = function( kompressor, options ) {

    // Setup options
    var compressor = kompressor || 1,
        settings = $.extend({
          'minFontSize' : Number.NEGATIVE_INFINITY,
          'maxFontSize' : Number.POSITIVE_INFINITY
        }, options);

    return this.each(function(){

      // Store the object
      var $this = $(this);

      // Resizer() resizes items based on the object width divided by the compressor * 10
      var resizer = function () {
        $this.css('font-size', Math.max(Math.min($this.width() / (compressor*10), parseFloat(settings.maxFontSize)), parseFloat(settings.minFontSize)));
      };

      // Call once to set.
      resizer();

      // Call on resize. Opera debounces their resize by default.
      $(window).on('resize.fittext orientationchange.fittext', resizer);

    });

  };

})( jQuery );
