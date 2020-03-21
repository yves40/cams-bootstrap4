//-------------------------------------------------------------------------------
//    testaxios.js
//
//    Mar 19 2020     Initial
//    Mar 21 2020     Spring time and coronavirus
//-------------------------------------------------------------------------------

const Version = "testaxios.js:1.12 Mar 21 2020 ";

const logger = require("../services/logger");
const axiosclass = require('../classes/axiosclass');
//----------------------------------------------------------------------------
// ussage
//----------------------------------------------------------------------------
function usage() {

  console.log('\n\n');
  console.log('Usage : node testaxios \n');
  console.log('Usage : node testaxios -h \n');
  console.log('[]');
  console.log('[] Samples');
  console.log('[]');

  console.log('\n\n');
}

//----------------------------------------------------------------------------
// Go
//----------------------------------------------------------------------------
console.log('\n');
let ax = new axiosclass();

setTimeout(() => {
  let activeservers = ax.getNodeServers();
  activeservers.forEach( (element) => {
    logger.debug(Version + element.nodeserver + ' is ' + (element.status === 0? 'Down': 'Up'));
  });
  // Get the any active server
  let theserver = ax.getLastActiveNode();
  if(theserver)
    logger.info(Version + 'Last active node is ' + theserver);
  else
    logger.error(Version + 'No active node sorry')
  // Get first active server
  theserver = ax.getFirstActiveNode();
  if(theserver)
    logger.info(Version + '1st Active node is ' + theserver);
  else
    logger.error(Version + 'No active node sorry')
  console.log('\n\n');
  process.exit(0);;
}, 5000)
