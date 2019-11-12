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
//    Oct 27 2019   Integrate cams-bootstrap4
//    Oct 28 2019   Reorg
//    Nov 03 2019   Change module declaration, export constants
//    Nov 04 2019   Problem with declarations
//    Nov 07 2019   Delete user by email
//    Nov 08 2019   profilecode is now an array of strings
//                  Fix architectural design flaws:1
//    Nov 09 2019   Fix architectural design flaws:2
//    Nov 11 2019   Fix architectural design flaws:3
//----------------------------------------------------------------------------
const Version = 'userModel:1.46, Nov 11 2019 ';

const objectid = require('mongodb').ObjectId;
const mongoose = require('mongoose');
const logger = require('../../core/services/logger');

const schema = mongoose.Schema;

const userschema = new schema(
    {
        name: String,
        email: String,
        password: String,
        profilecode: [ String ],
        description: String,
        lastlogin: Date,
        lastlogout: Date,
        created: Date,
    }
);
const UserModel = mongoose.model("camsusers", userschema);

//-----------------------------------------------------------------------------------
// Create a user
//-----------------------------------------------------------------------------------
function createUser(newuser, callback) {
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
function listUsers(callback) {
    UserModel.find({}, 'name email password profilecode', callback); 
};

//-----------------------------------------------------------------------------------
// Get a user by ID
//-----------------------------------------------------------------------------------
function getUserByID(ID, callback) {
    // User.collection.findOne({ "_id": objectid(ID) }, callback);
    UserModel.findById(ID, callback);
};

//-----------------------------------------------------------------------------------
// Get a user by email
//-----------------------------------------------------------------------------------
function getUserByEmail(email, callback) {
    const query = { email };
    UserModel.findOne(query, callback);
};

//-----------------------------------------------------------------------------------
// Delete one user with its ID
//-----------------------------------------------------------------------------------
function deleteoneUserByID (id, callback) {
    try {
        UserModel.collection.deleteOne( { "_id": objectid(id) }, callback );
    }
    catch(e) {
        logger.error(e);
    }
};

//-----------------------------------------------------------------------------------
// Delete one user with its email
//-----------------------------------------------------------------------------------
function deleteoneUserByEmail (email, callback) {
    try {
        UserModel.collection.deleteOne( { "email":  email }, callback );
    }
    catch(e) {
        logger.error(e);
    }
};

//-----------------------------------------------------------------------------------
// Delete all users
//-----------------------------------------------------------------------------------
function deleteallUsers  (callback)  {
    UserModel.collection.deleteMany(callback);
};


module.exports = { 
    UserModel,
    userschema,
}
