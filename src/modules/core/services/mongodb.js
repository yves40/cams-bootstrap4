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
//----------------------------------------------------------------------------
const Version = "mongodb:1.27, Oct 12 2019 ";

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/test', {useNewUrlParser: true});

import properties from './properties';
import logger from './logger';

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
// Open mongo connection
//----------------------------------------------------------------------------
function getMongoDBConnection(traceflag = false) {
  if(traceflag) logger.debug(Version + 'Connect to : ' + properties.mongodbserver);
  try {
    mongoose.connect(properties.mongodbserver,{useNewUrlParser: true, keepAlive: false, useFindAndModify: false } )
    .then(function(MongooseObject) {
      if(traceflag) logger.info('Mongoose now ready [' + MongooseObject.connection.readyState + ']');
      return MongooseObject.connection;
    })
    .catch(function(reason) {
      logger.info(reason.message);
    });
  
    DB = mongoose.connection;
    // Set up handlers
    DB.on('error',function (err) {  
    if(traceflag) logger.error(Version + 'Mongoose error: ' + err);
    }); 
    DB.on('disconnected',function () {  
    if(traceflag) logger.debug(Version + 'Mongoose disconnected');
    }); 
    DB.on('connected',function () {  
    if(traceflag) logger.debug(Version + 'Mongoose connected');
    }); 
    return DB;
  }
  catch(error) {
    throw error;
  }
};
//----------------------------------------------------------------------------
// Close mongo connection
//----------------------------------------------------------------------------
function closeMongoDBConnection() {
  mongoose.disconnect();
};
//----------------------------------------------------------------------------
// Get mongodb server status, numeric format
//----------------------------------------------------------------------------
function getMongoDBStatus() {
  return DB.readyState;
};
//----------------------------------------------------------------------------
// Get mongo status in human readable format
//----------------------------------------------------------------------------
function getMongoDBStatusText() {
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
};
//----------------------------------------------------------------------------
// Get mongo runnable status
// TRUE if connected
//----------------------------------------------------------------------------
function getMongoDBFlag() {
  switch ( DB.readyState ) {
    case DISCONNECTED:
    case CONNECTING:
    case DISCONNECTING:
      return false;
      break;
    case CONNECTED:
      return true;
      break;
    default:
      return false;
  }
};
//----------------------------------------------------------------------------
// mongo is down ? 
// TRUE if disconnected
//----------------------------------------------------------------------------
function IsMongoDown() {
  switch ( DB.readyState ) {
    case DISCONNECTED:
    case CONNECTING:
    case DISCONNECTING:
      return true;
    case CONNECTED:
      return false;
    default:
      return false;
  }
};

export default {
    DISCONNECTED,
    CONNECTED,
    CONNECTING,
    DISCONNECTING, 
    getVersion,
    getMongoDBURI,
    getMongoDBConnection,
    closeMongoDBConnection,
    getMongoDBStatus,
    getMongoDBStatusText,
    IsMongoDown,
    getMongoDBFlag,
}
