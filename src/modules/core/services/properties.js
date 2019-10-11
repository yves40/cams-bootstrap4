//----------------------------------------------------------------------------
//    properties.js
//
//    Oct 11 2019   Initial
//----------------------------------------------------------------------------
const Version = 'properties:1.00, Oct 11 2019';

const devserver = process.env.WEBDEVSERVER || "http://localhost:8080";
const mongodbserver =  process.env.MONGOSERVER || 'mongodb://vboxweb:4100/cams';

export default {
    devserver,
    mongodbserver,
}
