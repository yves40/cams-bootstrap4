//----------------------------------------------------------------------------
//    jwthelper.js
//
//    Nov 05 2019   Initial : from auth.js
//----------------------------------------------------------------------------
const Version = 'jwthelper.js:1.00, Nov 05 2019 ';

const jwtconfig = require('../../core/services/properties').jwtconfig;
const logger = require('../../core/services/logger');
const datetime = require('../../core/services/datetime');
const helpers = require('../../core/services/helpers');

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
function signToken(payload) {
    logger.debug(Version + 'signing the token with a ' + tokenexpirationdelay + ' seconds expiration time');
    const token = jwt.sign(payload, jwtOptions.secretOrKey, {expiresIn: tokenexpirationdelay}); // 30 mn
    return token;
};

//-----------------------------------------------------------------------------------
// Invalidate a token during logout
//-----------------------------------------------------------------------------------
function invalidateToken(payload) {
    logger.debug(Version + 'Update logout time for ID ' + payload.id)
    UserModel.getUserByID(payload.id, (err, loggeduser) => {
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
function decodeToken(thetoken) {
    return jwt.decode(thetoken, jwtconfig.jwtSecret);
};

//-----------------------------------------------------------------------------------
// get token time characteristics
//-----------------------------------------------------------------------------------
function getTokenTimeMetrics(thetoken) {
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
            UserModel.getUserByID(token.id, (err, loggeduser) => {
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
    UserModel.getUserByID(id, (err, loggeduser) => {
        done(err, loggeduser);
    });
});


