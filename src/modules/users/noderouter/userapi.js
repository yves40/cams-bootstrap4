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
//    Nov 02 2019  Reorg
//    Nov 05 2019  Put the logout service back into camms-bootstrap4
//                 Security modules reorg
//    Nov 07 2019  Put the register service back into camms-bootstrap4
//    Nov 08 2019  Remove an API
//    Nov 15 2019  Adapt to the userclass modifications
//    Nov 19 2019  Adapt to new userclass : register
//    Nov 20 2019  New userclass, tests : login, logout
//    Nov 21 2019  So many things to check...
//    Nov 22 2019  User object used in login logout sequences
//    Nov 23 2019  WIP on Update calls
//    Nov 24 2019  Fix problem with description field during register
//    Nov 26 2019  Problem when logging a user connection
//                 Check client IP 
//    Nov 27 2019  Check client IP. No longer use it, it's a mess
//                 Log user registration in mongodb global store with mongologgerclass
//    Nov 29 2019  Remove some logging
//    Dec 06 2019  No longer use the old userlog
//                 Add a service to access mongolog
//    Dec 09 2019  Access user logs now
//    Dec 11 2019  Manage lines limit for mongo llog queries
//    Dec 12 2019  /users/messages get more input params 
//    Dec 13 2019  Manage severity level when reading user logs
//    Dec 17 2019  Check severity parameter for user log request. 
//                 GET is now a POST
//                 Update a user from web access
//    Dec 19 2019  User update bug
//    Dec 21 2019  Small change to /users/delete/email
//    Dec 22 2019  /users/delete/email check
//    Dec 23 2019  /users/delete/email ; timeout bug
//    Dec 26 2019  Message after delete
//    Dec 28 2019  Register user service : better code
//----------------------------------------------------------------------------
const express = require('express');
const router = express.Router();

const Version = 'userapi:3.75, Dec 28 2019 ';

const corsutility = require("../../core/services/corshelper");
const logger = require("../../core/services/logger");
const props = require("../../core/services/properties");
const helpers = require('../../core/services/helpers');
const auth = require('../services/auth');
const jwthelper = require('../services/jwthelper');
const userclass = require('../classes/userclass');
const mongologgerclass = require('../../core/classes/mongologgerclass');
let mongolog = new mongologgerclass(Version, 'USERAPI');

const passport = require('passport');
const cors = require('cors');

//-----------------------------------------------------------------------------------
// login a user : local strategy
// passport.authenticate('login') returns a userclass object in req.user
//-----------------------------------------------------------------------------------
router.post('/users/login', cors(corsutility.getCORS()),
    passport.authenticate('login'),
    (req, res) => {
        const payload = { id: req.user.model.id, email: req.user.model.email };
        const token = jwthelper.signToken(payload);
        logger.debug(Version + 'User ' + req.user.model.email + ' logged in');
        const userdecodedtoken = jwthelper.verifyToken(token);
        const tokendata = jwthelper.getTokenTimeMetrics(userdecodedtoken);
        mongolog.informational(req.user.model.email + ' logged in', 'LOGIN', req.user.model.email);
        res.json( { message: req.user.model.email + ' logged', 
            token: token, 
            userdecodedtoken: userdecodedtoken,
            remainingtime: tokendata.remainingtime,
            theuser: req.user,      // Send back the identified user object
         } );
});
//-----------------------------------------------------------------------------------
// logout a user
// The mode parameter is passed in the request for after user delete action
//-----------------------------------------------------------------------------------
router.post('/users/logout', cors(corsutility.getCORS()), 
    passport.authenticate('jwt'), 
    (req, res) => {
        if (req.user) {
            const message = 'logging ' + req.user.model.email +  ' out : mode is ' + req.body.mode;
            const usermail = req.user.model.email;
            logger.debug(Version + message);
            const token = auth.invalidateToken({id: req.user.model.id, email: req.user.model.email});
            // Update the logout time if we're not in a delete user process
            if (req.body.mode !== 'afterdelete') {
                logger.debug(Version + 'Update logout time for ID ' + req.user.model.id)
                new userclass().getByID(req.user.model.id, (err, loggeduser) => {
                    if (err) {
                        logger.error(Version + ' Cannot get user data for ID : ' + req.user.model.id);
                    }
                    loggeduser.lastlogout = Date.now();
                    loggeduser.save((error, user) => {
                        if (error) {
                            logger.error(Version + 'Cannot save last logout date')
                        }
                    });
                });
            }
            mongolog.informational( req.user.model.email + ' logged out', 'LOGOUT', req.user.model.email)
            req.logout();
            res.json( { message: message, email: usermail } );
        }
        else {
            res.json( { message: 'Not logged '});
        }
});
//-----------------------------------------------------------------------------------
// Register user
//-----------------------------------------------------------------------------------
router.post('/users/register', cors(corsutility.getCORS()), 
    helpers.asyncMiddleware(async (req, res, next) => { 
        let newuser = new userclass(
            req.body.email, 
            req.body.name,
            req.body.password,
            ["STD"],
            req.body.userdescription
        );
        newuser.Add()
        .then( (response) => {
            mongolog.informational(response, 'REGISTER', req.body.email);
            res.json( { error: false, message: response });
        })
        .catch( (error) => {
            mongolog.error(error, 'REGISTER', req.body.email);
            res.json( { error: true, message: error });
        })
    })
);

