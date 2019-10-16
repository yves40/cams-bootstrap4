//----------------------------------------------------------------------------
//    properties.js
//
//    Oct 11 2019   Initial
//    Oct 12 2019   Add node server port
//    Oct 15 2019   Debug level and ports
//    Oct 16 2019   Getter for loglevel info
//----------------------------------------------------------------------------
const Version = 'properties:1.09, Oct 16 2019';

const logger = require('./logger');

const devserver = process.env.WEBDEVSERVER || "http://localhost:8080";
const webserverport = process.env.WEBSERVERPORT || 8080;
const mongodbserver =  process.env.MONGOSERVER || 'mongodb://vboxweb:4100/cams';
const nodeserverport = process.env.NODESERVERPORT || 8081;
const loggerlevel = 1;

module.exports = {
    devserver: devserver,
    webserverport: webserverport,
    mongodbserver: mongodbserver,
    nodeserverport: nodeserverport,
    loggerlevel: loggerlevel,
}
