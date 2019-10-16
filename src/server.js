/*----------------------------------------------------------------------------
    Sep 30 2019   Initial
    Oct 12 2019   Work starts for the new cams implementation
                  Trying to put all these packages together and
                  understand how it works! Attend the express training here : 
                  https://www.youtube.com/watch?v=L72fhGm1tfE&list=WL&index=18&t=0s
    Oct 15 2019   Work on PATHS and middleware chaining
    Oct 16 2019   training follow up
----------------------------------------------------------------------------*/
const mongoose = require('mongoose');
const express = require('express');
const path = require('path');

const logger =  require('./modules/core/services/logger');
const httplogger = require('./modules/core/services/httplogger');
const properties =  require('./modules/core/services/properties');

const Version = 'server.js:1.14, Oct 16 2019';

const app = express();
// Body parser middleware
app.use(express.json());
app.use(express.urlencoded( {extended: false}));

// Set a static folder containing html files
app.use(express.static(path.join(__dirname, 'public')));

// Add a second path for the root css file (main.css)
// The additional 1st parameter of app.use is the virtual path
// This path is just used by public/ static files to get the css file
app.use('/style', express.static(path.join(__dirname, 'css')));

// Test a simple middleware function tracking requests made on the server : see the httplogger.js source file
// The imported function is installed in the MW chain
app.use(httplogger);

// Install the api testing middleware
app.use('/api', require('./modules/core/noderouter/api'));

// get my logger
console.log('\n\n');
const logparams = logger.getLoggerInfo();
logger.info('Logger version    : ' + logparams.version);
logger.info('Log level         : ' + logparams.loglevel);

// Let's start the server
app.listen(properties.nodeserverport, ()=>{
  logger.info(Version);
  logger.debug('API listening on port ' + properties.nodeserverport);
});