//-----------------------------------------------------------------------------------
// Update user
//-----------------------------------------------------------------------------------
router.post('/users/update', cors(corsutility.getCORS()), 
    passport.authenticate('jwt'),
    helpers.asyncMiddleware(async (req, res, next) => {
        logger.debug(Version + 'Update user : ' + req.user.model.email);
        let newuser = new userclass(
            req.user.model.email, 
            req.body.name,
            undefined,
            undefined,
            req.body.description
        );
        let updateduser = await newuser.Update();
        mongolog.informational('User ' + req.user.model.email + ' has been updated.', 
                'UPDATE', req.body.email);
        res.json(updateduser);
    })
);

//-----------------------------------------------------------------------------------
// log a message in Mongo
//-----------------------------------------------------------------------------------
router.post('/users/messages', cors(corsutility.getCORS()),
    passport.authenticate('jwt'),
    (req, res) => {
        const message = req.body.message;
        const severity = req.body.severity;
        const category = req.body.category === undefined ? 'AUTHENTICATION' : req.body.category;
        switch(severity) {
            case 'D':
                    mongolog.debug(message, category, req.user.model.email);
                    break;
            case 'I':
                    mongolog.informational(message, category, req.user.model.email);
                    break;
            case 'W':
                    mongolog.warning(message, category, req.user.model.email);
                    break;
            case 'E':
                    mongolog.error(message, category, req.user.model.email);
                    break;
            case 'F':
                    mongolog.fatal(message, category, req.user.model.email);
                    break;
        }  
        res.send('OK');
    }
);

//-----------------------------------------------------------------------------------
// Remove One user by email
//-----------------------------------------------------------------------------------
router.post('/users/delete/email', cors(corsutility.getCORS()), 
    passport.authenticate('jwt'),
    helpers.asyncMiddleware(async (req, res, next) => {
        mongolog.informational(req.user.model.email + ' : delete my account', 'ACCOUNT', req.user.model.email);
        await new userclass(req.user.model.email).Delete()
            .then( (message) => {
                logger.debug('Delete status from user class ' + message); 
                res.send(message);
            })
            .catch( (error) => {
                res.send(error);
            });
    })
);

//-----------------------------------------------------------------------------------
// List all users
//-----------------------------------------------------------------------------------
router.get('/users/list', cors(corsutility.getCORS()),
    passport.authenticate('jwt'), 
    helpers.asyncMiddleware(async (req, res, next) => {
        let allusers = await new userclass().listUsers();
        res.send(allusers);   
    })
);

//-----------------------------------------------------------------------------------
// Access user log
//-----------------------------------------------------------------------------------
router.post('/users/mylog', cors(corsutility.getCORS()),
    passport.authenticate('jwt'), 
    (req, res) => {
        const severity = req.body.severity;       // Defines the severity of logs required. Defaults to all
        let lineslimit = req.body.lineslimit;
        if(lineslimit === undefined) 
            lineslimit = props.MONGOLOGLINESLIMIT;      // This is the default
        const mongologs = new mongologgerclass();
        mongologs.getUserLogs(req.user.model.email, lineslimit, severity).then((logs) => {
            res.send(logs);
        })
        .catch((errormessage => {
            res.send(errormessage);
        }))
    }
);

//-----------------------------------------------------------------------------------
// List all users emails and Ids
//-----------------------------------------------------------------------------------
router.get('/users/listemailsids', cors(corsutility.getCORS()), 
    passport.authenticate('jwt'), 
    helpers.asyncMiddleware(async (req, res, next) => {
        let allusers = await new userclass().listUsersEmailsIds();
        res.send(allusers);   
    })
);
//-----------------------------------------------------------------------------------
// Remove all users
// Very dangerous call ;-) 
// Will be protected 
//-----------------------------------------------------------------------------------
router.post('/users/deleteall', cors(corsutility.getCORS()),     helpers.asyncMiddleware(async (req, res, next) => {
        let message = await new userclass().DeleteAll();
        res.send(message);   
    })
)

module.exports = router;