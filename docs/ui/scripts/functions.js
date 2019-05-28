
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
Adjust choropleth to appropriate year column
@param {int} _year: Year to color countries by
*/
function colorCountriesBy(_year, _layer) {

  if (_layer == 'export') {
    var newFill = [
        "interpolate-hcl",
        ["exponential", 1.1],
        ["get", "normalised_export_" + _year.toString()],
        0.00,
        ["to-color", "#deebf7"],
        8.00,
        ["to-color", "#537895"]
      ];
  } else if (_layer == 'import') {
    var newFill = [
      "interpolate-hcl",
      ["exponential", 1.1],
      ["get", "normalised_import_" + _year.toString()],
      0.00,
      ["to-color", "#fff7bc"],
      8.00,
      ["to-color", "#d95f0e"]
    ]
  }

  // Color country based on year
  console.log(_year, newFill);
}
/*
A helper to set feature content text on load
@param {int} _cardNum: card to update feature title
@param {string} _layer: layer unit which triggers feature
  content pane update on click.
*/
function setFeatureContentText (_cardNum, _layer) {

  var cardId = getCardId(_cardNum);

  d3.select(cardId + ' .card-title')
    .text('Click on a ' + _layer + ' to learn more.')
}

// D3 Chart Functions
function createBarChart(_params, _parentEl) {
  // Organizing the input data
  var file = _params.dataPath,
    y_legend = _params.yAxisLabel,
    title = _params.title,
    type = _params.valueType,
    layerOfInterst = _params.layerName;

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

    var mouseover = function(d) {

      d3.select(this)
        .style("stroke", "none")
        .style("opacity", 1)
        // .html("The exact value of<br>this cell is: " + d.value)
        // .style("left", (d3.mouse(this)[0]+70) + "px")
        // .style("top", (d3.mouse(this)[1]) + "px")

        div.style("display", "inline");
    }

    var div = d3.select(_parentEl).append("div")
    .attr("class", "tooltip")
    .style("display", "none");

    function mousemove(d) {
      div
        //.html("The exact value of<br>this cell is: " + d.value)
        .text('Value: '+d.value)
        .style('display','block')
        .style('opacity','1')
        .style('font-weight','bold')
        .style("left", (d3.mouse(this)[0]) + "px")
        .style("top", (d3.mouse(this)[1]) + "px");
        // .style("left", (d3.event.pageX / 10) + "px")
        // .style("top", (d3.event.pageY / 10) + "px");
    }

    function mouseout() {
      div.style("display", "none");
    }


    var mouseleave = function(d) {
      //Tooltip
      //  .style("opacity", 0)
      d3.select(this)
        .style("stroke", "none")
        .style("opacity", 0.8)
    }

  svg.append("text")
    .attr("transform", "translate(" + width * 0.1 + ",0)")
    .attr("x", width * 0.1)
    .attr("y", width * 0.1)
    .attr("font-size", "24px")
    .text(title)

  var xScale = d3.scaleBand().range([0, width]).padding(0.4),
    yScale = d3.scaleLinear().range([height, 0]); //height

  var g = svg.append("g")
    .classed('chart-body', true)
    .attr("transform", "translate(" + margin + 70 + "," + margin + 80 + ")");

  d3.csv(file).then(function(data) {
    data.forEach(function(d) {
      d.value = +d.value;
    });

    xScale.domain(data.map(function(d) {
      return d.name;
    }));
    yScale.domain([0, d3.max(data, function(d) {
      return d.value;
    })]); //

    g.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(xScale))
      .append("text")
      .attr("y", height * 0.2)
      .attr("x", width * 0.45)
      .attr("text-anchor", "end")
      .attr("stroke", "black")
      .text("Name");


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

    g.selectAll(".bar")
      .data(data)
      .enter().append("rect")
      //.attr("class", "bar")
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
      //.style('fill','#537895')
      .style('fill-opacity','0.7')
      .on('mouseenter', function(d) {

        text = svg.append("text")
              .attr("transform", function(d, i) { return "translate(100," + height * 1.8 + ")";})
              .attr("dy", ".5em")
              .style("text-anchor", "middle")
              .attr("class", "on")
              .text("Bar value: "+d.value);

        d3.selectAll('.' + d.code)
            .classed('active', true)
            .style('fill-opacity','1');
        //map.setPaintProperty(layerOfInterst, ['==', 'iso3', d.iso3]);
        //console.log(layerOfInterst);
        map.setFilter(layerOfInterst +'-highlighted', ['==', 'code', d.code]);
      })
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
    //.on("mouseout", mouseout);
      .on("mouseout", function(d) {
             text.remove();
             map.setFilter(layerOfInterst +'-highlighted', ['==', 'code', '']);

             d3.selectAll('.bar')
                 .classed('active', false)
                 .style('fill-opacity','0.7')
            mouseout;
      });

  });
}

