function buildAddLayerParams(_layerData) {
  if (_layerData.type == 'geojson') {
    var outputParams = {};
    outputParams.id = _layerData.name;
    outputParams.source = _layerData.name + '-source';
    outputParams = { ...outputParams,
      ..._layerData.addLayerParams.default ?
      _layerData.addLayerParams.default :
        _layerData.addLayerParams
    };
    return outputParams;
  } else if (_layerData.type == 'mapbox') {
    return _layerData.addLayerParams.default ?
      _layerData.addLayerParams.default :
      _layerData.addLayerParams;
  }

}

function getCardId(_cardNum) {
  return '#' + cardData[_cardNum].extent
    + '-card-' + _cardNum;
}

function currentCardId() {
  return '#' + cardData[activeCardNum].extent
    + '-card-' + activeCardNum;
}

function isElementOnScreen(_cardNum) {
  // Directly from https://docs.mapbox.com/mapbox-gl-js/example/scroll-fly-to/
  var element = document.querySelector("div[data-index='" + String(_cardNum) + "']")
  var bounds = element.getBoundingClientRect();

  // !!! This could use some work - improve moment when
  // new active card is set ... could add clicked? attribute,
  // and
  return bounds.top < window.innerHeight && bounds.bottom > 80;
}


function loadCards(_cards) {
  // iterate through and load cards into .cards div

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
      // console.log("CLICK!");
      setActiveCard(i);
    });

  cardEls.append('h1')
    .text(function(d) {
      return d.title;
    });

  cardEls.append('div')
    .html(function(d) {
      return d.content;
    });

  var featureContent = cardEls.append('div')
    .classed('card feature', true)
    .append('div')
    .classed('card-body', true);

  featureContent.append('p')
    .classed('card-title lead mb-0', true)
    .text('');

  featureContent.append('div')
    .classed('col-12 feature-content', true);

  var legendContent = cardEls.append('div')
    .classed('card legend', true)
    .append('div')
    .classed('card-body', true);

  legendContent.append('h3')
    .classed('card-title', true)
    .text('Legend');

  legendContent.append('div')
    .classed('col-12 legend-content', true);

  for (i in _cards) {
    var card = _cards[i];

    if (card.loadCard) {
      card.loadCard(i, card);
    }
    /// Loading legends /////
    console.log("The layers are: ",card.layers)
    console.log("The card number are",i)
    updateLegend(card.layers,i);

  }
  //console.log("Layers",_cards[0].layers)
}

function showCardLayers(_cardNum) {

  var layers = cardData[_cardNum].layers;

  Object.keys(loadedData).forEach(function(layer) {

    if (layers.includes(layer)) {
      console.log("Setting", layer, 'to visible!')
      map.setLayoutProperty(layer, 'visibility', 'visible');
    } else {
      map.setLayoutProperty(layer, 'visibility', 'none');
    }
  });

  //updateLegend(layers,_cardNum);
}

function updateLegend(_layers,_cardNum) {

  _legendSelector = getCardId(_cardNum) + ' .legend-content'

  for (layer of _layers){

    var layerOfInterst = layersData.find(function (l) {
      return l.name == layer;
    });

    var layerType = layerOfInterst.addLayerParams.default ?
      layerOfInterst.addLayerParams.default.type :
      layerOfInterst.addLayerParams.type;

    if (layerType == 'fill'){

      var layerPaint = map.getPaintProperty(layer,'fill-color');

    } else if (layerType == 'circle'){

      var layerPaint = {
        'circle-radius': map.getPaintProperty(layer,'circle-radius'),
        'circle-color' : map.getPaintProperty(layer,'circle-color'),
        'circle-stroke-color': map.getPaintProperty(layer,'circle-stroke-color')
      };
    }

    createLegends(_legendSelector,layer,layerType,layerPaint);
  }
}

// function updateLegend(_layers,_legendSelector) {
//
//   //var data = [];
//
//   for (layer in _layers){
//
//     var layerOfInterst = map.getLayer(layer);
//     var layerType = layerOfInterst.add.type;
//
//     if (layerType == 'fill'){
//
//       var layerPaint = map.getLayoutProperty(layer,'fill-color')
//
//     } else if (layerType == 'circle'){
//
//       var layerPaint = {
//         'circle-radius': map.getLayoutProperty(layer,'circle-radius'),
//         'circle-color' : map.getLayoutProperty(layer,'circle-color'),
//         'circle-stroke-color': map.getLayoutProperty(layour,'circle-stroke-color')
//       };
//     }
//
//     createLegends(_legendSelector,layer,layerType,layerPaint);
//   }
//
//   // iterate through array of layers
//   // Add each layer's legend to .legend div
//   // console.log("updateLegend() Called");
// }

