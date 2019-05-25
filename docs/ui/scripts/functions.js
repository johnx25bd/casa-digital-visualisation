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
    var outputParams = _layerData.addLayerParams.default ?
      _layerData.addLayerParams.default :
      _layerData.addLayerParams;

    outputParams.id = _layerData.name;

    return outputParams;

    }

}
function currentCardId() {
  return '#' + cardData[activeCardNum].extent
    + '-card-' + activeCardNum;
}

function getCardId(_cardNum) {
  return '#' + cardData[_cardNum].extent
    + '-card-' + _cardNum;
}

function isNextCardOnScreen(_cardNum) {
  if (activeCardNum == cardData.length - 1) {
    return false;
  }
  // Directly from https://docs.mapbox.com/mapbox-gl-js/example/scroll-fly-to/
  var element = document.querySelector("div[data-index='" + String(_cardNum) + "']")
  var bounds = element.getBoundingClientRect();
  console.log(bounds);

  return bounds.top < window.innerHeight / 2;
}

function isPriorCardOnScreen(_cardNum) {
  // Directly from https://docs.mapbox.com/mapbox-gl-js/example/scroll-fly-to/
  var element = document.querySelector("div[data-index='" + String(_cardNum) + "']")
  var bounds = element.getBoundingClientRect();
  console.log(bounds);

  return bounds.bottom > window.innerHeight / 2;
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
    .text('');

  featureContent.append('div')
    .classed('col-12 feature-content', true);


  // Legend
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
    // .classed('card', true);

  additionalContent.append('div')
    .classed('col-12', true)
    .html(function(d) {
      return d.content;
    });





  for (i in _cards) {
    var card = _cards[i];

    if (card.loadCard) {
      card.loadCard(i, card);
    }
    console.log(card.layers);
    /// Loading legends /////
    createLegends(i,card.layers);
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
}

function titleCase(_str,_separator=' ') {
  // Directly from https://medium.freecodecamp.org/three-ways-to-title-case-a-sentence-in-javascript-676a9175eb27
  // 🙏🙏🙏🙏🙏🙏🙏
  return _str.toLowerCase().split(_separator).map(function(word) {
    return (word.charAt(0).toUpperCase() + word.slice(1));
  }).join(' ');
}

function setActiveCard(_cardNum) {
  if (_cardNum === activeCardNum) {
    return;
  }

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

// DEPRECATED FOR NOW : erratic animation behavior
function scrollToCard(_cardNum) {
  // adapted from https://stackoverflow.com/questions/6677035/jquery-scroll-to-element
  if (!$('body').hasClass('scrolling')) {


    $('body').addClass('scrolling');

    setTimeout(function () {
      $('body').removeClass('scrolling');
    }, 1200)

    setActiveCard(_cardNum);

    // console.log("inAnimation:", inAnimation);
    var cardTmp = cardData[_cardNum];
    var id = '#' + cardTmp.extent + '-card-' + String(_cardNum);
    // console.log(id);
    // setActiveCard(cardNum);

    $([document.documentElement, document.body]).animate({
      scrollTop: $(id).offset().top - (56 + 70)
    }, 1000, function() {
      inAnimation = false;
    });
  }
}

function setFeatureContentText (_cardNum, _layer) {
  console.log("SetFeatureContext", _cardNum)
  var cardId = '#' + cardData[_cardNum].extent + '-card-' + String(_cardNum);
  // console.log("The card ID is: ",cardId)
  d3.select(cardId + ' .card-title')
    .text('Click on a ' + _layer + ' to learn more.')
}

// D3 Chart Functions
function createBarChart(_params, _parentEl) {

  var file = _params.dataPath,
    y_legend = _params.yAxisLabel,
    title = _params.title,
    type = _params.valueType,
    layerOfInterst = _params.layerName;

  var width = d3.select(_parentEl).node().getBoundingClientRect().width,
    height = width * 0.3 ,
    margin = 0;

    //console.log(height);

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

    //
    var mouseover = function(d) {
      Tooltip
        .style("opacity", 1)
      d3.select(this)
        .style("stroke", "black")
        .style("opacity", 1)
    }
    var mousemove = function(d) {
      Tooltip
        .html("The exact value of<br>this cell is: " + d.value)
        .style("left", (d3.mouse(this)[0]+70) + "px")
        .style("top", (d3.mouse(this)[1]) + "px")
    }
    var mouseleave = function(d) {
      Tooltip
        .style("opacity", 0)
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

        //map.setPaintProperty(layerOfInterst, ['==', 'iso3', d.iso3]);
        //console.log(layerOfInterst);
        map.setFilter(layerOfInterst +'-highlighted', ['==', 'code', d.code]);
      })
      .on("mouseout", function(d) {
             text.remove();
             map.setFilter(layerOfInterst +'-highlighted', ['==', 'code', '']);
      });

  });
}

