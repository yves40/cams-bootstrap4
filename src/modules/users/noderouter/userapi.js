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
//----------------------------------------------------------------------------
const express = require('express');
const router = express.Router();

const Version = 'userapi:3.10, Nov 07 2019 ';

const corsutility = require("../../core/services/corshelper");
const logger = require("../../core/services/logger");
const helpers = require('../../core/services/helpers');
const userlogger = require("../services/userlogger");
const auth = require('../services/auth');
const jwthelper = require('../services/jwthelper');
const usermodel = require('../model/userModel');
const userclass = require('../classes/userclass');

const passport = require('passport');
const cors = require('cors');

//-----------------------------------------------------------------------------------
// login a user : local strategy
//-----------------------------------------------------------------------------------
router.post('/users/login', cors(corsutility.getCORS()),passport.authenticate('login'),
    (req, res) => {
        const payload = { id: req.user.id, email: req.user.email };
        const token = jwthelper.signToken(payload);
        logger.debug(Version + 'User ' + req.user.email + ' logged');
        const userdecodedtoken = jwthelper.decodeToken(token);
        const tokendata = jwthelper.getTokenTimeMetrics(userdecodedtoken);
        let userlog = new userlogger(req.user.email, req.user.id, helpers.getIP(req));
        userlog.informational('LOGIN');
        res.json( { message: req.user.email + ' logged', 
            token: token, 
            userdecodedtoken: userdecodedtoken,
            remainingtime: tokendata.remainingtime,
            theuser: req.user,      // Send back the identified user object
         } );
});
//-----------------------------------------------------------------------------------
// logout a user
//-----------------------------------------------------------------------------------
router.post('/users/logout', cors(corsutility.getCORS()), passport.authenticate('jwt'), (req, res) => {
    if (req.user) {
        const message = 'logging ' + req.user.email +  ' out';
        logger.debug(Version + message);
        const token = auth.invalidateToken({id: req.user.id, email: req.user.email});
        let userlog = new userlogger(req.user.email, req.user.id, helpers.getIP(req));
        userlog.informational('LOGOUT');
        req.logout();
        const userdecodedtoken = jwthelper.decodeToken(token);
        const tokendata = jwthelper.getTokenTimeMetrics(userdecodedtoken);
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
// Register user
//-----------------------------------------------------------------------------------
router.post('/users/register', cors(corsutility.getCORS()), (req, res) => {

    usermodel.getUserByEmail(req.body.email, (err, loggeduser) => {
        if(err) { return done(err); }
        if ( !loggeduser ) { 
            const name = req.body.name;
            const email = req.body.email;
            const password = req.body.password;
            const description = req.body.description;
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
// List all users
// Unprotected function right now
//-----------------------------------------------------------------------------------
router.get('/users/list', cors(corsutility.getCORS()), (req, res) => {
    usermodel.listUsers( (error, userlist) => {
        if(error) { logger.debug(error);}
        logger.debug(Version + "Fetched " + userlist.length + " users"); 
        res.send(userlist);   
    })
});

module.exports = router;