function createPieChart(_params, _parentEl) {


  var width = d3.select(_parentEl).node().getBoundingClientRect().width,
    height = width / 2,
    margin = 0;

  var id = _parentEl,
    _title = _params.title;

  var data = _params.data;
  //console.log(id+': '+ data)
  // The radius of the pieplot is half the width or half the height (smallest one). I substract a bit of margin.
  var radius = Math.min(width, height) / 2 - margin;

  // append the svg object to the div called 'my_dataviz'
  var svg = d3.select(id)
    .append("svg")
    // Adjust the factor below to allows for more space for the legends
    .attr("width", width * 1)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + width / 4 + "," + height / 2 + ")"); //" + width / 2 + "

  var dataDomain = Object.keys(data)

  // set the color scale
  var color = d3.scaleOrdinal()
    // Alternated to allow for dynamically colouring.
    .domain(dataDomain)
    .range(d3.schemeDark2);

  // Compute the position of each group on the pie:
  var pie = d3.pie()
    .sort(null) // Do not sort group by size
    .value(function(d) {
      return d.value;
    });

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
      return 'piearc ' + dataDomain[i];
    })
    .on("mouseenter", function(d,i) {
        //console.log("Arc: "+arc)
        text = svg.append("text")
            .attr("transform", function(d, i) {return "translate(0,0)";})//return "translate(" + arc.centroid(d, i) + ")"
            .attr("dy", ".5em")
            .style("text-anchor", "middle")
            .attr("class", "on")
            .text(d.data.value);

          console.log(dataDomain[i]);
        d3.selectAll('.' + dataDomain[i])
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

  var legends = svg
    .append('g')
    .attr('transform', 'translate(' + width / 2 + ',' + height * -.5 + ')') // 300,-140
    .selectAll('.legends')
    .data(data_ready);

  var legend = legends
    .enter()
    .append('g')
    .classed('legends', true)
    .attr('transform', function(d, i) {
      return "translate(-80," + (i + 1) * 20 + ")";
    });

  legend
    .append('rect')
    // Adjust these for the size of the colored boxes.
    .attr('width', 15)
    .attr('height', 15)
    .attr('fill', function(d) {
      return color(d.data.key);
    });

  legend
    .append('text')
    .text(function(d, i) {
      return dataDomain[i];
    })
    .attr('fill', function(d) {
      return color(d.data.key);
    })
    .attr('class',function(d,i){
      return 'textLegend '+dataDomain[i];
    })
    .attr('x', 25)
    .attr('y', 15)
    .on("mouseenter", function(d,i) {

        text = svg.append("text")
            .attr("transform",'translate(0,0)')//, function(d, i) { return "translate(" + arc.centroid(d, i) + ")"; }
            .attr("dy", ".5em")
            .style("text-anchor", "middle")
            .attr("class", "on")
            .text(d.data.value);

        d3.selectAll('.' + dataDomain[i])
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

//############################ New implementation of legends ##########################

function createLegends(_cardNum,_layers){

  var _id = getCardId(_cardNum) + ' .legend-content';

  var titleOffset = 25,
      elementOffset = 50,
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
// if (layer.includes('highlighted')){
//   console.log('The layer: '+layer+' - NO GOOD')
// } else if (layer.includes('3d')) {
//   console.log('The layer: '+layer+' - NO GOOD')
// } else {//|| (!layer.includes('3d-buildings'))
for (layer of _layers){

  if (!layer.includes('highlighted')){//|| (!layer.includes('3d-buildings'))
    var layerOfInterest = layersData.find(function (l) {
      return l.name == layer;
    });
    var type = layerOfInterest.addLayerParams.default ?
      layerOfInterest.addLayerParams.default.type :
      layerOfInterest.addLayerParams.type;

    var layerName = layer;

    if (type == 'fill'){

      howLong += (2*50 + (100*0.4 + 0.2*100*layerOfInterest.source.url.length));

    } else if (type == 'circle'){

      var paint = {
        'circle-radius': map.getPaintProperty(layer,'circle-radius'),
        'circle-color' : map.getPaintProperty(layer,'circle-color')
      };

      if (paint['circle-color'] || paint['circle-radius']){
        if ((Array.isArray(paint['circle-color'])) && (Array.isArray(paint['circle-radius']))){
          if (paint['circle-color'].length >= paint['circle-radius'].length){
            howLong += ((((paint['circle-color'].length - 1) / 2) + 1)*50 + (75*0.4 + 0.2*75*layerOfInterest.source.url.length));
          } else {
            howLong += ((((paint['circle-radius'].length - 1) / 2) + 1)*50 + (75*0.4 + 0.2*75*(layerOfInterest.source.url.length + 1)));
          }
        } else {
          howLong += (2*50 + (100*0.4 + 0.2*100*layerOfInterest.source.url.length));
        }
      } else {
        howLong += (2*50 + (100*0.4 + 0.2*100*layerOfInterest.source.url.length));
      }
    } else if (type == 'fill-extrusion'){
      howLong += 0//(2*50 + (100*0.4 + 0.2*100*layerOfInterest.source.url.length));
    } else if (type == 'heatmap'){
      howLong += (2*50 + (100*0.4 + 0.2*100*layerOfInterest.source.url.length));
    }
    if (layerOfInterest.source.content[0].length>maxWidth){
      maxWidth = layerOfInterest.source.content[0].length;
    }
  }
}
// console.log('Height: '+howLong)
// console.log('Width: '+)
//################################ END OF NEW ##############################################
  var width = 300,
      widthExtent = width + 5*maxWidth

  var svg = d3.select(_id)
    .append('svg')
    .attr('id','hej')
      // Adjust the factor below to allows for more space for the legends
      .attr('width',widthExtent)
      .attr("height", howLong)//50*howLong
      // .attr('width','100%;')
      // .attr("height", 'auto;')

    var iter = 0;

    for (layer of _layers){

// Getting parameters for the legends.
      if (!layer.includes('highlighted')){// || (!layer.includes('3d-buildings'))
        var layerOfInterest = layersData.find(function (l) {
          return l.name == layer;
        });

        var type = layerOfInterest.addLayerParams.default ?
          layerOfInterest.addLayerParams.default.type :
          layerOfInterest.addLayerParams.type;
        //console.log(layer+'s type is: '+type)
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

        if (type == 'fill'){

          var paint = map.getPaintProperty(layer,'fill-color');// All where changed from layer to layerOfInterest
          //console.log(layer+'s type is: ' + paint)
        } else if (type == 'circle'){

          var paint = {
            'circle-radius': map.getPaintProperty(layer,'circle-radius'),
            'circle-color' : map.getPaintProperty(layer,'circle-color')
            //'circle-stroke-color': map.getPaintProperty(layer,'circle-stroke-color')
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
          //paint = [[],[],[],[],[0,paint['heatmap-color'][4]],[],[1,paint['heatmap-color'][paint['heatmap-color'].length-1]]];
          //type = 'fill';

        } else {
          return;
        }
      }
      else {
        return;
      }

    ///////// Defining the data ///////////////////////////
      if (typeof paint.length == 'undefined'){

        if (typeof paint['circle-radius'].length == 'undefined'){

          var [color,data] = structureData(type,paint);
          var setSize = false;

        } else {

          var [color,data,size,sizedata] = structureData(type,paint);
          var setSize = true;

        }

        var _offSet = 50;
        var _elementWidth = 15;

      } else {

        var [color,data] = structureData(type,paint);
        if (type == 'heatmap'){
          type = 'fill';
        }
        if (paint.length > 1) {

          var step = 20;
          var _offSet = (width/step);
          var _elementWidth = (width*2/step);

        } else {

          var _offSet = 15;
          var _elementWidth = 50;

        }
      }
    ///////////////////////////////////////////////////////
      if (prevType == 'fill'){

        titleOffset += (125 + (75*0.4+0.2*75*(prevURLS)))
        elementOffset += (125 + (75*0.4+0.2*75*(prevURLS)))

      } else if (prevType == 'circle') {

          titleOffset += ((prevSize + 1)*50 + (75*0.4+0.2*75*(prevURLS))),
          elementOffset += ((prevSize + 1)*50 + (75*0.4+0.2*75*(prevURLS)));
      }
    // It is assumed that the first legend is a fill, but if not, we correct that assumption
    if ((iter == 0) && (type =='circle')){
      if (setSize){
        if (data.length >= sizedata.length){
          sourceTitleOffset = (data.length + 1)*50;
        } else {
          sourceTitleOffset = (sizedata.length + 1)*50;
        }
      }
      else {
        sourceTitleOffset = (data.length + 1)*50;
      }
    }
    /////////////////////////// Generic /////////////////////////////////////////////////////////
      svg
        .append('g')
        .append('text')
        .attr('x',0)//
        .attr('y',titleOffset)
        .attr('text-anchor','start')
        .classed('title',true)
        .text(title);
    ///////////////////////////////////////////////////////////////////////////////////////////
      if (type == 'fill'){

        var legends = svg
              .append('g')
              .selectAll('.legends')
              .data(data);

        var legend = legends
              .enter()
              .append('g')
              .classed('legends',true)
              .attr('transform',function(d,i) {return "translate(" + (i)*_offSet + ","+elementOffset+")";});//*(width/_step)

        legend
          .append('rect')
          // Adjust these for the size of the colored boxes.
          .attr('width',_elementWidth)
          .attr('height',15)
          .attr('fill',function(d,i){return color(i);});

        legend
          .append('text')
          .text(function(d,i){ return d.value;})
          .attr('x',5)
          .attr('y',35)

      } else if (type == 'circle'){

        var legends = svg
              .append('g')
              .selectAll('.legends')
              .data(data);

        var legend = legends
              .enter()
              .append('g')
              .classed('legends',true)
              .attr('transform',function(d,i) {return "translate(0,"+ (elementOffset+(i)*_offSet) + ")";});//*(width/_step)

        legend
              .append('circle')
              // Adjust these for the size of the colored boxes.
              .attr('cx',_elementWidth)
              .attr('cy',_elementWidth)
              .attr('r',_elementWidth/2)
              .style('fill',function(d,i){return color[i];});

        if (layerOfInterest.highlight_type){
          var highlightTypeName = layerOfInterest.name;

          legend
              .append('text')
              .attr("class",function(d,i){
                return 'textLegend ' + data[i];
              })
              .text(function(d,i){ return data[i];})
              .attr('x',50)
              .attr('y',20)
              .on('mouseenter', function(d,i) {
                map.setFilter(highlightTypeName +'-highlighted', ['==', 'type', data[i]]);
              })
              .on("mouseout", function(d,i) {
                map.setFilter(highlightTypeName +'-highlighted', ['==', 'type', '']);//layerName
              });

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
                // Adjust these for the size of the colored boxes.
                .attr('cx',_elementWidth)
                .attr('cy',_elementWidth)
                .attr('r',function(d,i) {return size[i]*1;})//
                .style('fill','white')
                .style('stroke','black');

          if (layerOfInterest.highlight_size){
            var highlightSizeName = layerOfInterest.name;
            legend
                .append('text')
                .attr("class",function(d,i){
                  return 'textLegend ' + sizedata[i];
                })
                .text(function(d,i){ return sizedata[i];})
                .attr('x',50)
                .attr('y',20)
                .on('mouseenter', function(d,i) {
                  map.setFilter(highlightSizeName +'-highlighted', ['==', 'size', sizedata[i]]);
                })
                .on("mouseout", function(d,i) {

                  map.setFilter(highlightSizeName +'-highlighted', ['==', 'size', '']);
                });

          } else {
            legend
                .append('text')
                .text(function(d,i){ return sizedata[i];})
                .attr('x',50)
                .attr('y',20)
          }

        }

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

      if ((iter > 0) && (type == 'fill')){

        sourceTitleOffset += (125 + (75*0.4+0.2*75*sourceURL.length))//(140 + 20*sourceURL.length);

      } else if ((iter > 0) && (type == 'circle')) {

        if (prevSetSize==true){

          sourceTitleOffset += (sizedata.length + 1)*50 + (75*0.4+0.2*75*sourceURL.length);//75;

        } else {

          sourceTitleOffset += (data.length + 1)*50 + (75*0.4+0.2*75*sourceURL.length);//75;

        }
      }

      svg
        .append('text')
        .attr('x',0)//
        .attr('y',sourceTitleOffset)
        .attr('text-anchor','start')
        .classed('title',true)
        .text('Sources');

      var sources = svg
            .append('g')
            .selectAll('.sources')
            .data(sourceData)

      var source = sources
            .enter()
            .append('g')
            .classed('sources',true)

      source
        .append("a")
        .attr("xlink:href", function(d){ return d.url})
        .attr('target', 'blank')
        .append('text')
        .text(function(d,i){ return (d.name+', '+d.type);})
        .attr('x',0)
        .attr('y',function(d,i){ return ((sourceTitleOffset+sourceTitleToSourcesOffset)+(i*sourceSpace));})

    iter += 1;
    prevType = type;
    prevURLS = sourceURL.length;
    }
}

  function structureData(_dataType,_dataPaint,_step = 20){

    if (_dataType == 'fill'){
      if (Array.isArray(_dataPaint)){

        var color1 = _dataPaint[4][1],
            color2 = _dataPaint[6][1];

        var color = interpolateColors([color1,color2],_step);

        var data = [];

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
        //////////////////////////// Data /////////////////////////////////////

        var color = interpolateColors(_dataPaint,1);
        var data = [{'id':1,'value':'fill'}];//_title
      }
    } else if (_dataType == 'circle'){
      ////////////////////////// CIRCLES /////////////////////////////////////////
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

      //var step = 20;
      var substep = [],
          normSubStep = [];
      for (var i = 0; i < _step; i += _dataPaint.length){
        substep.push(i);
        normSubStep.push(i/_step);
      }
      var color = interpolateColors(_dataPaint,substep);

      var data = [];

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
      console.log(_dataType,': ERROR:  I dont know this datatype!')
      return;
    }

    if (setSize){

      return [color,data,size,sizedata];

    } else {

      return [color,data];

    }

  }

  function interpolateColors(_colors,_step = 1){
    if (!Array.isArray(_step)){
      var steps = [0,_step];
    } else {
      var steps = _step;
    }
    if (!Array.isArray(_colors)){
      var colors = [_colors];
    } else {
      var colors = _colors;
    }
    var color = d3.scaleLinear()
        .domain(steps)//[0, _step]
        .range(colors)//[_color1, _color2]
        .interpolate(d3.interpolateHcl);

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
