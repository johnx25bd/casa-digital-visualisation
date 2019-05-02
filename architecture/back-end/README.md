# Back-end Requirements

The server will need to handle HTTP requests from clients requesting the site, and from browsers interacting with the site asynchronously requesting data to visualize. We will use NodeJS, "an asynchronous event driven JavaScript runtime" ([nodejs.org](https://nodejs.org/en/about/) 2019), to implement this logic.

## Server-side code

### Web Server

Node's Express ([expressjs.com](https://expressjs.com/) 2019) is a robust web application framework, allowing developers to write server-side code providing functionality ranging from simple web servers to sophisticated APIs. Express will enable easy extension of whatever data management systems are implemented in the MVP. For example, for datasets too large to send to the browser, Express combined with a MongoDB or SQL database on the server could ensure that only necessary data is transmitted over the connection and onto the client machine.

Additionally, Express middleware could enable users to trigger any operation from their browser. For example, if we provide data through our interface that requires preprocessing (see [Hillshade web app](https://github.com/robisoniv/ucl/tree/master/term1/GIS/final)), Express could handle input parameters and execute the algorithm necessary to generate the output, to be transmitted to the browser.

It is crucial to consider these extensions now, so architecture is developed in an extensible way.

### Server Database

#### Flat files

Most of our data, along with HTML, CSS and JS files, will be served from directories on the server, not requiring any database management system.

#### DBMS

We are considering implementing a server-side database to enable the querying and joining of data on the server, rather than in the browser, where it would affect app performance.

This app is designed to handle a diversity of data, making definition of a database schema inclusive of all data difficult. For this reason, we are leaning towards using a schema-less database management system with geospatial querying functionality like MongoDB ([MongoDB](https://www.mongodb.com/) 2019).

We expect this is beyond the scope of this effort, but will design architecture with the incorporation of this functionality in mind.

## Other Databases

Our visualization may use other services to host and serve data. Outsourcing this responsibility carries the drawback of relying on a constrained third party system for app functionality. The upside is that these third parties provide sophisticated software architectures to make storing and serving data simpler.

### OpenStreetMap

Raster basemap tiles may be loaded from OSM to provide a visual layer contextualizing custom geographic markers displayed on the map.

### Mapbox

To serve custom basemap tiles, possibly including vector tiles, Mapbox will be used to serve raster basemap tiles. The primary use case will be if a layer is too data intensive to directly use with D3 SVG. This hybrid approach offers us the opportunity to leverage benefits offered by all systems.

See [D3 + Leaflet](https://bost.ocks.org/mike/leaflet/) (Bostock 2012).

# Infrastructure, Software and Libraries

**Server**

A web server will need to be spun up, installed with NodeJS and MongoDB, and loaded with data and scripts. We will also need to configure the domain name and DNS, unless we opt to use github pages with no server-side logic beyond serving flat files.

**Software**

NodeJS, plus modules:
- Express
- mongoose
- d3
- turf - could do server-side geospatial operations

MongoDB

**Accounts**

OpenStreetMap API

Mapbox API
