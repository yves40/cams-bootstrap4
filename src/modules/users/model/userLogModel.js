//----------------------------------------------------------------------------
//    userLogModel.js
//
//    Apr 03 2019  Initial
//    Apr 04 2019  Add client IP
//    Oct 31 2019  cams-bootstrap4 project
//    Nov 27 2019  No monger manage the client IP, it's a mess
//----------------------------------------------------------------------------
const Version = 'userLogModel:1.06, Nov 27 2019 ';

const mongoose = require('mongoose');

const schema = mongoose.Schema;

const userLogSchema = new schema(
    {
        userid: schema.ObjectId,
        email: String,
        action: String, // LOGIN, LOGOUT
        timestamp: Date,
        severity: String,
    }
);
const userLog = mongoose.model("userLog", userLogSchema);
module.exports = userLog;
