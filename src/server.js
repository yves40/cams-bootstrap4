/*  
    Sep 30 2019   Initial
    Oct 12 2019   Work starts for the new cams implementation
                  Trying to put all these packages together and
                  understand how it works!
*/
const bodyParser  = require('body-parser');
const mongoose = require('mongoose');
const express = require('express');

logger =  require('./modules/core/services/logger');
properties =  require('./modules/core/services/properties');

const Version = 'server.js:1.02, Oct 12 2019';

var app = express();

app.get('/api', (req, res) => {
  res.json({message: 'Welcome to the Server Yves, check me'});
  logger.debug('/api served');
});
app.get('/test', (req, res) => {
  res.json({message: 'API test'});
  logger.debug('/test served');
});
app.listen(properties.nodeserverport, ()=>{
  logger.debug(Version);
  logger.debug('API listening on port ' + properties.nodeserverport);
});

