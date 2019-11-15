//----------------------------------------------------------------------------
//    useradmin.js
//
//    Apr 24 2019    Initial
//    Apr 26 2019    Input from a json file
//    May 03 2019    WIP on asynchronous ops for add delete update
//    May 06 2019    Async and program termination
//    May 07 2019    Async...
//    May 08 2019    Async...
//    May 09 2019    Delete users
//    May 10 2019    Small output changes
//    May 15 2019    SYNC modewhen calling createUser
//    Oct 27 2019    Integrate cams-bootstrap4
//    Oct 28 2019    Reorg
//    Mov 07 2019    ListUser class method changed to to ListUsers
//    Nov 11 2019    Adapt to heavily rewritten user class: 1
//    Nov 12 2019    Adapt to heavily rewritten user class: 2
//    Nov 13 2019    Adapt to heavily rewritten user class: 3
//    Nov 15 2019    Sync vs async calls
//----------------------------------------------------------------------------

const Version = "useradmin.js:1.58 Nov 15 2019 ";

const userclass = require('../classes/userclass');
const logger = require('../../core/services/logger');
const mongo = require("../../core/services/mongodb");
const datetime = require("../../core/services/datetime");

var fs = require("fs");

let command = undefined;
let thefile = undefined;
let validparam = false;
//----------------------------------------------------------------------------
// Parse command line args
//----------------------------------------------------------------------------
function parseCommandLine() {
    let index = 0;
    for (index = 2; index < process.argv.length; ) {
      let keyword = process.argv[index];
      switch(keyword) {
        case '-add':
                    command = 'ADD';
                    validparam = true;
                    break;
        case '-delete':
                    command = 'DEL';
                    validparam = true;
                    break;
        case '-update': 
                    command = 'UPD';
                    validparam = true;
                    break;
        case '-list': 
                    command = 'LIS';
                    validparam = true;
                    break;
        case '-f': 
                    thefile = process.argv[++index];
                    validparam = true;
                    break;
        case '-z': 
                    command = 'ZAP';
                    validparam = true;
                    break;
        default: 
                    validparam = false;
                    break;
      }
      if (!validparam) {throw new Error('Invalid parameter : ' + keyword);}
      ++index;
      value = keyword = undefined; // Next loop
    }
    if (!command) {throw new Error('No command specified ( add | delete | update ) ');}
    if(thefile === undefined && command !== 'LIS' && command !== 'ZAP') {throw new Error('No json file input')}
};


//----------------------------------------------------------------------------
// usage
//----------------------------------------------------------------------------
function usage() {

    console.log('\n\n');
    console.log('Usage : node useradmin -add | -delete | -update -f jsonuserfile \n');
    console.log('Usage : node useradmin -list  \n');
    console.log('Usage : node useradmin -z  \n');
    console.log('[]');
    console.log('[] Beware, -z removes all users !!!!!!!!!!!!!!!!!!!');
    console.log('[]');
    console.log('\n\n');
}

//----------------------------------------------------------------------------
// Go
//----------------------------------------------------------------------------
try {
    console.log('\n\n');
    logger.info(Version + '\n\n');
    
    parseCommandLine();
    // Get a connection
    mongo.getMongoDBConnection();
    // Get the json file
    let jsonContent = undefined;
    if (command !== 'LIS' && command !== 'ZAP') {
      let jsondata = fs.readFileSync(thefile);
      jsonContent = JSON.parse(jsondata);
    }
    let commandFunction = undefined;
    switch(command) {
      case 'ADD': 
        commandFunction = createUsers;
        break;
      case 'UPD': 
        commandFunction = updateUsers;
        break;
      case 'DEL': 
        commandFunction = removeUsers;
        break;
      case 'LIS':   
        commandFunction = listUsers;
        break;
      case 'ZAP':   
        commandFunction = removeAllUsers;
        break;
    }
    
    // Syntax already checked : If coming here, we have a valid command
    // Call with await to ensure the command is properly finished
    (async () => {
      await commandFunction(jsonContent).then( (status)=> {
        console.log(status);
        process.exit(0);
      })
      .catch( (status) => {
        console.log('\nExit with status : ' + status);
        process.exit(0);
      })
    })();
}
catch(Error) {
    console.log('\n\n********** Error : ' + Error);
    usage();
    process.exit(1);
}

//----------------------------------------------------------------------------
// Create users
//----------------------------------------------------------------------------
function createUsers(jsonContent) {
  return new Promise((resolve, reject) => {
      const userlistsize = Object.keys(jsonContent).length;
      let userupdated = 0;
      console.log('____________________________________________');
      console.log('Processing ADD list of ' + userlistsize + ' user(s)\n');
      let i = 0;
      for (i in jsonContent) {
        let newuser = new userclass( 
            jsonContent[i].email, 
            jsonContent[i].name,
            jsonContent[i].password,
            jsonContent[i].profilecode,
            jsonContent[i].description,
          );  
        (async () => {
          await newuser.Add().then((status) => {
            console.log(status);
            if (++userupdated === userlistsize) {
              resolve('\nProcessed ' + userlistsize + ' user(s)');
            }
          })
          .catch( (status) => {
            console.log('\t' + status);
            reject('KO');
          })
        })();
      }
  });
}