function titleCase(_str) {
  // Directly from https://medium.freecodecamp.org/three-ways-to-title-case-a-sentence-in-javascript-676a9175eb27
  // 🙏🙏🙏🙏🙏🙏🙏
  return _str.toLowerCase().split(' ').map(function(word) {
    return (word.charAt(0).toUpperCase() + word.slice(1));
  }).join(' ');
}

function setActiveCard(_cardNum) {
  if (_cardNum === activeCardNum) {
    return;
  }

  // map.setStyle(baseStyle);
// if (!inAnimation) {
//
// }
  scrollToCard(_cardNum);

  map.flyTo(cardData[_cardNum].flyTo);

  $("div[data-index='" + String(_cardNum) + "']")
    .addClass('active');
  $("div[data-index='" + String(activeCardNum) + "']")
    .removeClass('active');

  $('.jump-to-view.active').removeClass('active');

  $('#' + cardData[_cardNum].extent + '-view')
    .addClass('active');

  showCardLayers(_cardNum);

  activeCardNum = _cardNum;

}

function scrollToCard(_cardNum) {
  // adapted from https://stackoverflow.com/questions/6677035/jquery-scroll-to-element

  inAnimation = true;
  // console.log("inAnimation:", inAnimation);
  var cardTmp = cardData[_cardNum];
  var id = '#' + cardTmp.extent + '-card-' + String(_cardNum);
  // console.log(id);
  // setActiveCard(cardNum);

  $([document.documentElement, document.body]).animate({
    scrollTop: $(id).offset().top - 56
  }, 500, function() {
    inAnimation = false;
  });
}

function setFeatureContentText (_cardNum, _layer) {
  console.log("SetFeatureContext", _cardNum)
  var cardId = '#' + cardData[_cardNum].extent + '-card-' + String(_cardNum);
  d3.select(cardId + ' .card-title')
    .text('Click on a ' + _layer + ' to learn more.')
}

// D3 Chart Functions
function createBarChart(_params, _parentEl) {

  var file = _params.dataPath,
    y_legend = _params.yAxisLabel,
    title = _params.title,
    type = _params.valueType;

  var width = d3.select(_parentEl).node().getBoundingClientRect().width,
    height = width * 0.3 ,
    margin = 0;

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

    // from https://eddyerburgh.me/create-responsive-bar-chart-d3-js


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
      .attr("class", "bar")
      .attr("x", function(d) {
        return xScale(d.name);
      })
      .attr("y", function(d) {
        return yScale(d.value);
      })
      .attr("width", xScale.bandwidth())
      .attr("height", function(d) {
        return height - yScale(d.value);
      });

  });
}



function createPieChart(_params, _parentEl){


  var width = d3.select(_parentEl).node().getBoundingClientRect().width ,
      height = width / 2,
      margin = 0;

    var id = _parentEl,
        _title = _params.title;

    var data = _params.data;

    // The radius of the pieplot is half the width or half the height (smallest one). I substract a bit of margin.
    var radius = Math.min(width, height) / 2 - margin;

    // append the svg object to the div called 'my_dataviz'
    var svg = d3.select(id)
      .append("svg")
        // Adjust the factor below to allows for more space for the legends
        .attr("width", width*1)
        .attr("height", height)
      .append("g")
        .attr("transform", "translate(" + width / 4 + "," + height / 2 + ")");//" + width / 2 + "

    var dataDomain = Object.keys(data)

    // set the color scale
    var color = d3.scaleOrdinal()
      // Alternated to allow for dynamically colouring.
      .domain(dataDomain)
      .range(d3.schemeDark2);

    // Compute the position of each group on the pie:
    var pie = d3.pie()
      .sort(null) // Do not sort group by size
      .value(function(d) {return d.value; });

    var data_ready = pie(d3.entries(data))

    // The arc generator
    var arc = d3.arc()
      .innerRadius(radius * 0.5)         // This is the size of the donut hole
      .outerRadius(radius * 0.8)

    // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
    svg
      .append('g')
      .selectAll('path')
      .data(data_ready)
      .enter()
      .append('path')
      .attr('d', arc)
      .attr('fill', function(d){return color(d.data.key);})
      .attr("stroke", "white")
      .style("stroke-width", "2px")
      .style("opacity", 0.90);

    // Adding a title
    svg
      .append('text')
      .attr('x',0)//
      .attr('y',-180)
      .attr('text-anchor','middle')
      .classed('title',true)
      .text(_title);

    var legends = svg
                    .append('g')
                    .attr('transform','translate(' + width / 2 +  ',' + height * -.5 + ')') // 300,-140
                    .selectAll('.legends')
                    .data(data_ready);

    var legend = legends
                    .enter()
                    .append('g')
                    .classed('legends',true)
                    .attr('transform',function(d,i) {return "translate(-80," + (i+1)*20 + ")";});

    legend
      .append('rect')
      // Adjust these for the size of the colored boxes.
      .attr('width',15)
      .attr('height',15)
      .attr('fill',function(d){return color(d.data.key);});

    legend
      .append('text')
      .text(function(d,i){ return dataDomain[i];})
      .attr('fill',function(d){return color(d.data.key);})
      .attr('x',25)
      .attr('y',15)

  }

