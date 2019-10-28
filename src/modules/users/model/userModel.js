//----------------------------------------------------------------------------
//    userModel.js
//
//    Nov 10 2018   Initial
//    Nov 11 2018   Add a delete all users method + some others
//    Nov 21 2018   Get a user by email
//    Dec 03 2018   Add a local user strategy
//    Jan 17 2019   Transfered to the CAMS project
//    Jan 22 2019   Add a user profile
//    Jan 25 2019   Add getUserByID()
//    Feb 06 2019   Some mongodb reorg
//    Feb 07 2019   Mongo switch to cams DB
//    Feb 08 2019   Normalize version
//                  Add a description
//    Mar 06 2019   console.log replaced by logger
//    Mar 13 2019   BUG: Was disabling the logger console
//    Mar 23 2019   Login / logout properties
//    Oct 27 2019    Integrate cams-bootstrap4
//    Oct 28 2019    Reorg
//----------------------------------------------------------------------------
const Version = 'userModel:1.36, Oct 28 2019 ';

const objectid = require('mongodb').ObjectId;
const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
const STDUSER = 0;
const ADMINUSER = 100;
const CAMADMIN = 50;
const logger = require('../../core/services/logger');

const schema = mongoose.Schema;

const userschema = new schema(
    {
        name: String,
        email: String,
        password: String,
        profilecode: STDUSER,
        description: String,
        lastlogin: Date,
        lastlogout: Date,
    }
);
const User = mongoose.model("camsusers", userschema);

module.exports = User;

//-----------------------------------------------------------------------------------
// Create a user
//-----------------------------------------------------------------------------------
module.exports.createUser = (newuser, callback) => {
    bcryptjs.genSalt(10, (err, salt) => {
        bcryptjs.hash(newuser.password, salt, (error, hash) => {
            // Store the hashed password
            const newuseresource = newuser;
            newuseresource.profilecode = newuser.profilecode;
            newuseresource.description = newuser.description;
            newuseresource.password = hash;
            newuseresource.lastlogin = null;
            newuseresource.lastlogout = null;
            newuseresource.save(callback);
        });
    });
};

//-----------------------------------------------------------------------------------
// List users
//-----------------------------------------------------------------------------------
module.exports.listUsers = (callback) => {
    User.find({}, 'name email password profilecode', callback); 
};

//-----------------------------------------------------------------------------------
// Get a user by ID
//-----------------------------------------------------------------------------------
module.exports.getUserByID = (ID, callback) => {
    // User.collection.findOne({ "_id": objectid(ID) }, callback);
    User.findById(ID, callback);
};

//-----------------------------------------------------------------------------------
// Get a user by email
//-----------------------------------------------------------------------------------
module.exports.getUserByEmail = (email, callback) => {
    const query = { email };
    User.findOne(query, callback);
};


//-----------------------------------------------------------------------------------
// Password checking
//-----------------------------------------------------------------------------------
module.exports.comparePassword = (candidatePassword, hash, callback) => {
    bcryptjs.compare(candidatePassword, hash, (err, isMatch) => {
        if (err) throw err;
        callback(null, isMatch);
    });
};

//-----------------------------------------------------------------------------------
// Delete one user with its ID
//-----------------------------------------------------------------------------------
module.exports.deleteoneUserByID = (id, callback) => {
    try {
        User.collection.deleteOne( { "_id": objectid(id) }, callback );
    }
    catch(e) {
        logger.error(e);
    }
};

//-----------------------------------------------------------------------------------
// Delete one user with its name
//-----------------------------------------------------------------------------------
module.exports.deleteoneUserByName = (name, callback) => {
    try {
        User.collection.deleteOne( { "name":  name }, callback );
    }
    catch(e) {
        logger.error(e);
    }
};

//-----------------------------------------------------------------------------------
// Delete all users
//-----------------------------------------------------------------------------------
module.exports.deleteallUsers = (callback) => {
    // User.collection.remove(callback);
    User.collection.deleteMany(callback);
};

