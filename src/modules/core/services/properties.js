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
//    Oct 25 2019   Define logger levels here.
//    Oct 28 2019   Start using the mongo cams schema.
//    Oct 29 2019   Add a user / password for later use with mongo.
//                  Start work on JWT
//    Nov 03 2019   Axios
//    Nov 05 2019   Shorten the mongo monitoring delay
//                  Parameter for the timer in corestore
//    Nov 13 2019   No trace for mongo
//    Nov 29 2019   Timer to 1sec : Externalize session duration time
//    Dec 03 2019   Variable to define alert delay before killing the session
//    Dec 05 2019   Test session expiration 
//    Dec 08 2019   Reset session expiration time
//    Dec 11 2019   Query on mongolog : lines limit parameter
//    Dec 12 2019   session expiration in debug mode (shorter)
//    Dec 20 2019   session expiration in debug mode (longer)
//----------------------------------------------------------------------------
const Version = 'properties:1.39, Dec 20 2019';

const axios = require('axios');

// Core timer used to display the hour in the bottom bar
const COREDELAY = 1000;
// The webpack dev server
const webserver = process.env.WEBSERVER || "http://localhost:8080";
const webserverport = process.env.WEBSERVERPORT || 8080;
// const mongodbserver =  process.env.MONGOSERVER || 'mongodb://vboxweb:4100/cams';
const mongodbserver =  process.env.MONGOSERVER || 'mongodb://localhost:27017/cams';
// The node server
const nodeserver =  process.env.NODESERVER || 'http://localhost:8081';
const nodeserverport = process.env.NODESERVERPORT || 8081;
// CORS site enabled for cross server requests
// The web app on 8080 calls the node services on 8081
const corsclientorigin = 'http://localhost:8080';  
// Mongo DB params
const MONGODELAYCHECK = 1000;
const MONGOTRACE = false;
const MONGOUP = 1;
const MONGODOWN = 0;
const MONGOUSER = process.env.MONGOUSER ||'yves';
const MONGOPASSWORD = process.env.MONGOPASSWORD || 'manager1';
// Trace HTTP calls to express
const httptrace = false;
// Define the logger level
const DEBUG = 0;
const INFORMATIONAL = 1;
const WARNING = 2;
const ERROR = 3;
const FATAL = 4;
const loggerlevel = DEBUG;  // This one sets the tracing level of the app
// JWT stuff
const jwtconfig = {  
    jwtSecret: process.env.NODESECRET || 'thisisthesecretkey' ,
    jwtSession: {session: false},
};
// Some axios params
const axioscall = axios.create({
    baseURL: nodeserver,
    timeout: 5000,
    withCredentials: true,
  });  
// User session duration in seconds
const tokenexpirationdelay = 120;
const tokenexpirationalert = 20;    // Display a message in menu to inform user session is soon expired
// Mongolog : default lines limit for returned data
const MONGOLOGLINESLIMIT = 20;

module.exports = {
    webserver: webserver,
    webserverport: webserverport,
    mongodbserver: mongodbserver,
    nodeserverport: nodeserverport,
    loggerlevel: loggerlevel,
    nodeserver: nodeserver,
    corsclientorigin: corsclientorigin,
    COREDELAY,
    MONGODELAYCHECK: MONGODELAYCHECK,
    MONGOTRACE: MONGOTRACE,
    httptrace: httptrace,
    DEBUG,
    INFORMATIONAL,
    WARNING,
    ERROR,
    FATAL,
    MONGOUP,
    MONGODOWN,
    MONGOUSER,
    MONGOPASSWORD,
    MONGOLOGLINESLIMIT,
    jwtconfig,
    tokenexpirationdelay,
    tokenexpirationalert,
    axioscall,
}
