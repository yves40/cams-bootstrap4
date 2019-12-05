//----------------------------------------------------------------------------
//    jwthelper.js
//
//    Nov 05 2019   Initial : from auth.js : security modules reorg
//    Nov 29 2019   Externalize session duration time
//    Nov 30 2019   Add a raw remainingtime value for session
//    Dec 05 2019   Verify token method
//----------------------------------------------------------------------------
const Version = 'jwthelper.js:1.04, Dec 05 2019 ';

const logger = require('../../core/services/logger');
const datetime = require('../../core/services/datetime');
const jwtconfig = require('../../core/services/properties').jwtconfig;

const jwt = require('jsonwebtoken');
const passportJWT = require('passport-jwt');
const ExtractJwt = passportJWT.ExtractJwt;

const tokenexpirationdelay = require('../../core/services/properties').tokenexpirationdelay;

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
// Decode a token
//-----------------------------------------------------------------------------------
function decodeToken(thetoken) {
    return jwt.decode(thetoken, jwtconfig.jwtSecret);
};

//-----------------------------------------------------------------------------------
// Verify a token, decode the token and checks the signature
//-----------------------------------------------------------------------------------
function verifyToken(thetoken) {
    return jwt.verify(thetoken, jwtconfig.jwtSecret);
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
    tokenmetrics.remainingtimeraw = remainingtime;
    tokenmetrics.time = datetime.getDateTime(Date.now());
    return tokenmetrics;
};

module.exports = {
    getTokenTimeMetrics,
    decodeToken,
    verifyToken,
    signToken,
}