function createLegends(_div_id,_svg_id,_dataType,_dataPaint){

  ////////////////////// Defining parameters ////////////////////////////
  var id = _div_id
  // Defining the variables based on the type of the data loaded in.
  if (_dataType == 'fill'){
    ///////////////////////// FILL ////////////////////////////////////////////
    var width = 150//300
        height = 100//150

    if (_dataPaint.length > 1){
      // If you are a fill taking on many colors!
      _step = 20;
      _min = _dataPaint[3];
      _max = _dataPaint[5];
      _color1 = _dataPaint[4][1];
      _color2 = _dataPaint[6][1];
      var _offSet = (width*2/_step);
      var _elementWidth = (width*2/_step);
    } else {
      // If you are a fill taking only one color
      _step = 1;
      _min = 1
      _max = 2;
      _color1 = _dataPaint[0];
      _color2 = _dataPaint[0];
      var _offSet = 15;//(width*2/_step);
      var _elementWidth = 50;
    }

  } else if (_dataType == 'circle') {
    // If you are circle layer, we need a lot more information.

    var width = 300
        height = 300

    var _offSet = 50;
    var _elementWidth = 15;
    _step = null;
  }
  ////////////////////// Done defining parameters - Let's build! ////////////////////////////
  if (_dataType == 'fill'){
    if (_dataPaint.length > 1){
      // var generateRange = d3.scaleLinear()
      //   .domain([0,_step])
      //   .range([_min,_max])
      //////////////////////////// Data /////////////////////////////////////
      var color = d3.scaleLinear()
          .domain([0, _step])//.domain([_min, _max])
          .range([_color1, _color2])
          .interpolate(d3.interpolateHcl); //interpolateHsl interpolateHcl interpolateRgb

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
      //////////////////////////// Creating the legend /////////////////////////////////////
      var svg = d3.select(id)
        .append('svg')
        .attr('id',_svg_id)
          // Adjust the factor below to allows for more space for the legends
          .attr("width", '100%;')
          .attr("height", 'auto;')
        .append("g")
          .attr("transform", "translate(" + width*1.25 + "," + height + ")");//" + width / 2 + "

      svg
        .append('text')
        .attr('x',-125)//
        .attr('y',-30)
        .attr('text-anchor','middle')
        .classed('title',true)
        .text(_svg_id);

      var legends = svg
            .append('g')
            .attr('transform','translate(-175,-100)')
            .selectAll('.legends')
            .data(data);

      var legend = legends
            .enter()
            .append('g')
            .classed('legends',true)
            .attr('transform',function(d,i) {return "translate(" + (i+1)*_offSet + ",100)";});//*(width/_step)

      legend
        .append('rect')
        // Adjust these for the size of the colored boxes.
        .attr('width',_elementWidth)
        .attr('height',15)
        .attr(_dataType,function(d){return color(d.id);});

      legend
        .append('text')
        .text(function(d,i){ return d.value;})
        .attr('x',5)
        .attr('y',35)

    } else if (_dataPaint.length == 1){
      //////////////////////////// Data /////////////////////////////////////
      var color = [_dataPaint[0]];
      var data = [_svg_id];
      //////////////////////////// Creating the legend /////////////////////////////////////
      var svg = d3.select(id)
        .append('svg')
        .attr('id',_svg_id)
          // Adjust the factor below to allows for more space for the legends
          .attr("width", '100%;')
          .attr("height", 'auto;')
        .append("g")
          .attr("transform", "translate(" + width*1.25 + "," + height + ")");//" + width / 2 + "

      svg
        .append('text')
        .attr('x',-125)//
        .attr('y',-30)
        .attr('text-anchor','middle')
        .classed('title',true)
        .text(_svg_id);

      var legends = svg
            .append('g')
            .attr('transform','translate(-175,-100)')
            .selectAll('.legends')
            .data(data);

      var legend = legends
            .enter()
            .append('g')
            .classed('legends',true)
            .attr('transform',function(d,i) {return "translate(" + (i+1)*_offSet + ",100)";});//*(width/_step)

      legend
        .append('rect')
        // Adjust these for the size of the colored boxes.
        .attr('width',_elementWidth)
        .attr('height',15)
        .attr(_dataType,color[0]);//function(d){return color(d.id);});

      legend
        .append('text')
        .text(data[0])
        .attr('x',65)
        .attr('y',12)

    }
  } else if (_dataType == 'circle'){
    ////////////////////////// CIRCLES /////////////////////////////////////////
    //////////////////////////// Data /////////////////////////////////////
    var color = [];
    var data = [];

    for (var i = 3; i < (_dataPaint['circle-color'].length);i +=2){
      color.push(_dataPaint['circle-color'][i]);
      data.push(_dataPaint['circle-color'][i-1])
    }
    color.push('#cfd9df')
    data.push('other')

    var size = [];
    var sizedata = [];

    for (var i = 3; i < (_dataPaint['circle-radius'].length);i +=2){
      size.push(_dataPaint['circle-radius'][i]);
      sizedata.push(_dataPaint['circle-radius'][i-1])
    }
    size.push(5)
    sizedata.push('other')
    //////////////////////////// Creating the legend /////////////////////////////////////
    var svg = d3.select(id)
      .append('svg')
      .attr('id',_svg_id)
        // Adjust the factor below to allows for more space for the legends
        .attr("width", width)
        .attr("height", height)
      .append("g")
        .attr("transform", "translate(" + width/1.5 + "," + height/4 + ")");//" + width / 2 + "

    svg
      .append('text')
      .attr('x',-140)//
      .attr('y',-30)
      .attr('text-anchor','middle')
      .classed('title',true)
      .text(_svg_id);
    // Categories
    var legends = svg
          .append('g')
          .attr('transform','translate(-175,-150)')
          .selectAll('.legends')
          .data(data);

    var legend = legends
          .enter()
          .append('g')
          .classed('legends',true)
          .attr('transform',function(d,i) {return "translate(0,"+ + (i+3)*_offSet + ")";});//*(width/_step)

    legend
      .append('circle')
      // Adjust these for the size of the colored boxes.
      .attr('cx',_elementWidth)
      .attr('cy',_elementWidth)
      .attr('r',_elementWidth)
      .style('fill',function(d,i){return color[i];});

    legend
      .append('text')
      .text(function(d,i){ return data[i];})
      .attr('x',50)
      .attr('y',20)
    // Size ///
    var legends = svg
          .append('g')
          .attr('transform','translate(-175,-150)')
          .selectAll('.legends')
          .data(sizedata);

    var legend = legends
          .enter()
          .append('g')
          .classed('legends',true)
          .attr('transform',function(d,i) {return "translate(150,"+ + (i+3)*_offSet + ")";});//*(width/_step)

    legend
      .append('circle')
      // Adjust these for the size of the colored boxes.
      .attr('cx',_elementWidth)
      .attr('cy',_elementWidth)//function(d,i) {return size[i]*2;}
      .attr('r',function(d,i) {return size[i]*2;})
      .style('fill','white')
      .style('stroke','black');
    legend
      .append('text')
      .text(function(d,i){ return sizedata[i];})
      .attr('x',50)
      .attr('y',20)
  } else {
    console.log('ERROR:  I dont know this datatype!')
  }
}

// fitText jQuery plugin, for airport codes
// from https://github.com/davatron5000/FitText.js

(function ( $ ){

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
