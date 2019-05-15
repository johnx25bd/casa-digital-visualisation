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


function setActiveCard(_cardNum) {
  if (_cardNum === activeCardNum) {
    return;
  }
  //

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