function highlightCountry (_layerName, _iso3) {
  map.setFilter(_layerName +'-highlighted', ['==', 'iso3', _iso3]);
}

function unhighlightCountry (_layerName) {
  map.setFilter(_layerName +'-highlighted', ['==', 'iso3', '']);
}

function createPieChart(_params, _parentEl) {


  var width = d3.select(_parentEl).node().getBoundingClientRect().width,
    height = width / 2,
    margin = 0;

  var id = _parentEl,
    _title = _params.title;

  var data = _params.data;
  console.log(id+': '+ data)
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
        //console.log("mousein")
        text = svg.append("text")
            .attr("transform", function(d, i) { return "translate(" + arc.centroid(d, i) + ")"; })
            .attr("dy", ".5em")
            .style("text-anchor", "middle")
            .attr("class", "on")
            .text(d.data.value);

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
            .attr("transform", function(d, i) { return "translate(" + arc.centroid(d, i) + ")"; })
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
for (layer of _layers){
  if (!layer.includes('highlighted')){
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
      if (!layer.includes('highlighted')){
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

          paint = [[],[],[],[],[0,paint['heatmap-color'][4]],[],[1,paint['heatmap-color'][paint['heatmap-color'].length-1]]];
          type = 'fill';

        } else {
          return;
        }
      } else {
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

          console.log((75*0.4+0.2*75*prevURLS))
          titleOffset += ((prevSize + 1)*50 + (75*0.4+0.2*75*(prevURLS))),
          elementOffset += ((prevSize + 1)*50 + (75*0.4+0.2*75*(prevURLS)));
      }
    // It is assmued that the first legend is a fill, but if not, we correct that assumption
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

        legend
              .append('text')
              .attr("class",function(d,i){
                return 'textLegend ' + data[i];
              })
              .text(function(d,i){ return data[i];})
              .attr('x',50)
              .attr('y',20)
              .on('mouseenter', function(d,i) {
                map.setFilter(layerName +'-highlighted', ['==', 'type', data[i]]);
              })
              .on("mouseout", function(d,i) {
                     map.setFilter(layerName +'-highlighted', ['==', 'type', '']);
              });
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
                // .attr("class",function(d,i){
                //   return 'textLegend '+sizedata[i];
                // })
                .attr('r',function(d,i) {return size[i]*1;})//
                .style('fill','white')
                .style('stroke','black');

          legend
                .append('text')
                .attr("class",function(d,i){
                  return 'textLegend ' + sizedata[i];
                })
                .text(function(d,i){ return sizedata[i];})
                .attr('x',50)
                .attr('y',20)
                .on('mouseenter', function(d,i) {
                  map.setFilter(layerName +'-highlighted', ['==', 'size', sizedata[i]]);
                })
                .on("mouseout", function(d,i) {
                       map.setFilter(layerName +'-highlighted', ['==', 'size', '']);
                });
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
        .append('text')
        .text(function(d,i){ return (d.name+', '+d.type+': Source');})
        .attr('x',0)
        .attr('y',function(d,i){ return ((sourceTitleOffset+sourceTitleToSourcesOffset)+(i*sourceSpace));})

    iter += 1;
    prevType = type;
    prevURLS = sourceURL.length;
    }
}

  function structureData(_dataType,_dataPaint){

    if (_dataType == 'fill'){
      if (Array.isArray(_dataPaint)){

        var step = 20,
            color1 = _dataPaint[4][1],
            color2 = _dataPaint[6][1];

        var color = interpolateColors(color1,color2,step);

        var data = [];

        for (var ele = 0; ele < step; ele++){

          if (ele === 0){
              data.push({'id':ele, 'value':'Low'});
          } else if (ele === (step - 1)){
              data.push({'id':ele, 'value':'High'});
          } else {
            data.push({'id': ele, 'value':''})
          }
        }

      } else {
        //////////////////////////// Data /////////////////////////////////////
        var color = interpolateColors(_dataPaint[0],_dataPaint[0],1);
        var data = [{'id':0,'value':'fill'}];//_title
        //var height = 100;
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

  function interpolateColors(_color1,_color2,_step = 1){

    var color = d3.scaleLinear()
        .domain([0, _step])
        .range([_color1, _color2])
        .interpolate(d3.interpolateHcl);

    return color;

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
