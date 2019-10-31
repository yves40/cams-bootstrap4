//----------------------------------------------------------------------------
//    userapi.js
//
//    Nov 10 2018   Initial
//    Nov 11 2018   Test the service
//    Nov 21 2018   Test a personalized error message on user registration
//                  Add the API endpoint to log a user in
//    Nov 26 2018   Add user email in jwt payload
//    Nov 27 2018   WIP on user payload in the JWT payload
//    Dec 01 2018   Add expiration time when signing the token
//    Dec 03 2018   Add a local user strategy
//    Dec 04 2018   Local user strategy
//    Dec 05 2018   Debugging user session
//    Dec 06 2018   Debugging user session...
//    Dec 07 2018   Problem with mono node config and CORS
//    Dec 08 2018   TWITTER login, start of work
//    Dec 09 2018   TWITTER login, work..
//                  Will work on that later. No internet address available
//                  for my super vboxweb server
//    Jan 17 2019   Transfered to the CAMS project
//    Jan 19 2019   Some CORS tests, but not selected
//    Jan 20 2019   Start adding session management
//    Jan 21 2019   CORS is still very mysterious to me
//    Jan 22 2019   Passport : API problem solved
//                  When registering a user, check he's not aleady registered
//                  Add top bar management, fix problem with invalid login
//    Jan 23 2019   Some cleanup
//    Jan 25 2019   passwort jwt is back
//    Jan 26 2019   Some readings about jwt an passport drives to more tests
//                  Add a find user ByID a d by email services
//    Jan 30 2019   Small change in a log message
//    Jan 31 2019   Code reorg, now use a separate file auth.js for JWT stuff
//    Feb 01 2019   Cleanup
//                  Extract CORS to cors.js
//    Feb 06 2019   current_user, reorder the log 
//    Feb 08 2019   user description
//    Feb 11 2019  current_user now sends back the mongo status
//    Mar 08 2019  use logger
//    Mar 10 2019  undefined on logout
//    Mar 12 2019  whoami
//    Mar 14 2019  authjs moved in utilities
//    Mar 15 2019  test token expiration delay to invalidate it
//                 Add the decoded user token to the whoami call 
//    Mar 17 2019  Logout server error : serializeUser with mail : undefined
//                 Problem was with the token payload
//                 Compute the remaining valid time of token (whoami)
//    Mar 18 2019  remaining valid time of token display formated
//    Apr 03 2019  Use the new userLogger class
//    Apr 04 2019  Track client IP in user connection log
//                 Test pass req to callback for login
//    May 14 2019  Use the user class for 'register'
//    May 15 2019  user class for 'register'...
//    Oct 29 2019  cams-bootstrap4 project
//    Oct 31 2019  Source renamed. 1st login tests
//----------------------------------------------------------------------------

const Version = 'userController:2.98, Oct 31 2019 ';

// CORS
const corsutility = require("../../core/services/corshelper");
// User definition
const User = require('../model/userModel')
// User class
const userclass = require('../classes/userclass');
// To access mongodb status
const mongo = require("../../core/services/mongodb");
const logger = require("../../core/services/logger");
const helpers = require('../../core/services/helpers');
const userlogger = require("../services/userlogger");
const auth = require('../utilities/auth');

const passport = require('passport');
const cors = require('cors');

