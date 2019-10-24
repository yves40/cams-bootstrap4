//----------------------------------------------------------------------------
//    properties.js
//
//    Oct 11 2019   Initial
//    Oct 12 2019   Add node server port
//    Oct 15 2019   Debug level and ports
//    Oct 16 2019   Getter for loglevel info
//                  mongodb URL set to local host
//    Oct 22 2019   Axios URL prefix
//    Oct 23 2019   Wrong nodeserver URL
//    Oct 24 2019   Centralize mongodb checking delay
//----------------------------------------------------------------------------
const Version = 'properties:1.15, Oct 24 2019';

const logger = require('./logger');
// The webpack dev server
const webserver = process.env.WEBSERVER || "http://localhost:8080";
const webserverport = process.env.WEBSERVERPORT || 8080;
// const mongodbserver =  process.env.MONGOSERVER || 'mongodb://vboxweb:4100/cams';
const mongodbserver =  process.env.MONGOSERVER || 'mongodb://localhost:27017/admin';
const nodeserverport = process.env.NODESERVERPORT || 8081;
// The node server
const nodeserver =  process.env.NODESERVER || 'http://localhost:8081';
// CORS site list to enable cross server requests
const corsclientorigin = 'http://localhost:8080';  
// Mongo DB check delay (ms)
const MONGODELAYCHECK = 5000;

const loggerlevel = logger.DEBUG;

module.exports = {
    webserver: webserver,
    webserverport: webserverport,
    mongodbserver: mongodbserver,
    nodeserverport: nodeserverport,
    loggerlevel: loggerlevel,
    nodeserver: nodeserver,
    corsclientorigin: corsclientorigin,
    MONGODELAYCHECK: MONGODELAYCHECK,
}
