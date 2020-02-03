//----------------------------------------------------------------------------
//    mongodb.js
//
//    Mar 01 2019   Initial
//    Mar 05 2019   Monitor mongo connection status with DB.on()
//                  Add mongodown test routine
//    Mar 06 2019   Code Cleanup
//    Mar 25 2019   Test new connection method
//    Mar 30 2019   Remove some log message
//    Apr 26 2019   Add a variable for the mongodb server location
//    Oct 11 2019   Get service in cams-bootstrap4 project
//    Oct 12 2019   Small bugs after migration
//    Oct 16 2019   import replaced by require because of node
//    Oct 20 2019   Double request to mongoose connect, don't know why.
//                  Fix warning message on connect with useUnifiedTopology: true
//                  Look here : https://mongoosejs.com/docs/deprecations.html
//    Oct 22 2019   Change some log messages and set mongoose options
//    Oct 24 2019   Checking mongo status, return boolean
//                  Simplify !!
//    Jan 14 2020   WIP on multiple deployment hosts for mongodbserver 
//    Jan 15 2020   Test mongoose connection poolSize parameter
//                  No effect on number of opened connections by connect()
//    Jan 25 2020   Change mongo connection message
//    Feb 01 2020   Mongodb connection management.
//    Feb 02 2020   Mongodb connection management..
//    Feb 03 2020   Mongodb connection management...
//----------------------------------------------------------------------------
const Version = "mongodb:1.82, Feb 03 2020 ";

const mongoose = require('mongoose');
const domain = require('domain');

const properties = require('./properties');
const logger = require('./logger');

//----------------------------------------------------------------------------
// Const variables
//----------------------------------------------------------------------------
const DISCONNECTED = 0;
const CONNECTED = 1;
const CONNECTING = 2;
const DISCONNECTING = 3; 
//----------------------------------------------------------------------------
// Globals
//----------------------------------------------------------------------------
let DB = null;
//----------------------------------------------------------------------------
// Version
//----------------------------------------------------------------------------
function getVersion() {
  return Version;
}
//----------------------------------------------------------------------------
// Where's mongo server ?
//----------------------------------------------------------------------------
function getMongoDBURI() {
    return properties.mongodbserver;
};

//----------------------------------------------------------------------------
// Using a domain to handle errors and uncaughtException 
// Interesting article here : https://shapeshed.com/uncaught-exceptions-in-node/
// Domains are an experimental feature added in Node 0.8 to make handling 
// exceptions more flexible and more sophisticated.
//----------------------------------------------------------------------------
let mongodomain = domain.create();
mongodomain.on('error', function (err) {
  logger.error('Got a problem with mongo : ' + err.message + ' ==== ' + err.name);
})

//----------------------------------------------------------------------------
// Open mongo connection
//----------------------------------------------------------------------------
function getMongoDBConnection(traceflag = properties.MONGOTRACE) {
  mongodomain.run( () => {
    if (DB !== null) return DB;

    const nodename = process.env.COMPUTERNAME;
    let urlconn = properties.mongodbserver;   // Default mongodb connection string
    for (let i=0; i < properties.mongolist.length; ++i) {
      if (properties.mongolist[i].node === nodename) {
        urlconn = properties.mongolist[i].url;
        break;
      }
    }
    logger.debug(Version + 'Connect to : ' + urlconn + ' from node ' + nodename);
    mongoose.connect(urlconn,{
      useNewUrlParser: true, 
      keepAlive: false, 
      useFindAndModify: false,
      useCreateIndex: true,
      useUnifiedTopology: true,
      poolSize: 10,       // This is a maximum. Not used immediately
      /*  Inoperant
      reconnectTries: 1,
      reconnectInterval: 1000, // Reconnect every sec
      connectTimeoutMS: 2000, // Give up initial connection after 2 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      */
    })
    .then( () =>  {
        if(traceflag) logger.debug(Version + 'Mongoose connection OK' );
        DB = mongoose.connection; 
        // -----------------------------------------------------------------------------
        // Set up handlers
        // -----------------------------------------------------------------------------
        DB.on('error',function (err) {  
          if(traceflag) logger.error(Version + 'Mongoose error: ' + err);
        }); 
        DB.on('disconnected',function () {  
          if(traceflag) logger.debug(Version + 'Mongoose disconnected');
        }); 
        DB.on('connected',function () {  
          if(traceflag) logger.debug(Version + 'Mongoose connected');
        });
        DB.on('reconnected', () => {
          if(traceflag) logger.debug(Version + 'Mongoose reconnected');
        })
        return DB;
      },
      err => {
        logger.error(Version + err.message.split('at ')[0]);
      })
      .catch( err => {
        console.error(JSON.stringify(err));
      }) 
  });
    
  }

//----------------------------------------------------------------------------
// Close mongo connection
//----------------------------------------------------------------------------
function closeMongoDBConnection() {
  mongoose.disconnect()
  .then( () => {
    logger.debug('Disconnected');
  })
  .catch( () => {
    logger.debug('Problem during disconnection');
  })
};
//----------------------------------------------------------------------------
// Get mongodb server status, numeric format
//----------------------------------------------------------------------------
function getMongoDBStatus() {
  if (!DB) {
    getMongoDBConnection();
  }
  return DB.readyState;
};
//----------------------------------------------------------------------------
// Get mongo status in human readable format
//----------------------------------------------------------------------------
function getMongoDBStatusText() {
  if (!DB) {
    getMongoDBConnection();
  }
  else {
    switch ( DB.readyState ) {
      case DISCONNECTED:
        return('Disconnected');
      case CONNECTED:
        return( 'Connected');
      case CONNECTING:
        return( 'Connecting');
      case DISCONNECTING:
        return( 'Disconnecting');
      default: return('Unknown')
    }
  }
  return('Unknown');
};
//----------------------------------------------------------------------------
// Get mongo runnable status
// TRUE if connected
//----------------------------------------------------------------------------
function getMongoDBFlag() {
  if (!DB) {
    getMongoDBConnection();
  }
  else {
    switch ( DB.readyState ) {
      case DISCONNECTED:
      case CONNECTING:
      case DISCONNECTING:
        return false;
      case CONNECTED:
        return true;
      default:
        return false;
    }
  }
  return false;
};
//----------------------------------------------------------------------------
// mongo is down ? 
// TRUE if disconnected
//----------------------------------------------------------------------------
function IsMongoDown() {
  if (DB !== null) {
    switch ( DB.readyState ) {
      case DISCONNECTED:
      case CONNECTING:
      case DISCONNECTING:
        return true;
      case CONNECTED:
        return false;
      default:
        return true;
    }
  }
  return true; // Status unknown, something is wrong
};

module.exports =  {
    DISCONNECTED: DISCONNECTED,
    CONNECTED: CONNECTED,
    CONNECTING: CONNECTING,
    DISCONNECTING: DISCONNECTING, 
    getVersion: getVersion,
    getMongoDBURI: getMongoDBURI,
    getMongoDBConnection: getMongoDBConnection,
    closeMongoDBConnection: closeMongoDBConnection,
    getMongoDBStatus: getMongoDBStatus,
    getMongoDBStatusText: getMongoDBStatusText,
    IsMongoDown: IsMongoDown,
    getMongoDBFlag: getMongoDBFlag,
}
