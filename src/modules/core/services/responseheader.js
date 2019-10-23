/*----------------------------------------------------------------------------
    Oct 23 2019   Initial ; use express middleware to address CORS
                  The idea is to set attributes in the response header
----------------------------------------------------------------------------*/
const logger =  require('./logger');

const Version = 'responseheader.js:1.00, Oct 23 2019';

// Define the function installed by Express in server.js initialization

const responseheader = (req, res, next ) => {
  logger.debug(Version + 'setting necessary reponse headers');
  res.set('Access-Control-Allow-Origin', 'http://localhost:8080');
  res.set('Access-Control-Allow-Credentials', 'true');
  next();
};

module.exports = responseheader;

