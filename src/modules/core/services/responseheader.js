/*----------------------------------------------------------------------------
    Oct 23 2019   Initial ; use express middleware to address CORS
                  The idea is to set attributes in the response header
----------------------------------------------------------------------------*/
const logger =  require('./logger');
const corsclientorigin = require('./properties').corsclientorigin;

const Version = 'responseheader.js:1.02, Oct 23 2019 ';

// Define the function installed by Express in server.js initialization

const responseheader = (req, res, next ) => {
  logger.debug(Version + 'setting necessary reponse headers');
  res.set('Access-Control-Allow-Origin', corsclientorigin);   // Set the client address for the server
                                                              // to inform the client browser that he will 
                                                              // accept requests from him
  res.set('Access-Control-Allow-Credentials', 'true');
  next();
};

module.exports = responseheader;

