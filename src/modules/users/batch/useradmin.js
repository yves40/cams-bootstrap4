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
//----------------------------------------------------------------------------

const Version = "useradmin.js:1.40 Nov 12 2019 ";

const userclass = require('../classes/userclass');
const logger = require('../../core/services/logger');
const mongo = require("../../core/services/mongodb");

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
        default: 
                    validparam = false;
                    break;
      }
      if (!validparam) {throw new Error('Invalid parameter : ' + keyword);}
      ++index;
      value = keyword = undefined; // Next loop
    }
    if (!command) {throw new Error('No command specified ( add | delete | update ) ');}
    if(thefile === undefined && command !== 'LIS') {throw new Error('No json file input')}
};


//----------------------------------------------------------------------------
// usage
//----------------------------------------------------------------------------
function usage() {

    console.log('\n\n');
    console.log('Usage : node useradmin -add | -delete | -update  -f jsonuserfile \n');
    console.log('Usage : node useradmin -list  \n');
    console.log('[]');
    console.log('[] Samples');
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
    if (command !== 'LIS') {
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
    }
    
    // Syntax already checked : If coming here, we have a valid command
    // Call with await to ensure the command is properly finished
    (async () => {
      await commandFunction(jsonContent).then( (status)=> {
        console.log(status);
        process.exit(0);
      })
      .catch( (status) => {
        console.log('\nHmmmm, sorry it seems something went wrong');
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
    (async () => {
      const userlistsize = Object.keys(jsonContent).length;
      let userupdated = 0;
      console.log('____________________________________________');
      console.log('Processing ADD list of ' + userlistsize + ' user(s)\n');
      let i = 0;
      for (i in jsonContent) {
        let newuser = new userclass( jsonContent[i].email, 
            jsonContent[i].name,
            jsonContent[i].password,
            jsonContent[i].description,
          );  
        (async () => {
          await newuser.Add().then((status) => {
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
        let newuser = new user(jsonContent[i].email);
        (async () => {
          await newuser.removeUser().then( (status) => {
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
// Update users
//----------------------------------------------------------------------------
function updateUsers(jsonContent) {
  return new Promise((resolve, reject) => {
    (async () => {
      const userlistsize = Object.keys(jsonContent).length;
      let userupdated = 0;
      console.log('____________________________________________');
      console.log('Processing UPDATE list of ' + userlistsize + ' user(s)\n');
      let i = 0;
      for (i in jsonContent) {
        let newuser = new user(jsonContent[i].email);  
        (async () => {
          await newuser.updateUser(jsonContent[i]).then( (status) => {
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
          let email = value.email.padEnd(24, ' ');
          let name = value.name.padEnd(40, ' ');
          let description = value.description;
          console.log('%s %s %s', email, name, description);
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
