# Front End Requirements

## Map

The map will display and visualize appropriate layers at appropriate extents and zoom levels.

Geographic features will often be interactive (highlight, tooltips) and linked to elements in the Info area.

In addition to this display and content filtering architecture, Views will snap to a defined extent, zoom level and layer configuration, and will likely load content in the Info tab providing context to the View.

**Data Sources**

All data sources will be linked to, perhaps accessed via a small info icon present in the footer or header.

### Components

Each feature visualized generates two linked components: the geographic marker and the content pane. These are linked such that hovering on one highlights the other and clicking on one scrolls / zooms to the other.

#### Basemap

A raster basemap provides context. This will likely be loaded from Mapbox or another raster tile conten provider.

#### Geographic markers

 Geographic markers on the map will represent point, linestring and / or polygon features. Each feature can be interactive and potentially trigger a tooltip, though this will be reserved for basic, easy to access data.

 **Timeline**

 Some way to animate a time series, which appears when appropriate.

 **Legend**

 An area dedicated to displaying symbology and color ramps etc

 **Scale bars**

## Info

The Info section will display cards and content components relevant to the current map view. This will be a scrollable list of all features present on the interface, allowing users to read through content.

### Components

#### Cards  

Cards are placed at the top of the Info pane. Each map view will have one card maximum, and most map views will not have a card. Cards provide context and explanation of the map view at hand, and will allow users to step through a story in a curated fashion.

We anticipate each scale (Global, National and Local) to have 4 - 8 cards highlighting different interesting insights, to tell each story. Users will be able to step through cards, watching the map extent, zoom and layers update.

Cards can include any content, but will tend to focus on aggregated displays of the features included in that View.  

#### Content panes

Each element visualized in the map area (i.e. Geographic markers) will have a linked content pane containing further information about the feature. These panes can contain any content. They will be linked with the geographic markers in that highlighting one will highlight the other and clicking on one will scroll or zoom to the other, to establish the connection the the user's mind.

For this iteration we will decide on a few example content types to visualize in the panes, including possibly:

- Text
- Numbers
- Bar chart
- Pie chart
- Ranking plots
- Images
- Video?

These will map 1:1 with observations visualized on the map. Aggregated content (like a scatter plot) would be visualized in a card.

**Sorting**

The order of these observation content panes will convey much of the meaning. Offering users the option to sort in different ways could provide additional insight, though may not be feasible this iteration of the architecture. This may not be interactive  in this version of the app.

**Filtering**

Some filter at the top of the list of Content Panes would allow users to only view relevant content to what they are investigating. This is probably beyond the scope of this iteration, but would be a powerful feature to implement in the future.

This feature could be integrated with AJAX requests containing query criteria to be transmitted to the server. This would improve performance for visualizations of datasets too large to load into the browser.


## Menus

### Header

The header will contain information about the visualization, as well as access to info about the designers, the open source code base etc.

This feature may not be implemented in a dynamic fashion in this application.

### Footer

The footer will provide additional links to information about the app and its creators.


# Libraries and Frameworks

Bootstrap

jQuery
- DOM manipulation
- AJAX? or use `d3.fetch` or `d3.request` ...

D3.js
- `fetch`
- `queue`
- `geo`
- event listeners
- what other modules? Functionalize creation of interactive elements such as charts ...

Leaflet

Mapbox

**Questions**:

Is it best practice to use one library across the site, or should I use D3 in the map and jQuery in the other HTML elements? My intuition is to commit to one library for all event handlers, for example ...

**Considerations**

This visualization will not be developed for mobile browsers. We will try to leave opportunity to simply adapt the layout, preserving the underlying logic to be executed in the mobile context.

This iteration of the app will be developed for Mozilla Firefox. Legacy browsers will not be supported.
