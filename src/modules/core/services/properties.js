//----------------------------------------------------------------------------
//    properties.js
//
//    Oct 11 2019   Initial
//    Oct 12 2019   Add node server port
//----------------------------------------------------------------------------
const Version = 'properties:1.02, Oct 12 2019';

const devserver = process.env.WEBDEVSERVER || "http://localhost:8080";
const mongodbserver =  process.env.MONGOSERVER || 'mongodb://vboxweb:4100/cams';
const nodeserverport = 8081;

module.exports = {
    devserver: devserver,
    mongodbserver: mongodbserver,
    nodeserverport: nodeserverport,
}
