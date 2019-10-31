//----------------------------------------------------------------------------
//    helpers.js
//
//    Oct 29 2019   Initial
//    Oct 31 2019   basic syntax error
//----------------------------------------------------------------------------
const Version = "helpers:1.01, Oct 29 2019 ";


//----------------------------------------------------------------------------
// Super sleep function ;-)
// Must be called from an ASYNC function
//----------------------------------------------------------------------------
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

//----------------------------------------------------------------------------
// Get IP from a request
//----------------------------------------------------------------------------
function getIP(req) {
    var ip = req.headers['x-forwarded-for'] || 
    req.connection.remoteAddress || 
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;
    return ip.replace(/f/gi, '').replace(/:/gi, '');
}

module.exports = {
    sleep,
    getIP,
}
