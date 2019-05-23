
# Mission Critical Deliverables

_prior to presentation_


## Kristian

[] Refactor bar chart to accept `_highlightId` (column in csv) and `_highlightLayer` (layer id from map), and apply filter to highlight layer. See `createCustomBarChart()` defined in `cardData[0].loadCard()`.
  [] Bonus - can we get it so the bar highlights when you hover on the country? Probably by classing the `<rect>` element with ISO3 code, then on mouseenter `d3.selectAll('.' + feature.iso3).classed('active', true);`, and removing the class on mouseleave.


[] More sophisticated flow map - probably of UK with trading partners? This could go on National view card 1 or the last card on the Global view

[] Some time series visualization? How could we get this in there? Do we have any time series data? Maybe of export volumes? Even just adding a slider to the card and updating the choropleth would mean this is a 'temporal' visualization as well as spatial.

[] place link to source in legend entry. accessed by `layerData[i].source`

[] Pie legends - highlight category on segment hover; highlight segment on category hover.

[] Clean up legends. Make symbols smaller, make them more compact altogether.

[] Add some realtime data layer - fetch JSON from API.


## Shuke

[] Use categorical colors for categorical dimensions. Color ramp for quantitative / ordinal.

[] Adjust style of shipping density heatmap

[] Find a realtime data layer

## Haien

[] Purchase invisible-origins.com

[] create invisible-origins github account

## John

[] Add landing page

[] Can we quickly convert this to mobile? :eeee
  [] At breakpoint, convert to two stacked divs - map and content.
  [] Content scrolls "under" map (sort of ....)
  [] Drop map nav to anchor bottom

[] Set up scrolling animation function, or make it so you have to use the nav buttons to advance to the next card.
  [] If the top of the next card is less than halfway to the top of the viewport, and it is not the active card, switch to card.
  [] If the bottom of the previous card is less than halfway to the top of the viewport, and it is not the active card, switch to card.

[] Card-specific layer filtering architecture adaptation

[] Look at tooltip issues
  [] place above card;
  [] Fix fact that it doesn't pop up sometimes
  [] Smooth on mousemove.

[] Restructure cards to reflect recommendation of Dan?

[] Integrate sources into layers objects

[] Put feature content pie charts for British Air Traffic and British Port Traffic cards. (+ Shuke)


[] Define classes for cards, layers. Refactor to read from some data source and instantiate an object for each instance of the respective classes. This could clean up the data massively.
  [] How do define custom methods?

[] Implement on IPFS - suddenly it is a dApp! (ish)

[] Implement Explore mode for a layer or a few layers.

[] Copy edit all card content.

[] Functionalize addition of each html element. Does this deserve a class definition? Probably?

[] Implement some VR visualization?

### Additional things









## vvv Completed or deprecated vvv

[x] Add heatmap from QGIS

[x] Replace jpg bar charts with D3 bar charts

[x] Add tooltips to airports layer

[] Figure out scroll update card situation

[] Add units to pie chart hover labels

[x] Fix broken image in Port of London

[]

[] Add air traffic over UK

[] Add feature content to National cards
  [] Airports - passenger flows pie charts (Inwards + Outwards)
  [] Ports - what info?

[] Improve analysis in cards

[x-ish] Add country highlight on bar hover?

###############################################################################

[Kristian] - Spotted things to correct

(E) [x] Add value to d3 barchart on hover

[] Change layer by scrolling

[] Add d3 barChart for airport/port layer

[x] Missing tooltips on airport layer when hovering

[x] d3 piecharts for national layer

[x] d3 barchart for national layers

[x] d3 piecharts for local layer

(E) [x] Include the unit in the text (Global Air Transport(1000 tonnes)/Global sea transport (1000 TEUs))

(E) [x] Re-unit the categories in the global data set to billions

(E) [x] Re-unit the amounts in the UK airport data to 1000 tonnes from tonnes

###############################################################################

SHUKE

[] Finalize styling

[] Finish presentation

[] Write presentation notes

[?] Style ports:
- Harbor Size: Circle size
- Aggregated Harbor type: Color

[?] Style airports
- Harbor Size: Circle size
- Aggregated Harbor type: Color

[?] Fix coloring of airports

[x] Outline presentation

[x] Create presentation design



KRISTIAN

[x] K+J Legends loading looking good

[x] K Fix Heathrow center attribute

[x] K Add favicon

[x] K Implement D3 bar charts in cards
  [x] Set hover state opacity 0.7 - to show interactivity

[] K Add in-card bar charts for UK Ports and UK Air Transport cards.

[] J + K Add shipping density map

[x] K Pie chart value pop-up on click

[x] Merge / integrate legends

[] Add pie chart feature content update for UK largest ports and airports card

[-] Feature-content: On pie segment click display amount of category.

[] Maybe help with shipping density heatmap - tippecanoe etc.

[x] Build legends

[x] Add National Level card 1 layer

[x] Filter UK airport/port for national card one. (This will mean adding the filter in the loadCard() method I think)

[x] Extent legends to include multiple layers.

[] Add categorical dimensions to airports and ports datasets
  [x] UK (iso3)
  [] Busiest UK
  [] ??



JOHN

[x] J Merge country highlighting feature from highlightingCountries branch

[x*] J Change nav control to sticky top of cards
  [] Move github link to right of nav

[x] J Embed sound and video

[] J Set up layer add demo

[x] J Remove bottom margin-bottom

[x] J Increase 3d-buildings extrusion scaling factor

[x] Add back in heathrow stations


[-] Change to satellite-street on Tillbury-port-card

[x] On load map extent is not right.

[?] On airport/port fly-to ensure correct extent/center.

[] Add popup card for national airports and ports.

[] if time: add raster heatmap of shipping heatmap

[] Add layer filter toggle button to ports and airports

[] Add filter remove to each layer on card change

[x] Add favicon

[] Work out how to add and remove filters from layeres
  [] Toggle
  [] on card load



[-] Flip Heathrow background to satellite-streets

[-] Flip port background to satellite-streets

[x] Figure out map scale bar

[x] Figure out map control

[-] Build port flythrough tour

[x] Set up feature content functionality for Imports card.

[x] Update pie chart function definition

[x] Fix hover tooltip position and background

[x] Fix some positioning of text in feature content cards

[x] Make it so tooltips only show if not undefined ...

[x] Add fly-to in airport feature content.

[x] Change port tooltip to h5.

[x] Add Heathrow/Tilbury point-of-interest-tooltip





EVERYONE

[x] Load content into cards.

[x] Add card content - text

[] Add card content - images, videos, etc.


LATER

[] Create landing page

[] Create github, configure github pages

[] Buy and configure domain

[] Add roads and rails to UK national card







##
