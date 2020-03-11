//----------------------------------------------------------------------------
//    corshelper.js
//
//    Feb 01 2019   Initial, from myenv.js
//    Feb 08 2019   Add jwt as an allowed header
//    Mar 06 2019   console.log replaced by logger
//    Oct 22 2019   Project cams-bootstrap
//    Oct 23 2019   Blocked by CORS, once again ;-(
//                  Problem fixed by adding a response handler in express 
//                  middleware. Look at responseheader.js
//                  useful URL: https://github.com/expressjs/cors/blob/master/README.md
//    Nov 20 2019   No jwt in header here
//    Feb 26 2020   vboxnode deployment, change a few things about CORS and
//                  corsclientorigin
//    Mar 09 2020   zerasp deployment
//----------------------------------------------------------------------------
const Version = "corshelper:1.27, Mar 09 2020 ";


// CORS sites enabled for cross server requests
// This list gives one valid client per nodejs running node
const origindef = 'http://localhost:8080';
const corsclients = [
  { node: 'zerasp', origin: 'http://zerasp:8088' },
  { node: 'vboxnode', origin: 'http://vboxnode:8088' },
  { node: 'ASUSP4', origin: 'http://localhost:8080' },
  { node: 'ASUSP7', origin: 'http://localhost:8080' },
];

const logger = require('./logger');

function getClientSite() {
  let origin = origindef; // In case no match is found
  const nodename = process.env.COMPUTERNAME;
  for (let i=0; i < corsclients.length; ++i) {
    if (corsclients[i].node === nodename) {
      origin = corsclients[i].origin;
      break;
    }
  }
  // logger.debug(Version + 'origin identified as ' + origin + ' for node ' +  nodename) ;
  return origin;
}

function checkOrigin(origin, callback) {
  logger.debug(Version + (origin === undefined ? 'Local node': origin) + ' CORS check');
  if (origin === undefined) { // Do not want to block REST tools or server-to-server requests
    callback(null, true);
  }
  else { // origin is specified
    if (getClientSite() === origin) {
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
  'allowedHeaders': ['Content-Type', 'Authorization'],
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
  getClientSite: getClientSite,
}

