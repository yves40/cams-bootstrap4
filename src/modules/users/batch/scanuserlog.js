//----------------------------------------------------------------------------
//    scanuserlog.js
//
//    Apr 03 2019    Initial, from simplemongologgertest
//    Apr 04 2019    Add info, qualifiers and format listing
//    Apr 05 2019    WIP on Promise for async ops
//    Apr 06 2019    painfully working on mongoose ASYNC 
//    Apr 07 2019    mongoose ASYNC, I lost 4h on that because I'm stupid
//    Apr 10 2019    Bug on listing ( mail restriction and order )
//                   Search for partial mail : i.e free.fr
//                   WIP on time range and lines limit
//    Apr 23 2019    Time range and some bugs 
//    Nov 24 2019    Integrate cams-bootstrap4
//    Nov 26 2019    user class changed
//    Nov 27 2019    -h qualifier
//----------------------------------------------------------------------------

const Version = "scanuserlog.js:1.41 Nov 27 2019 ";

const userclass = require('../classes/userclass');
const userLog = require('../model/userLogModel');
const logger = require('../../core/services/logger');
const datetime = require('../../core/services/datetime');
const mongo = require('../../core/services/mongodb');

let useremail = undefined;
let loglimit = undefined;
let beforetime = null;
let aftertime = null;
let verbose = true;
let searchunknwon = true;
let userids = [];       // All users to get log from 
let validparam = false;
let helprequested = false;
//----------------------------------------------------------------------------
// Parse command line args
//----------------------------------------------------------------------------
function parseCommandLine() {
    let index = 0;
    let value = undefined;
    let nbrargs = process.argv.length - 2;
    for (index = 2; index < process.argv.length; ) {
      let keyword = process.argv[index];
      switch(keyword) {
        case '-mail':
                    value = process.argv[++index];
                    if (value === undefined) {
                      throw new Error('You specified ' + keyword + ' without any value');
                    }
                    useremail = value;
                    validparam = true;
                    break;
        case '-before':
                    value = process.argv[++index];
                    if (value === undefined) {
                      throw new Error('You specified ' + keyword + ' without any value');
                    }
                    if (value.length < 6) {
                      // Expect user specified just hh:mm, so add current day month year
                      value = datetime.getDate() + ' ' + value;                       
                    }
                    beforetime = new Date(value);
                    validparam = true;
                    break;
        case '-after': 
                    value = process.argv[++index];
                    if (value === undefined) {
                      throw new Error('You specified ' + keyword + ' without any value');
                    }
                    if (value.length < 6) {
                    // Expect user specified just hh:mm, so add current day month year
                    value = datetime.getDate() + ' ' + value;                       
                    }
                    aftertime = new Date(value);
                    validparam = true;
                    break;
          case '-l':  
                    value = process.argv[++index];
                    if (value === undefined) {
                      throw new Error('You specified ' + keyword + ' without any value');
                    }
                    loglimit = parseInt(value);
                    validparam = true;
                    break;
            case '-s':  verbose = false;   // Silent mode ?
                    validparam = true;
                    break;
            case '-nok':  searchunknwon = false; 
                    validparam = true;
                    break;
            case '-h':  validparam = true;
                    helprequested = true;
                    break;
              default: 
                    validparam = false;
                    break;
      }
      if (!validparam) {throw new Error('Invalid parameter : ' + keyword);}
      ++index;
      value = keyword = undefined; // Next loop
    }
    if(aftertime) {   // Valid date ? 
        if (isNaN(Date.parse(aftertime))) throw new Error('-after date invalid format');
      }
      if(beforetime) {   // Valid date ? 
        if (isNaN(Date.parse(beforetime))) throw new Error('-before date invalid format');
      }
      if((aftertime && beforetime)&&(aftertime > beforetime)) {
        throw new Error('Cannot set a time range between ' + datetime.convertDateTime(beforetime) +
                ' and ' + datetime.convertDateTime(aftertime));
      }
      if(verbose&&aftertime&&beforetime) {
        logger.info(Version + 'Searching for logs after ' + datetime.convertDateTime(aftertime) + ' and before ' + datetime.convertDateTime(beforetime));
      }
      else {
        if(verbose&&beforetime) logger.info(Version + 'Searching for logs before ' + datetime.convertDateTime(beforetime));
        if(verbose&&aftertime) logger.info(Version + 'Searching for logs after ' + datetime.convertDateTime(aftertime));
      }
      if(verbose&&loglimit) logger.info(Version + 'Will report no more than ' + loglimit + ' lines');
};


//----------------------------------------------------------------------------
// ussage
//----------------------------------------------------------------------------
function usage() {

    console.log('\n\n');
    console.log('Usage : node scanuserlog [-mail <usermail>] [-l maxlog] [-before <valid-date>] [-after <valid-date>] [-s] [nok]\n');
    console.log('Usage : node scanuserlog -h \n');
    console.log('[] usermail is a string matching all or partial mail spec. i.e : lueo@free.fr or eo@fr');
    console.log('[] maxlog is the maximum number of log events reported.');
    console.log('[] -before specifies a search for logs before a date');
    console.log('[] -after specifies a search for logs after a date');
    console.log('[]     valid-date defines the latest date to consider. All events posted before this date will not be read.');
    console.log('[]            Format must be either \"mon-dd-yyyy hh:mm\". or hh:mm');
    console.log('[]            Notice the surrounding \"\" when a full date is specified');
    console.log('[]     after and before can be used together to specify a time range. ');
    console.log('[] -s silent mode');
    console.log('[] -nok do not search for unknows users login failure');
    console.log('[]');
    console.log('[] Samples');
    console.log('[]');
    console.log('[] node scanuserlog.js -after "Mar-28-2019 10:14" -before "Mar-28-2019 09:28" -s');
    console.log('[] node scanuserlog.js -m SERVER.JS');
    console.log('[] node scanuserlog.js -before "Mar-28-2019 10:14" -after "Mar-28-2019 09:28" -s');
    console.log('[] node scanuserlog.js -after mar-31-2019');
    console.log('[] node scanuserlog.js -mail yv  -nok');
      console.log('\n\n');
}