module.exports.controller = (app) => {

    //-----------------------------------------------------------------------------------
    // login a user : local strategy
    //-----------------------------------------------------------------------------------
    app.post('/users/login', cors(corsutility.getCORS()),passport.authenticate('login'), (req, res) => {
        const payload = { id: req.user.id, email: req.user.email };
        const token = auth.signToken(payload);
        logger.debug(Version + 'User ' + req.user.email + ' logged');
        const userdecodedtoken = auth.decodeToken(token);
        const tokendata = auth.getTokenTimeMetrics(userdecodedtoken);
        //logger.debug(Version + 'User decoded token : ' + JSON.stringify(userdecodedtoken));
        // let userlog = new userlogger(req.user.email, req.user.id, req.connection.remoteAddress);
        let userlog = new userlogger(req.user.email, req.user.id, helpers.getIP(req));
        userlog.informational('LOGIN');
        res.json( { message: req.user.email + ' logged', 
            token: token, 
            userdecodedtoken: userdecodedtoken,
            logintime: tokendata.logintime,
            remainingtime: tokendata.remainingtime,
            tokenstatus: tokendata.tokenstatus, 
            time: tokendata.time,
            tokenstatusString: tokendata.tokenstatusString, } );
    });

    //-----------------------------------------------------------------------------------
    // logout a user
    //-----------------------------------------------------------------------------------
    app.post('/users/logout', cors(corsutility.getCORS()), passport.authenticate('jwt'), (req, res) => {
        if (req.user) {
            const message = 'logging ' + req.user.email +  ' out';
            logger.debug(Version + message);
            const token = auth.invalidateToken({id: req.user.id, email: req.user.email});
            let userlog = new userlogger(req.user.email, req.user.id, helpers.getIP(req));
            userlog.informational('LOGOUT');
            req.logout();
            const userdecodedtoken = auth.decodeToken(token);
            const tokendata = auth.getTokenTimeMetrics(userdecodedtoken);
            // logger.debug(Version + 'User decoded token : ' + JSON.stringify(userdecodedtoken));    
            res.json( { message: message, 
                token: token, 
                userdecodedtoken: userdecodedtoken, 
                logintime: tokendata.logintime,
                remainingtime: tokendata.remainingtime,
                tokenstatus: tokendata.tokenstatus, 
                time: tokendata.time,
                tokenstatusString: tokendata.tokenstatusString, } );
        }
        else {
            res.json( { message: 'Not logged '});
        }
    });

    //-----------------------------------------------------------------------------------
    // get current user
    //-----------------------------------------------------------------------------------
    app.get('/users/whoami', cors(corsutility.getCORS()), passport.authenticate('jwt'), (req, res) => {
        if (req.user) {
            logger.debug(Version + '/users/whoami callback for ' + req.user.email);
            mongostatus = mongo.getMongoDBStatus();
            // Get the identification token
            // Format is : 
            // Authorization: JWT <token>
            const authHeader = req.headers['authorization'];
            const token = authHeader.split(' ')[1];
            const userdecodedtoken = auth.decodeToken(token);
            const tokendata = auth.getTokenTimeMetrics(userdecodedtoken);
            // logger.debug(Version + 'User decoded token : ' + JSON.stringify(userdecodedtoken));
            res.json( {whoami: req.user, 
                token: token,
                mongostatus: mongostatus, 
                userdecodedtoken: userdecodedtoken,
                logintime: tokendata.logintime,
                remainingtime: tokendata.remainingtime,
                tokenstatus: tokendata.tokenstatus, 
                time: tokendata.time,
                tokenstatusString: tokendata.tokenstatusString, } );
        }
    }); 

    //-----------------------------------------------------------------------------------
    // List all users
    //-----------------------------------------------------------------------------------
    app.get('/users/list', cors(corsutility.getCORS()), (req, res) => {
        User.listUsers( (error, userlist) => {
            if(error) { logger.debug(error);}
            logger.debug(Version + "Fetched " + userlist.length + " users"); 
            res.send(userlist);   
        })
    });

    //-----------------------------------------------------------------------------------
    // Register user
    //-----------------------------------------------------------------------------------
    app.post('/users/register', cors(corsutility.getCORS()), (req, res) => {

        User.getUserByEmail(req.body.email, (err, loggeduser) => {
            if(err) { return done(err); }
            if ( !loggeduser ) { 
                const name = req.body.name;
                const email = req.body.email;
                const password = req.body.password;
                const description = req.body.description;
                /*
                const newuser = new User({name, email, password, profilecode: 0, description});
                User.createUser(newuser, (error, user) => {
                    if(error) { 
                        res.status(422).json({
                            message: 'Something went wrong, try again later',
                        });
                    }
                    logger.debug(Version + 'Added '+ user.email + ' with password ' + user.password);
                    res.send({
                        user: user, 
                        message: 'User ' + user.email + ' registered',
                        status: 'OK',
                    });
                });
                */
                let newuser = new userclass();
                try {
                    newuser.S_createUser({name, email, password, profilecode: 0, description});
                    res.send({
                        user: {name, email, password, profilecode: 0, description}, 
                        message: 'User ' + email + ' registered',
                        status: 'OK',
                    });
                }
                catch(error) {
                    logger.debug(Version + 'Oh my god !!');
                    res.status(422).json({
                        message: 'Something went wrong, try again later',
                    });
                }
            }
            else {
                logger.debug(Version + 'User ' + req.body.email + ' already registered');
                res.send({
                    user: null, 
                    message: 'User ' + req.body.email + ' already registered',
                    status: 'KO',
                });
        }
        });

    });
    //-----------------------------------------------------------------------------------
    // Register users
    //-----------------------------------------------------------------------------------
    app.post('/users/registers', cors(corsutility.getCORS()), (req, res) => {
        logger.debug(Version + 'Adding users');
        let allusers = {};
        allusers = req.body.allusers;
        logger.debug(Version + 'Received a package for ' + allusers.length + ' users.');
        allusers.forEach((oneuser) => {
            let name = oneuser.name;
            let email = oneuser.email;
            let password = oneuser.password;
            let newuser = new user({name,email,password});
            user.createUser(newuser, (error, user) => {
                if(error) { logger.debug(error) };
                logger.debug(Version + 'Added '+ user.email + ' with password ' + user.password);
            });
        });
        res.send('success');
    });
    //-----------------------------------------------------------------------------------
    // Find a user by ID
    //-----------------------------------------------------------------------------------
    app.get('/users/find/ID/:id', cors(corsutility.getCORS()), (req, res) => {
        logger.debug(Version + 'Search user with ID : ' + req.params.id);
        User.findById( req.params.id, (error, user) => {
            if(error) { 
                logger.debug(error); 
                res.send( { message: 'No user matching this ID :' + req.params.id });
            }
            res.send(user);
        });
    })
    //-----------------------------------------------------------------------------------
    // Find a user by mail
    //-----------------------------------------------------------------------------------
    app.get('/users/find/email/:email', cors(corsutility.getCORS()), (req, res) => {
        logger.debug(Version + 'Search user with mail : ' + req.params.email);
        User.findOne({ 'email': req.params.email },  (error, user) => {
            if(error) { 
                logger.debug(error); 
                res.send( { message: 'No user matching this email :' + req.params.email });
            }
            res.send(user);
        });
    })
    //-----------------------------------------------------------------------------------
    // Remove One user by ID
    //-----------------------------------------------------------------------------------
    app.post('/users/delete/ID/:id', cors(corsutility.getCORS()), (req, res) => {
        logger.debug(Version + 'Removing user with ID : ' + req.params.id);
        User.deleteoneUserByID( req.params.id, (error, deleted) => {
            if(error) { logger.debug(error); }
            if(deleted.result.n === 0) { 
                logger.debug('No user matching this ID :' + req.params.id);
                res.send( { message: 'No user matching this ID :' + req.params.id });
            }
            else{
                logger.debug(Version + ' Done.' );
            }
            res.send(deleted);
        });
    })
    //-----------------------------------------------------------------------------------
    // Remove One user by name
    //-----------------------------------------------------------------------------------
    app.post('/users/delete/name/:name', cors(corsutility.getCORS()), (req, res) => {
        logger.debug(Version + 'Removing user with name : ' + req.params.name);
        User.deleteoneUserByName( req.params.name, (error, deleted) => {
            if(error) { logger.debug(error); }
            if(deleted.result.n === 0) { 
                logger.debug('No user matching this name :' + req.params.name);
            }
            else{
                logger.debug(Version + ' Done.' );
            }
            res.send(deleted);
        });
    })
    //-----------------------------------------------------------------------------------
    // Remove all users
    //-----------------------------------------------------------------------------------
    app.post('/users/deleteall', cors(corsutility.getCORS()), (req, res) => {
        logger.debug(Version + 'Deleting all users !!!');
        User.deleteallUsers( () => {
            logger.debug(Version + ' done !!');
            res.send('success');
        });
    })
    //-----------------------------------------------------------------------------------
    // Version
    //-----------------------------------------------------------------------------------
    module.exports.getVersion =  () => { return Version; }
};
