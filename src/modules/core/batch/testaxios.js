//-------------------------------------------------------------------------------
//    testaxios.js
//
//    Mar 19 2020     Initial
//    Mar 21 2020     Spring time and coronavirus
//-------------------------------------------------------------------------------

const Version = "testaxios.js:1.11 Mar 21 2020 ";

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
  console.log('\n\n');
  process.exit(0);;
}, 5000)
