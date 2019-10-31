/*----------------------------------------------------------------------------
    Oct 23 2019   Initial ; use express middleware to address CORS
                  The idea is to set attributes in the response header
    Oct 31 2019   Manage "equest header field authorization is not allowed by Access-Control-Allow-Headers in preflight response" error
----------------------------------------------------------------------------*/
const logger =  require('./logger');
const corsclientorigin = require('./properties').corsclientorigin;
const corshelper = require('./corshelper');

const Version = 'responseheader.js:1.04, Oct 31 2019 ';

// Define the function installed by Express in server.js initialization

const responseheader = (req, res, next ) => {
  res.set('Access-Control-Allow-Origin', corsclientorigin);   // Set the client address for the server
                                                              // to inform the client browser that he will 
                                                              // accept requests from him : can only specify one URI
  res.set('Access-Control-Allow-Credentials', 'true');
  res.set('Access-Control-Allow-Headers', corshelper.getCORS().allowedHeaders);
  next();
};

module.exports = responseheader;