//----------------------------------------------------------------------------
// Go
//----------------------------------------------------------------------------

try {

    console.log('\n\n');
    logger.info(Version + 'Start search ');
    
    parseCommandLine();
    if (helprequested) {
        usage();
        process.exit(0);
    }
    // Get a connection
    mongo.getMongoDBConnection();

    // Search known users login activity
    getUserIds(useremail).then( function (userids) {
        if (verbose&&useremail)console.log('\nFound ' + userids.length + ' user(s) matching mail criteria : [ ' + useremail + ' ]' + '\n\n');
        // Get logs for each logged user found
        userids.forEach( (userobj, index) => {
            (async () => {
                await getUserLogs(userobj.id).then( (status) => {
                    if(index === userids.length - 1) {
                        // Search for login attempts with unknown users
                        if (searchunknwon) {
                            console.log('\n\nList of unknown user attempts\n\n');
                            // Get logs for Unknown users 
                            (async () => {
                                await getUserUnknownLogs().then( (status) => {
                                    console.log('\n' + status);
                                    process.exit(0);
                                })
                            })();
                        }
                        else {
                            process.exit(0);
                        }
                    }
                })
                .catch( (status) => {
                    console.log('\nNo entry found for ' + userobj.mail + '\n');
                    if(index === userids.length - 1) {process.exit(0);}
                });
            })();
        });
    })
    .catch( function (message) {
        logger.error(message);
        process.exit(0);    
    });
}
catch(Error) {
    console.log('\n\n********** Error : ' + Error);
    usage();
    process.exit(1);
}
//----------------------------------------------------------------------------
// Get logs for one user
//----------------------------------------------------------------------------
function getUserLogs(userid) {
    return new Promise((resolve, reject) => {
        let querylog = userLog.find({});
        querylog.select('email action timestamp ip severity').sort({timestamp: -1});
        querylog.select().where('userid').equals(userid);
        // Any time range  ? Must be : before MAR 31 ------ after MAR 26 
        if(beforetime && aftertime) {  
            querylog.select().where('timestamp').gt(aftertime).where('timestamp').lt(beforetime);
        }
        else {
            // Any recent time ?
            if(aftertime) {  
            querylog.select().where('timestamp').gt(aftertime);
            }
            // Any oldest time ?
            if(beforetime) {  
            querylog.select().where('timestamp').lt(beforetime);
            }
        }
        // Any limit to number of lines ?
        if (loglimit) {
            querylog.limit(loglimit);
        }
    

        (async () => {
                await querylog.exec(function(err, loglist) {
                    if (err) console.log(err);
                    if(loglist.length === 0) {
                        reject('No entry');
                    }
                    else {
                        loglist.forEach((value, index) => {
                            if (index === 0) console.log('\nLogs for ' + value.email + '\n----------------------------------------');
                            console.log('%s %s %s', datetime.convertDateTime(value.timestamp), 
                                        value.action.padEnd(35, ' '),
                                        value.email);
                        });
                    }
                    resolve('done');
                });
            })();
    });
}
//----------------------------------------------------------------------------
// Get logs for unknwon user authentication errors
//----------------------------------------------------------------------------
function getUserUnknownLogs() {
    return new Promise((resolve, reject) => {
    let uknentries = 0;
    let querylog = userLog.find({});
    querylog.select('email action timestamp ip severity').sort({timestamp: -1});
    querylog.select().where({ 'action' : { '$regex' : 'unknown', '$options' : 'i' } });
    (async () => {
            await querylog.exec(function(err, loglist) {
                if (err) console.log(err);
                if(loglist.length === 0) {
                    reject('No entry for ');
                }
                else {
                    uknentries = loglist.length;
                    loglist.forEach((value, index) => {
                        console.log('%s %s %s', datetime.convertDateTime(value.timestamp), 
                                    value.action.padEnd(35, ' '),
                                    value.email);
                    });
                }
                resolve('Found ' + uknentries + ' attempts to log in with unknown users');
            });
        })();
    });
}
//----------------------------------------------------------------------------
// Get user ID list
//----------------------------------------------------------------------------
function getUserIds(mail) {
    return new Promise((resolve, reject) => {
        let usersearch = new userclass();
        usersearch.listUsers(mail).then( (selectedusers) => {
            if(selectedusers.length === 0) {
                reject('No matching user for ' + mail);
            }
            else {
                selectedusers.forEach((value, index) => {
                    userids.push( { id: value._id, mail: value.email });
                });
                resolve(userids);
            }
        })
        .catch( (status) => {
            reject ('No user found');
        });
    });
}