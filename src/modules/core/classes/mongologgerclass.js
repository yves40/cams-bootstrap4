//----------------------------------------------------------------------------
//    mongologgerclass.js
//
//    Mar 24 2019   Initial
//    Mar 25 2019   WIP on methods
//    Mar 27 2019   Playing with async & Promise...
//    Nov 27 2019   Get service in cams-bootstrap4 project
//----------------------------------------------------------------------------
"use strict"
const MongoLogModel = require('../model/mongoLogModel');
const mongo = require ('../services/mongodb');
const logger = require ('../services/logger');

//----------------------------------------------------------------------------
// The class 
//----------------------------------------------------------------------------
module.exports = class mongologger {
  constructor (modulename) {
      this.Version = 'mongologgerclass:1.25, Nov 27 2019 ';
      this.DEBUG = 0;
      this.INFORMATIONAL = 1;
      this.WARNING = 2;
      this.ERROR = 3;
      this.FATAL = 4;
      this.modulename = modulename;   // Used to track the calling component
      this._DB = mongo.getMongoDBConnection();
  };
  //----------------------------------------------------------------------------
  async log(message, severity = this.DEBUG) {
    message = '[' + this.levelToString(severity) + '] ' + message;
    let themessage = new MongoLogModel( { module: this.modulename,
                                    message: message, 
                                    timestamp: Date.now(),
                                    severity: severity, });
    await themessage.save().then( value => {
        // logger.debug(this.Version + themessage.message + ' : ----------------- Saved');
        return;
    })
    .catch( value => {
      logger.error(themessage.message + ' : -----------------  Not Saved !!!!!!!!!!!!!');
    }); 
  };
  //----------------------------------------------------------------------------
  debug(message) {this.log(message, this.DEBUG);};
  informational(message) {this.log(message, this.INFORMATIONAL);};
  warning(message) {this.log(message, this.WARNING);};
  fatal(message) {this.log(message, this.FATAL);};
  error(message) {this.log(message, this.ERROR);};
  //----------------------------------------------------------------------------
  levelToString(level) {
    switch (level) {
        case this.DEBUG: return 'DBG';
        case this.INFORMATIONAL: return 'INF';
        case this.WARNING: return 'WRN';
        case this.ERROR: return 'ERR';
        case this.FATAL: return 'FTL';
        default: return 'FTL';
    }
  };  
  //----------------------------------------------------------------------------
  getVersion() {
    return this.Version;
  };
};
