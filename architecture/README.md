# Architecture

Outlining the software architecture of the CASA0003 Digital Visualisation group project.

## Vision

A performant web application to load and visualize appropriate content at the appropriate time.

### Requirements

#### Front End

The browser will render and display a front end interface with a base raster map, overlaid raster and vector features, divs to contain content and menus, and controls to navigate the experience.

As the user interacts, data with information about different layers is fetched from the server at appropriate times. (Or, all is loaded upon page load. Depends on how much data we have.)

The user can view the interface in Explore mode or Story mode. The primary difference is that Story mode provides controls for the uses to step through a curated narrative, while Explore mode allows the user to click and zoom around the interface as they please.

[Detailed front end requirements](./front-end)

#### Back End

##### Server

Server-side code will handle HTTP requests from the browser.

We are unsure of the necessary complexity of this code. With larger datasets, more robust server-side querying systems will be required since the client won't be able to store all necessary data. It would be best to develop this now rather than deferring it, but as our focus is on the visualization, we would rather place our efforts there.

##### Databases

We may use third party services to outsource the warehousing and querying of spatial data, especially raster tiles and large-scale vector (i.e. point) datasets.

[Detailed back end requirements](./back-end)
