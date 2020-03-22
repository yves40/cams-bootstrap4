//-------------------------------------------------------------------------------
//    testaxios.js
//
//    Mar 19 2020     Initial
//    Mar 21 2020     Spring time and coronavirus
//    Mar 22 2020     Spring time and coronavirus: few more tests
//-------------------------------------------------------------------------------

const Version = "testaxios.js:1.16 Mar 22 2020 ";

const logger = require("../services/logger");
const axiosclass = require('../classes/axiosclass');
const DELAY = 5000;
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
  logger.info(Version + 'Selected server : ' + ax.getSelectedServer());
  // test the get method
  logger.info(Version + 'get /mongo/status')
  ax.get('/mongo/status').then( (response) => {
    console.log('\n\n' + JSON.stringify(response.data));
  })
  .catch((error) => {
    console.log('\n\n' + JSON.stringify(error.message));
  })
  // test false url
  logger.info(Version + 'get /mongo/statusss')
  ax.get('/mongo/statusss').then( (response) => {
    console.log('\n\n' + JSON.stringify(response.data));
  })
  .catch((error) => {
    console.log('\n\n' + JSON.stringify(error.message));
  })
  // test full url
  logger.info(Version + 'get https://jsonplaceholder.typicode.com/users')
  ax.getFull('https://jsonplaceholder.typicode.com/users').then( (response) => {
    console.log('\n\n' + JSON.stringify(response.data));
  })
  .catch((error) => {
    console.log('\n\n' + JSON.stringify(error.message));
  })
  .finally( () => { // Wait a little bit and exit
    setTimeout( () => {
      console.log('\n\n');
      process.exit(0);
    }, DELAY);
  })
}, DELAY)
