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

  // console.log(_cards);

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
      return d.extent + 'card-body';
    })
    .classed('col-12', true)
    .classed('app-card', true)
    .on('click', function(d, i) {
      // console.log("CLICK!");
      setActiveCard(i);
    });

  cardEls.append('h1')
    .text(function(d) {
      return d.title;
    });

  cardEls.append('div')
    // .classed('card-body', true)
    .html(function(d) {
      return d.content;
    });

  var featureContent = cardEls.append('div')
    .classed('card feature', true)
    .append('div')
    .classed('card-body', true);

  featureContent.append('h3')
    .classed('card-title', true)
    .text('Feature Content');

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
    // console.log("CARD", card);
  }

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

  updateLegend(_cardNum)
}


function updateLegend(layers) {
  // iterate through array of layers
  // Add each layer's legend to .legend div
  // console.log("updateLegend() Called");
}

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

  scrollToCard(_cardNum);
  // console.log(cardData[cardNum]);
  map.flyTo(cardData[_cardNum].flyTo);

  $("div[data-index='" + String(_cardNum) + "']")
    .addClass('active');
  $("div[data-index='" + String(activeCardNum) + "']")
    .removeClass('active');

  $('.jump-to-view.active').removeClass('active');

  $('#' + cardData[_cardNum].extent + '-view')
    .addClass('active');

  // consider scroll .cards div to card ...

  showCardLayers(_cardNum);

  activeCardNum = _cardNum;
  // }
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
    scrollTop: $(id).offset().top - 80
  }, 500, function() {
    inAnimation = false;
  });
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






function createPieChartOld (_params, _parentEl) {

  var _data = _params.data;
  var _title = _params.title;
  var _parentEl = _params.id;


  // set the dimensions and margins of the graph
  var width = d3.select(_parentEl).node().getBoundingClientRect().width,
      height = width / 2.5,
      margin = 10;

  // The radius of the pieplot is half the width or half the height (smallest one). I substract a bit of margin.
  var radius = Math.min(width, height) / 2 - margin

  // append the svg object to the div called 'my_dataviz'
  var svg = d3.select(_parentEl)
    .append("svg")
      .classed('pie-chart', true)
      .attr("width", width)
      .attr("height", height)
    .append("g")
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

  // Create dummy data
  // var data = {a: 9, b: 20, c:30, d:8, e:12, f:3, g:7, h:14}
  var dataDomain = Object.keys(data);

  // set the color scale
  var color = d3.scaleOrdinal()
    // Alternated to allow for dynamically colouring.
    .domain(dataDomain)//.domain(["aa", "bb", "cc", "d", "e", "f", "g", "h"])
    .range(d3.schemeDark2);

  // Compute the position of each group on the pie:
  var pie = d3.pie()
    .sort(null) // Do not sort group by size
    .value(function(d) {return d.value; })

  var data_ready = pie(d3.entries(data))
  // The arc generator
  var arc = d3.arc()
    .innerRadius(radius * 0.5)         // This is the size of the donut hole
    .outerRadius(radius * 0.8)

  // Another arc that won't be drawn. Just for labels positionning
  var outerArc = d3.arc()
    .innerRadius(radius * 0.9)
    .outerRadius(radius * 0.9)

  // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
  svg
    .selectAll('.pie-slice')
    .data(data_ready)
    .enter()
    .append('path')
    .attr('d', arc)
    .attr('fill', function(d, i){
      // console.log(d.data.key)
      return color(d.data.key); })
    .attr("stroke", "white")
    .style("stroke-width", "2px")
    .style("opacity", 0.7)
    .classed('pie-slice', true);

  // Add the polylines between chart and labels:
  svg
    .selectAll('polyline')
    .data(data_ready)
    .enter()
    .append('polyline')
      .attr("stroke", "black")
      .style("fill", "none")
      .attr("stroke-width", 1)
      .attr('points', function(d) {
        var posA = arc.centroid(d) // line insertion in the slice
        var posB = outerArc.centroid(d) // line break: we use the other arc generator that has been built only for that
        var posC = outerArc.centroid(d); // Label position = almost the same as posB
        var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2 // we need the angle to see if the X position will be at the extreme right or extreme left
        posC[0] = radius * 0.95 * (midangle < Math.PI ? 1 : -1); // multiply by 1 or -1 to put it on the right or on the left
        return [posA, posB, posC]
      })

  // Add the polylines between chart and labels:
  svg
    .selectAll('pie-label')
    .data(data_ready)
    .enter()
    .append('text')
      .text( function(d) { return d.data.key } )
      .attr('transform', function(d) {
          var pos = outerArc.centroid(d);
          var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
          pos[0] = radius * 0.99 * (midangle < Math.PI ? 1 : -1);
          return 'translate(' + pos + ')';
      })
      .style('text-anchor', function(d) {
          var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
          return (midangle < Math.PI ? 'start' : 'end')
      })
    .classed('pie-label', true);
}


// fitText jQuery plugin, for airport codes
// from https://github.com/davatron5000/FitText.js

(function( $ ){

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
