/*----------------------------------------------------------------------------
    Sep 30 2019   Initial
    Oct 12 2019   Work starts for the new cams implementation
                  Trying to put all these packages together and
                  understand how it works! Attend the express training here : 
                  https://www.youtube.com/watch?v=L72fhGm1tfE&list=WL&index=18&t=0s
    Oct 15 2019   Work on PATHS and middleware chaining
    Oct 16 2019   training follow up
----------------------------------------------------------------------------*/
const bodyParser  = require('body-parser');
const mongoose = require('mongoose');
const express = require('express');
const path = require('path');

const logger =  require('./modules/core/services/logger');
const httplogger = require('./modules/core/services/httplogger');
const properties =  require('./modules/core/services/properties');

const Version = 'server.js:1.12, Oct 16 2019';

const app = express();

// Set a static folder containing html files
app.use(express.static(path.join(__dirname, 'public')));
// Add a second path for the root css file (main.css)
// The additional 1st parameter of app.use is the virtual path
app.use('/style', express.static(path.join(__dirname, 'css')));

// Test a simple middleware function tracking requests made on the server : see the httplogger.js source file
// The imported function is installed in the MW chain
app.use(httplogger);

// Few dummy routes APIs tests
app.get('/api', (req, res) => {
  res.json({message: 'Welcome to the Server Yves, check me'});
  logger.debug('/api served');
});
app.get('/test', (req, res) => {
  res.json({message: 'API test'});
  logger.debug('/test served');
});

// Let's start the server
app.listen(properties.nodeserverport, ()=>{
  console.log('\n\n');
  const logparams = logger.getLoggerInfo();
  console.log('Logger version    : ' + logparams.version);
  console.log('Log level         : ' + logparams.loglevel);
  console.log('\n\n');

  logger.info(Version);
  logger.debug('API listening on port ' + properties.nodeserverport);
});

