//-------------------------------------------------------------------------------
//    mongologreader.js
//
//    Mar 27 2019     Initial, from mongologgertest
//    Mar 28 2019     Query problems
//    Mar 30 2019     Fix time range bug
//    Mar 31 2019     Change qualifiers
//                    Add -s for silent
//    Apr 02 2019     Change command line interpreter to use blanks instead of '='
//    Apr 03 2019     Forgot to change the usage samples
//    Nov 27 2019     Port to cam-bootstrap4
//    Dec 06 2019     new field in report
//-------------------------------------------------------------------------------

const Version = "mongologreader.js:1.28 Dec 06 2019 ";

const mongo = require('../services/mongodb');
const datetime = require('../services/datetime');
const logger = require("../services/logger");
const Mongolog = require ('../model/mongoLogModel');

const ObjectId = require('mongodb').ObjectId;

let loglimit = null;
let beforetime = null;
let aftertime = null;
let modulename = null;
let verbose = true;
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
      case '-before':value = process.argv[++index];
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
      case '-after': value = process.argv[++index];
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
      case '-l':  value = process.argv[++index];
                  if (value === undefined) {
                    throw new Error('You specified ' + keyword + ' without any value');
                  }
                  loglimit = parseInt(value);
                  validparam = true;
                  break;
      case '-m':  value = process.argv[++index];
                  if (value === undefined) {
                    throw new Error('You specified ' + keyword + ' without any value');
                  }
                  modulename = value;
                  validparam = true;
                  break;
      case '-s':  verbose = false;   // Silent mode ?
                  validparam = true;
                  break;
      case '-h':  validparam = true;
                  helprequested = true;
                  break;
    }
    if (!validparam) {
      throw new Error('Invalid parameter : ' + keyword);
    }
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
  if(verbose&&modulename) logger.info(Version + 'Searching for module ' + modulename);
};

//----------------------------------------------------------------------------
// ussage
//----------------------------------------------------------------------------
function usage() {

  console.log('\n\n');
  console.log('Usage : node mongologreader [-l maxlog] [-m modulename] [-before <valid-date>] [-after <valid-date>] [-s] \n');
  console.log('Usage : node mongologreader -h \n');
  console.log('[] maxlog is the maximum number of log events reported.');
  console.log('[] modulename is the name of a module which logged in mongo repository. The search is case insensitive');
  console.log('[] -before specifies a search for logs before a date');
  console.log('[] -after specifies a search for logs after a date');
  console.log('[]     valid-date defines the latest date to consider. All events posted before this date will not be read.');
  console.log('[]            Format must be either \"mon-dd-yyyy hh:mm\". or hh:mm');
  console.log('[]            Notice the surrounding \"\" when a full date is specified');
  console.log('[]     after and before can be used together to specify a time range. ');
  console.log('[] -s silent mode');
  console.log('[]');
  console.log('[] Samples');
  console.log('[]');
  console.log('[] node mongologreader.js -after "Mar-28-2019 10:14" -before "Mar-28-2019 09:28" -s');
  console.log('[] node mongologreader.js -m SERVER.JS');
  console.log('[] node mongologreader.js -before "Mar-28-2019 10:14" -after "Mar-28-2019 09:28" -s');
  console.log('[] node mongologreader.js -after mar-31-2019');

  console.log('\n\n');
}
//----------------------------------------------------------------------------
// Go
//----------------------------------------------------------------------------
console.log('\n');
try {
  parseCommandLine();
}
catch(Error) {
    console.log('\n\n********** Error : ' + Error);
    usage();
    process.exit(1);
}
if (helprequested) {
  usage();
  process.exit(0);
}
// Get a connection
mongo.getMongoDBConnection();
console.log('\n\n');
// Builds the query
let query = Mongolog.find({ });
query.select('module category email message timestamp severity').sort({timestamp: -1});  // Sorted by most recent dates
// Any specific module wanted ? 
if (modulename !== null) {
  query.select().where({ 'module' : { '$regex' : modulename, '$options' : 'i' } });
}
// Any time range  ? Must be : before MAR 31 ------ after MAR 26 
if(beforetime && aftertime) {  
  query.select().where('timestamp').gt(aftertime).where('timestamp').lt(beforetime);
}
else {
  // Any recent time ? Must be : after MAR 31 
  if(aftertime) {  
    query.select().where('timestamp').gt(aftertime);
  }
  // Any oldest time ? Must be : before MAR 31
  if(beforetime) {  
    query.select().where('timestamp').lt(beforetime);
  }
}
// Any limit to number of lines ?
if (loglimit) {
  query.limit(loglimit);
}
// Finally run the buit query
(async() => {
  await query.exec(function(err, thelist) {
    if (err) console.log(err);
    else {
      thelist.forEach((value, index) => {
        console.log('[ %s ] %s    %s %s %s %s', 
          ('0000'+index).slice(-4), 
          datetime.convertDateTime(value.timestamp), 
          value.module.padEnd(30, ' '), 
          value.message.padEnd(65, ' '),
          value.email.padEnd(15, ' '),
          value.category  );
      });
    }
    process.exit(0);
  });
})();