//----------------------------------------------------------------------------
// Update users
//----------------------------------------------------------------------------
function updateUsers(jsonContent) {
  return new Promise((resolve, reject) => {
    const userlistsize = Object.keys(jsonContent).length;
    let userupdated = 0;
    console.log('____________________________________________');
    console.log('Processing UPDATE list of ' + userlistsize + ' user(s)');
    console.log('____________________________________________');
    for (i in jsonContent) {
      let newuser = new userclass( 
        jsonContent[i].email, 
        jsonContent[i].name,
        jsonContent[i].password,
        jsonContent[i].profilecode,
        jsonContent[i].description,
      );  
      (async () => {
          await newuser.Update().then( (status) => {
            console.log(status);
          })
          .catch( (status) => {
            reject('KO' + status);
          })
      })();
    }
    // Check user content from the DB after update
    for (i in jsonContent) {
      let newuser = new userclass( 
        jsonContent[i].email, 
      );  
      (async () => {
        await newuser.get().then( (theuser) => {
          if(userupdated === 0 ) {
            console.log('\n\n____________________________________________');
            console.log('Check updated users from the DB');
            console.log('____________________________________________');
          }
          console.log(theuser.email);
          console.log('====================');
          console.log('\t', theuser.name);
          console.log('\t', theuser.password);
          console.log('\t', theuser.description);
          console.log('\t Created: ', datetime.convertDateTime(theuser.created));
          console.log('\t Updated:', datetime.convertDateTime(theuser.updated));
          if (++userupdated === userlistsize) {
            resolve('\nProcessed ' + userlistsize + ' user(s)');
          }
        })
        .catch( (status) => {
            reject(status);
        })
      })()
    }
  })
}

//----------------------------------------------------------------------------
// Delete users
//----------------------------------------------------------------------------
function removeUsers(jsonContent) {
  return new Promise((resolve, reject) => {
    const userlistsize = Object.keys(jsonContent).length;
    let userupdated = 0;
    console.log('____________________________________________');
    (async () => {
      const userlistsize = Object.keys(jsonContent).length;
      console.log('Processing DEL list  of ' + userlistsize + ' user(s)\n');
      let i = 0;
      for (i in jsonContent) {
        let newuser = new userclass(jsonContent[i].email);
        (async () => {
          await newuser.Delete().then( (status) => {
            console.log(status);
            if (++userupdated === userlistsize)
              resolve('\nProcessed ' + userlistsize + ' user(s)');
          })
          .catch( (status) => {
            console.log('\t' + status);
            reject('KO');
          })
        })();
      }
    })();
  });
}

//----------------------------------------------------------------------------
// List users
// Quick and dirty implementation : Will not be cool if 1000 users
//----------------------------------------------------------------------------
function listUsers() {
  return new Promise((resolve, reject) => {
    let newuser = new userclass();
    console.log('____________________________________________');
    (async () => {
      await newuser.listUsers().then( (allusers) => {
        console.log(allusers.length + ' user(s) stored in the DB.\n'); 
        allusers.forEach((value, index) => {
          let email = value.email.padEnd(15, ' ');
          let name = value.name.padEnd(20, ' ');
          let password = value.password.padEnd(30, ' ');
          let description = value.description;
          let profilecode = value.profilecode;
          console.log(value.email);
          console.log('====================');
          console.log('\t', value.name);
          console.log('\t', value.password);
          console.log('\t', value.description);
          console.log('\t Created: ', datetime.convertDateTime(value.created));
          console.log('\t Updated:', datetime.convertDateTime(value.updated));
          for(let i = 0; i < profilecode.length; ++i) { 
            console.log('\t\t%s', profilecode[i]);
          }
          console.log('\n');
        });
        resolve('\n');
      })
      .catch( (status) => {
        console.log('\t' + status);
        reject('KO');
      })
    })();
  });
}
//----------------------------------------------------------------------------
// Delete All users !!!!
//----------------------------------------------------------------------------
function removeAllUsers() {
  return new Promise((resolve, reject) => {
    console.log('____________________________________________');
    (async () => {
      console.log('Deleting all users !!!!!!!!!!!!!!!!!!!\n');
      let newuser = new userclass();
      await newuser.DeleteAll().then( (status) => {
          resolve(status);
      })
      .catch( (status) => {
        console.log('\t' + status);
        reject('KO');
      })
    })();
  });
}
