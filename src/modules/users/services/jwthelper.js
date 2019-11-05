//----------------------------------------------------------------------------
//    jwthelper.js
//
//    Nov 05 2019   Initial : from auth.js : security modules reorg
//----------------------------------------------------------------------------
const Version = 'jwthelper.js:1.02, Nov 05 2019 ';

const logger = require('../../core/services/logger');
const datetime = require('../../core/services/datetime');
const jwtconfig = require('../../core/services/properties').jwtconfig;

const jwt = require('jsonwebtoken');
const passportJWT = require('passport-jwt');
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

module.exports = {
    getTokenTimeMetrics,
    decodeToken,
    signToken,
}

