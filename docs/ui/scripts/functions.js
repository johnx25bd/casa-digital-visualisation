
function buildAddLayerParams(_layerData) {
  if (_layerData.type == 'geojson') {
    var outputParams = {};
    outputParams.id = _layerData.name;
    outputParams.source = _layerData.name + '-source';
    outputParams = {...outputParams,
      ... _layerData.addLayerParams.default
        ? _layerData.addLayerParams.default
        : _layerData.addLayerParams };
    return outputParams;
  } else if (_layerData.type == 'mapbox') {
    return _layerData.addLayerParams.default
      ? _layerData.addLayerParams.default
      : _layerData.addLayerParams;
  }

}


function isElementOnScreen(cardNum) {
  // Directly from https://docs.mapbox.com/mapbox-gl-js/example/scroll-fly-to/
  var element = document.querySelector("div[data-index='" + String(cardNum) + "']")
  var bounds = element.getBoundingClientRect();

  // !!! This could use some work - improve moment when
  // new active card is set ... could add clicked? attribute,
  // and
  return bounds.top < window.innerHeight && bounds.bottom > 80;
}


function loadCards(cards) {
  // iterate through and load cards into .cards div

  console.log(cards);

  var cardsHolder = d3.select('#story-cards');


  var cardEls = cardsHolder.selectAll('div')
    .data(cards).enter()
    .append('div')
    .attr('id', function(d) {
      return d.extent + "-card-" + String(d.cardNum);
    })
    .attr('data-index', function(d, i) {
      return i;
    })
    .attr('class', function(d) {
      return d.extent + 'card-body';
    })
    .classed('col-12', true)
    .classed('app-card', true)
    .on('click', function(d) {
      console.log("CLICK!");
      setActiveCard(d.cardNum);
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

}

function showCardLayers(cardNum) {

  var layers = cardData[cardNum].layers;

  Object.keys(loadedData).forEach(function(layer) {

    if (layers.includes(layer)) {
      console.log("Setting", layer, 'to visible!')
      map.setLayoutProperty(layer, 'visibility', 'visible');
    } else {
      map.setLayoutProperty(layer, 'visibility', 'none');
    }
  });

  updateLegend(cardNum)
}


function updateLegend(layers) {
  // iterate through array of layers
  // Add each layer's legend to .legend div
  // console.log("updateLegend() Called");
}


function setActiveCard(cardNum) {
  if (cardNum === activeCardNum) {
    return;
  }
  //

  scrollToCard(cardNum);
  // console.log(cardData[cardNum]);
  map.flyTo(cardData[cardNum].flyTo);

  $("div[data-index='" + String(cardNum) + "']")
    .addClass('active');
  $("div[data-index='" + String(activeCardNum) + "']")
    .removeClass('active');

  // consider scroll .cards div to card ...

  showCardLayers(cardNum);

  activeCardNum = cardNum;
// }
}

function scrollToCard(cardNum) {
  // adapted from https://stackoverflow.com/questions/6677035/jquery-scroll-to-element

  inAnimation = true;
  // console.log("inAnimation:", inAnimation);
  var cardTmp = cardData[cardNum];
  var id = '#'  + cardTmp.extent + '-card-' + String(cardNum);
  // console.log(id);
  // setActiveCard(cardNum);

  $([document.documentElement, document.body]).animate({
      scrollTop: $(id).offset().top - 80
  }, 500, function () {
    inAnimation = false; });
}
// $("#button").click(function() {
