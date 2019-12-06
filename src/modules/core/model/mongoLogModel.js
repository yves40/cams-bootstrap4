//----------------------------------------------------------------------------
//    mongoLogModel.js
//
//    Mar 24 2019   Initial
//    Mar 27 2019   Add fields
//    Nov 27 2019   Get service in cams-bootstrap4 project
//    Dec 06 2019   Add fields
//----------------------------------------------------------------------------
const Version = 'mongoLogModel:1.05, Dec 06 2019 ';

const mongoose = require('mongoose');
const schema = mongoose.Schema;

const mongologSchema = new schema(
    {
        module: String,
        category: String,   // USER, SERVER, anything you want
        email: String,      // optional for user related events
        message: String,
        timestamp: Date,
        severity: String,   // The classical DIWEF from log4j
    }
);
const Mongolog = mongoose.model("mongolog", mongologSchema);
module.exports = Mongolog;
