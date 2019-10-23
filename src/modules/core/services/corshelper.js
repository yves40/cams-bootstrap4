//----------------------------------------------------------------------------
//    corshelper.js
//
//    Feb 01 2019   Initial, from myenv.js
//    Feb 08 2019   Add jwt as an allowed header
//    Mar 06 2019   console.log replaced by logger
//    Oct 22 2019   Project cams-bootstrap
//    Oct 23 2019   Blocked by CORS, once again ;-(
//----------------------------------------------------------------------------
const Version = "corshelper:1.20, Oct 23 2019 ";

const logger = require('./logger');
const properties = require('./properties');

const whitelist = require('./properties').whitelist;
logger.debug('Got the white list for CORS');
logger.debug(whitelist);
function checkOrigin(origin, callback) {
  // console.log(Version + (origin === undefined ? 'Local node': origin) + ' CORS check');
  if (origin === undefined) { // Do not want to block REST tools or server-to-server requests
    callback(null, true);
  }
  else { // origin is specified
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      logger.error(Version + (origin === null ? 'Local node': origin) + ' not allowed by CORS');
      callback(new Error('Not allowed by CORS'));
    }
  }
}

const corsOptions = {
  'origin': checkOrigin,
  'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
  'preflightContinue': false,
  'optionsSuccessStatus': 204,
  'credentials': true,
  'allowedHeaders': ['Content-Type', 'Authorization', 'jwt'],
};

function getCORS() {
  return corsOptions;
};

function getCORSwhitelist() {
  return whitelist;
};

module.exports = {
  getCORS: getCORS,
  getCORSwhitelist: getCORSwhitelist,
}

