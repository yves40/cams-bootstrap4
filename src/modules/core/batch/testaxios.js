//-------------------------------------------------------------------------------
//    testaxios.js
//
//    Mar 19 2020     Initial
//-------------------------------------------------------------------------------

const Version = "testaxios.js:1.01 Mar 19 2020 ";

const axios = require('axios');
const logger = require("../services/logger");

// Some axios default params
const axioscall = axios.create({
  timeout: 5000,
  withCredentials: true,
});  

const nodeserverlist = [
  { url: 'http://camsapi:8081', status: 0},
  { url: 'http://localhost:8080', status: 0},
  { url: 'http://zerasp:8081', status: 0},
];

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
(async() => {
  for (let loop = 0; loop < nodeserverlist.length; ++loop ) {
    console.log('_________________________________________________________________________')
    logger.info(Version + 'Testing ' + nodeserverlist[loop].url);
    await axioscall(
      {
        baseURL: nodeserverlist[loop].url,
        url: '/mongo/status',
        method: 'get',
      }
    )
    .then((response) => {
        logger.info(Version + ' Successful call to ' + nodeserverlist[loop].url);
        console.log(JSON.stringify(response.data))
        nodeserverlist[loop].status = 1;
        console.log('\n\n');
    })
    .catch((error) => {
        logger.error(Version + ' Failure when calling ' + nodeserverlist[loop].url + '  is KO KO KO KO !!!!!');
        console.log(JSON.stringify(error.message))
        console.log('\n\n');
    })
  }
  })();
console.log('Bye bye\n\n');
