/*----------------------------------------------------------------------------
    Sep 30 2019   Initial
    Oct 12 2019   Work starts for the new cams implementation
                  Trying to put all these packages together and
                  understand how it works! Attend the express training here : 
                  https://www.youtube.com/watch?v=L72fhGm1tfE&list=WL&index=18&t=0s
    Oct 15 2019   Work on PATHS and middleware chaining
    Oct 16 2019   training follow up
    Oct 22 2019   Initial Logger message
                  install cors
    Oct 23 2019   Initial log trace
                  Install a response header middleware
----------------------------------------------------------------------------*/
const mongoose = require('mongoose');
const express = require('express');
const path = require('path');

const logger =  require('./modules/core/services/logger');
const httplogger = require('./modules/core/services/httplogger');
const responseheader = require('./modules/core/services/responseheader');
const properties =  require('./modules/core/services/properties');
const corshelper = require('./modules/core/services/corshelper');
const cors = require('cors');

const Version = 'server.js:1.22, Oct 23 2019';

const app = express();
//---------------------------------------------------------------------------------------------------------
// Body parser middleware
app.use(express.json());
app.use(express.urlencoded( {extended: false}));

//---------------------------------------------------------------------------------------------------------
// Set a static folder containing html files
app.use(express.static(path.join(__dirname, 'public')));
//---------------------------------------------------------------------------------------------------------
// Add a second path for the root css file (main.css)
// The additional 1st parameter of app.use is the virtual path
// This path is just used by public/ static files to get the css file
app.use('/style', express.static(path.join(__dirname, 'css')));
//---------------------------------------------------------------------------------------------------------
// Test a simple middleware function tracking requests made on the server : see the httplogger.js source file
// The imported function is installed in the MW chain
app.use(httplogger);
//---------------------------------------------------------------------------------------------------------
// Install middleware responsible for response header settings
app.use(responseheader);
//---------------------------------------------------------------------------------------------------------
// Install the api testing middleware
app.use(require('./modules/core/noderouter/api'));
//---------------------------------------------------------------------------------------------------------
// Install the mongodb api middleware
app.use(require('./modules/core/noderouter/mongoapi'));
//---------------------------------------------------------------------------------------------------------
// get my logger
const logparams = logger.getLoggerInfo();
logger.info('***************************************************************');
logger.info('********************** RESTART ********************************');
logger.info('***************************************************************');
logger.info(Version);
logger.info('Logger version    : ' + logparams.version);
logger.info('Log level         : ' + logparams.loglevel);
//----------------------------------------------------------------------------
// Cross-Origin Resource Sharing
// https://github.com/expressjs/cors/blob/master/README.md
//----------------------------------------------------------------------------
logger.info("---------------------------------------------------------");
logger.info('CORS Security setting: webserver node');
logger.info("---------------------------------------------------------");
logger.info('Site : ' + properties.corsclientorigin);
app.use(cors(corshelper.getCORS()));

// Let's start the server
app.listen(properties.nodeserverport, ()=>{
  logger.debug('nodejs now listening on port ' + properties.nodeserverport);
});

