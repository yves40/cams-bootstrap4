//----------------------------------------------------------------------------
//    logger.js
//
//    Mar 05 2019   Initial (Toulouse ENAC)
//    Mar 06 2019   Add log level to the trace
//    Mar 08 2019   test a call from App.vue
//                  Also check that tracing to a file is only possible if not 
//                  requested from a browser
//    Mar 13 2019   Check LOGMODE and LOGFILE variables works
//                  Modify file output logic
//    Mar 14 2019   use helper for dates
//    Apr 03 2019   Test for error : Cannot read property of undefined
//    Oct 04 2019   Pushed in the MEVNTemplate project
//    Oct 09 2019   Use the datetime service
//    Oct 11 2019   export default
//    Oct 12 2019   Change import to require for node
//                  export default is also a problem
//    Oct 16 2019   Report log level on 1st call
//    Oct 25 2019   Move logger level definitions into properties
//----------------------------------------------------------------------------
const Version = 'logger:1.48, Oct 25 2019';

const datetime = require('./datetime'); 
const properties = require('./properties'); 

let fs = require('fs'); 

//----------------------------------------------------------------------------
// Globals
//----------------------------------------------------------------------------
let logs = [];
let tracetofileflag = false;
let tracetoconsoleflag = true;
let OUTFILE = process.env.LOGFILE || '/tmp/' + Version.replace(/[,:]/g,'_').replace(/ /g, '_') + '.log'
//----------------------------------------------------------------------------
// Constants
//----------------------------------------------------------------------------
const DEBUG = parseInt(properties.DEBUG);
const INFORMATIONAL = parseInt(properties.INFORMATIONAL);
const WARNING = parseInt(properties.WARNING);
const ERROR = parseInt(properties.ERROR);
const FATAL = parseInt(properties.FATAL);
const LOGGERLEVEL = parseInt(properties.loggerlevel || process.env.LOGGERLEVEL || DEBUG);

const MAXLOGS = 10;
//----------------------------------------------------------------------------
// ENV shell variable LOGFILE defines log destination 
// If LOGFILE is defined, it automatically turns the logger to file output, 
// except if used in a browser
//----------------------------------------------------------------------------
// LOCAL FUNCTIONS
// Get a readable log level
//----------------------------------------------------------------------------
function levelToString(level = DEBUGLEVEL) {
    switch (level) {
        case DEBUG: return 'DBG';
        case INFORMATIONAL: return 'INF';
        case WARNING: return 'WRN';
        case ERROR: return 'ERR';
        case FATAL: return 'FTL';
        default: return 'FTL';
    }
}
//----------------------------------------------------------------------------
// The logger 
// syncmode set to TRUE if waiting for the I/O to complete
//----------------------------------------------------------------------------
function log(mess, level, syncmode = false) {
    if (level >= LOGGERLEVEL) {
        let d = new Date();
        if (logs.length === MAXLOGS) {
            logs.shift();                   // Handle the log buffer
        }
        let logstring = datetime.getDateTime()
                + ' [' + levelToString(level) + '] '
                + ' ' + mess ;
       logs.push( logstring);
        let display = null;
        // Is the module called from a browser or from a standalone script ? 
        if (typeof window === 'undefined') {
            display = console;
        }
        else {
             display = window.console;
        }
        if (tracetoconsoleflag)
            display.log(logstring);
        // trace to a file ? ( only if not called from a browser )
        if (tracetofileflag && (typeof window === 'undefined') ) {
            if (syncmode) 
                fs.appendFileSync(OUTFILE,logstring + '\n', 'utf8', function(err) {
                    if (err) {
                        throw 'Error opening the trace file. Set LOGFILE environment variable to the desired location';
                    }
                });
            else {
                fs.appendFile(OUTFILE,logstring + '\n', 'utf8', function(err) {
                    if (err) {
                        throw 'Error opening the trace file. Set LOGFILE environment variable to the desired location';
                    }
                });
            }
        }
    return;
    }
}
//----------------------------------------------------------------------------
// PUBLIC FUNCTIONS
//----------------------------------------------------------------------------
// Logger infos
// Returns an object with logger data
//-----------------------------------------------------
function getLoggerInfo() {
    loggerinfo = {};
    loggerinfo.version = Version;
    loggerinfo.loglevel = LOGGERLEVEL;

    if (process.env.LOGFILE) {
        loggerinfo.logfiledefiner = 'Shell defined';
    }
    else {
        loggerinfo.logfiledefiner = 'Program defined';
    }
    loggerinfo.logfile = OUTFILE;
    if (tracetoconsoleflag) 
        loggerinfo.tracetoconsole = 'Console log enabled'; 
    else 
        loggerinfo.tracetoconsole = 'Console log disabled';
    if (tracetofileflag)
        loggerinfo.tracetofile = 'File log enabled';
    else
        loggerinfo.tracetofile = 'File log disabled';

    return loggerinfo;
}
//----------------------------------------------------------------------------
// Switch console mode
//----------------------------------------------------------------------------
function enableconsole() {
    tracetoconsoleflag = true;
}
function disableconsole() {
    if (tracetofileflag)            // If no trace set to file, do not disable the console
        tracetoconsoleflag = false;
}
//-----------------------------------------------------
//  Set the file trace
//  If no filename passed, will default to OUTFILE
//  which itsel depends on either LOGFILE environment 
//  variable or a default (see code above)
//-----------------------------------------------------
function tracetofile(filename = OUTFILE) {
    tracetofileflag = true;
    OUTFILE = filename;
}
//-----------------------------------------------------
// For ASync mode
//-----------------------------------------------------
function debug(mess) {
    log(mess, DEBUG);
    return;
}
function info(mess) {
    log(mess, INFORMATIONAL);
    return;
}
function warning(mess) {
    log(mess, WARNING);
    return;
}
function error(mess) {
    log(mess, ERROR);
    return;
}
function fatal(mess) {
    log(mess, FATAL);
    return;
}
//-----------------------------------------------------
// For Sync mode
//-----------------------------------------------------
function debugs(mess) {
    log(mess, DEBUG, true);
    return;
}
function infos(mess) {
    log(mess, INFORMATIONAL, true);
    return;
}
function warnings(mess) {
    log(mess, WARNING, true);
    return;
}
function errors(mess) {
    log(mess, ERROR, true);
    return;
}
function fatals(mess) {
    log(mess, FATAL, true);
    return;
}

module.exports = {
    debug: debug, 
    info: info, 
    warning: warning, 
    error: error, 
    fatal: fatal,
    levelToString,
    getLoggerInfo,
}
/*
export default {
    MAXLOGS,
    LOGMODE,
    enableconsole,
    disableconsole,
    tracetofile,
    debug, info, warning, error, fatal,
    debugs, infos, warnings, errors, fatals,
}
*/