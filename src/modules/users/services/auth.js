//----------------------------------------------------------------------------
//    auth.js
//
//    Jan 30 2019   Initial
//    Jan 31 2019   Get userController code 
//    Mar 06 2019   console.log replaced by logger
//    Mar 13 2019   BUG: Was disabling the logger console
//    Mar 14 2019   Shorten the token expiration time
//                  Moved to utilities
//    Mar 15 2019   test token expiration delay to invalidate it
//    Mar 17 2019  Logout server error
//    Mar 18 2019  Function to retrieve an object with token time characteristics
//    Mar 23 2019  Change token status string
//    Mar 24 2019  Add a logout check with lastlogout
//    Apr 03 2019  trace login failure in the userlogs collection
//    Apr 04 2019  Track client IP in user connection log
//    Apr 10 2019  Unknown user error log improved
//    Oct 29 2019  cams-bootstrap4 project
//    Oct 31 2019  Reorg
//    Nov 04 2019  User to UserModel. 
//----------------------------------------------------------------------------
const Version = 'auth.js:1.46, Nov 04 2019 ';

const jwtconfig = require('../../core/services/properties').jwtconfig;
const logger = require('../../core/services/logger');
const userlogger = require('./userlogger');
const datetime = require('../../core/services/datetime');
const helpers = require('../../core/services/helpers');
const UserModel = require('../model/userModel');

const jwt = require('jsonwebtoken');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const passportJWT = require('passport-jwt');
const JwtStrategy = passportJWT.Strategy;
const ExtractJwt = passportJWT.ExtractJwt;

const tokenexpirationdelay = 1800;

const jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt');
jwtOptions.secretOrKey = jwtconfig.jwtSecret;

//-----------------------------------------------------------------------------------
// Sign a token
//-----------------------------------------------------------------------------------
module.exports.signToken = function signToken(payload) {
    logger.debug(Version + 'signing the token with a ' + tokenexpirationdelay + ' seconds expiration time');
    const token = jwt.sign(payload, jwtOptions.secretOrKey, {expiresIn: tokenexpirationdelay}); // 30 mn
    return token;
};

//-----------------------------------------------------------------------------------
// Invalidate a token during logout
//-----------------------------------------------------------------------------------
module.exports.invalidateToken = function invalidateToken(payload) {
    logger.debug(Version + 'Update logout time for ID ' + payload.id)
    UserModel.findById(payload.id, (err, loggeduser) => {
        if (err) {
            logger.error(Version + ' Cannot get user data for ID : ' + payload.id);
        }
        loggeduser.lastlogout = Date.now();
        loggeduser.save((error, user) => {
            if (error) {
                logger.error(Version + 'Cannot save last logout date')
            }
        });
    });
    logger.debug(Version + 'Invalidating a token with a 1s expiration time');
    const token = jwt.sign(payload, jwtOptions.secretOrKey, {expiresIn: 1}); // 1 second
    return token;
};

//-----------------------------------------------------------------------------------
// Decode a token
//-----------------------------------------------------------------------------------
module.exports.decodeToken = function decodeToken(thetoken) {
    return jwt.decode(thetoken, jwtconfig.jwtSecret);
};

//-----------------------------------------------------------------------------------
// get token time characteristics
//-----------------------------------------------------------------------------------
module.exports.getTokenTimeMetrics = function getTokenTimeMetrics(thetoken) {
    let tokenmetrics = {};
    let remainingtime = Math.floor(thetoken.exp - Date.now()/1000); // Remaining time in seconds
    tokenmetrics.tokenstatus = true;
    tokenmetrics.tokenstatusString = '';
    if (remainingtime <= 0) {
        tokenmetrics.tokenstatusString = datetime.convertDateTime(thetoken.exp*1000);
        remainingtime = 0;
        tokenmetrics.tokenstatus = false; 
    }
    else{
        tokenmetrics.tokenstatusString = datetime.convertDateTime(thetoken.exp*1000);
    }
    tokenmetrics.logintime = datetime.convertDateTime(thetoken.iat*1000);
    tokenmetrics.remainingtime = datetime.convertSecondsToHMS(remainingtime);
    tokenmetrics.time = datetime.getDateTime(Date.now());
    return tokenmetrics;
};

//-----------------------------------------------------------------------------------
// passport initialization stuff
// jwt strategy
// This verifies that the token sent by the user is valid
//-----------------------------------------------------------------------------------
passport.use('jwt', new JwtStrategy(jwtOptions,
    (token, done) => {
        try {
            UserModel.findById(token.id, (err, loggeduser) => {
                if(loggeduser.lastlogout === null) {
                    return done(null, token);
                }
                else {
                    done();
                }
            });
        }
        catch(error) {
            done(error);
        }
    }
));
//-----------------------------------------------------------------------------------
// passport initialization stuff
// Local strategy for user  / password authentication
// Accounts stored in mongo
//-----------------------------------------------------------------------------------
passport.use('login',  new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true,        // Used to access the client IP in case of bad password
    }, 
    (req, email, password, done) => {
        UserModel.getUserByEmail(email, (err, loggeduser) => {
            if(err) { return done(err); }
            if ( !loggeduser ) { 
                let userlog = new userlogger(email, undefined, helpers.getIP(req));
                userlog.error('Unknown user : ' + email);
                return done(null, false, {message: 'Unknown User'}) 
            }
            UserModel.comparePassword(password, loggeduser.password, (error, isMatch ) => {
                if (isMatch) {
                    logger.debug(Version + email + ' identified');
                    loggeduser.lastlogin = Date.now();
                    loggeduser.lastlogout = null;
                    loggeduser.save((error, user) => {
                        if (error) {
                            logger.error(Version + 'Cannot save last login date')
                        }
                    });
                    return done(null, loggeduser)   // Success login !!!
                }
                let userlog = new userlogger(email, loggeduser.id, helpers.getIP(req));
                userlog.error('Invalid password for ' + email);
                return done( null, false, {message: 'Wrong password'} ); // Error
            });
        });
    }
));

//-----------------------------------------------------------------------------------
// Utility routines for passport
//-----------------------------------------------------------------------------------
passport.serializeUser((loggeduser, done) => {
    // logger.debug(Version + JSON.stringify(loggeduser));
    done(null, loggeduser.id);
});

passport.deserializeUser((id, done) => { 
    // logger.debug(Version + 'deserializeUser with ID : ' + id);
    UserModel.findById(id, (err, loggeduser) => {
        done(err, loggeduser);
    });
});


