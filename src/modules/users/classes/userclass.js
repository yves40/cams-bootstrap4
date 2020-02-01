//----------------------------------------------------------------------------
//    userclass.js
//
//    Apr 24 2019   Initial
//    Apr 26 2019   Some work on methods
//    May 07 2019   Update Message
//    May 08 2019   WIP on async 
//                  Update user
//                  Create user
//    May 10 2019   Properly manage delete message when user does not exist 
//    May 15 2019   1st tests in the WEB app
//    Oct 27 2019   Integrate cams-bootstrap4
//    Oct 28 2019   Reorg
//    Nov 03 2019   Use the class now from userStore
//                  Fix some problems with OOP 
//    Nov 08 2019   Profilecode is now an array of strings
//                  Fix architectural design flaws:1
//    Nov 09 2019   Fix architectural design flaws:2
//    Nov 11 2019   Fix architectural design flaws:3
//    Nov 12 2019   Fix architectural design flaws:4
//    Nov 13 2019   Fix architectural design flaws:5
//    Nov 15 2019   Add method(s)
//    Nov 19 2019   New mongoose usage
//    Nov 20 2019   WIP on code simplification. Shoot obsolete code
//    Nov 22 2019   Update method reviewed
//    Nov 23 2019   Update method changed
//    Nov 24 2019   Filter on list users
//    Dec 17 2019   WIP on user update
//    Dec 18 2019   WIP on user update, check mongo action
//    Dec 19 2019   WIP on user update, change call to a sync one
//    Dec 20 2019   get method properly returns the profiles array 
//    Dec 31 2019   Modify Add user handler
//    Jan 16 2020   Log message on user not found on the get accessor
//    Jan 17 2020   WIP on users lists
//    Jan 19 2020   WIP on users lists ; 1
//    Jan 26 2020   WIP on users updates including privs
//    Feb 01 2020   Remove : mongo.getMongoDBConnection();
//----------------------------------------------------------------------------
const UserModel = require('../model/userModel').UserModel
const bcryptjs = require('bcryptjs');
const logger = require('../../core/services/logger');
const datetime = require('../../core/services/datetime');
const mongo = require ('../../core/services/mongodb');

const objectid = require('mongodb').ObjectId;

const validprofiles = [ "STD", "USERADMIN", "CAMADMIN", "SUPERADMIN" ];

// mongo.getMongoDBConnection();

module.exports = class userclass {

    constructor (
            email = "dummy@free.fr",
            name = "Unknown",
            password = "nothingspecial",
            profilecode = undefined,
            description = "None",
        ) 
    {
        this.Version = 'userclass:1.96, Jan 26 2020 ';
        this.model = new UserModel({ 
                            name: name, 
                            email: email, 
                            password: hashPassword(password),
                            profilecode: profilecode === undefined ? getValidProfile("STD"): profilecode,
                            description: description, 
                            lastlogin: null, 
                            lastlogout: null,
                            created: null,
                            updated: null,
                        }) ;
    }

    // getters
    getVersion() { return this.Version; }
    getemail() {return this.model.email;}
    getname() { return this.model.name; }
    getpassword() { return this.model.password; }
    getprofilecode() { return this.model.profilecode; }
    getdescription() { return this.model.description; }
    //------------------------------------------------------
    // Read user info from Mongo, based on mail
    // If no email transmitted, take the one from the object
    // Returns a promise
    //------------------------------------------------------
    get(email = this.model.email) { 
        return new Promise((resolve, reject) => { 
            UserModel.findOne( { email: email }, (err, found) => { 
                if(err) reject (err);
                if(found) {
                    this.model._id = found._id;
                    this.model.name =  found.name;
                    this.model.email = found.email;
                    this.model.password = found.password;
                    this.model.profilecode = found.profilecode;
                    this.model.description = found.description;
                    this.model.lastlogin = datetime.convertDateTime(found.lastlogin) ;
                    this.model.lastlogout = datetime.convertDateTime(found.lastlogout);
                    this.model.created = datetime.convertDateTime(found.created);
                    this.model.updated= datetime.convertDateTime(found.updated);
                    resolve({ status: true, message: 'User read from mongo' });
                }
                else {
                    reject( { status: false, message: this.Version + 'User not found' });
                }
            });
        })    
    }
    //-----------------------------------------------------------------------------------
    // Get a user by ID. Used by jwt
    //-----------------------------------------------------------------------------------
    getByID(ID, callback) {
        UserModel.findById({ _id: objectid(ID)}, callback);
    };    
    //------------------------------------------------------
    // Check a user existence
    //------------------------------------------------------
    exists(email = this.model.email) { 
        return new Promise( (resolve, reject) => { 
            UserModel.findOne( { email: email }, (err, found) => { 
                if(err) reject (err);
                if(found) {
                    resolve({ status: true, message: 'The user is  found : ' + found.name});
                }
                else {
                    resolve({status: false, message: 'The user is not found'});
                }
            });    
        })
    }
    // setters
    setname(name) { this.model.name = name; }
    setemail(email) { this.model.email = email; }
    setpassword(password) { this.model.password =  hashPassword(password);}
    setprofilecode(profilecode) { this.model.profilecode = profilecode;  }
    setdescription(description) { this.model.description = description;  }

    //-------------------------------------
    // Add a user
    // ASYNC can be true of false ( for batch job useradmin )
    // Default is ASYNC
    // Returns a promise
    //-------------------------------------
    Add() {
        return new Promise( (resolve, reject) => {
            /* 
                Check user does not exist yet
            */
           UserModel.find( { email: this.model.email }, (err, found) => {
                if (err) {
                    reject(err);
                } 
                if (found.length !== 0) {
                    reject('User ' + this.model.email + ' already exist')
                }
                else {
                    this.model.created = Date.now();
                    this.model.save(this.model, (err, inserteduser) => {
                        if (err){
                            reject(err);
                        } 
                        else {
                            resolve('User ' + inserteduser.email + ' registered');
                        }
                    });
                }
            })
        })
    }
    //-------------------------------------
    // Remove this user, using email
    // Returns a promise
    //-------------------------------------
    Delete() 
    {
        return new Promise((resolve, reject) => {
            UserModel.findOneAndRemove( {email: this.model.email},
                (err, userupdated) => {
                    if (err) reject(err);
                    else {
                        if (userupdated === null) {
                            resolve(this.model.email + ' does not exists');
                        }
                        else {
                            resolve('User ' + this.model.email + ' deleted');
                        }
                    } 
                });
        })
    }

    //------------------------------------------------------
    // Get a user object and update it, except the password and 
    // profile, login / logout dates
    // Returns a promise
    //------------------------------------------------------
    Update() 
    {
        return new Promise((resolve, reject) => {
            UserModel.findOneAndUpdate( {email: this.model.email}, 
                { $set: {
                            name: this.model.name,
                            description : this.model.description,
                            profilecode: this.model.profilecode,
                        },
                        updated: Date.now(),
                },
                { upsert: false, new: true }, // Do not update a non existing user
                (err, userupdated) => {
                    if (err) reject(err);
                    else{
                        if(userupdated === null) {
                            resolve('User ' + this.model.email + ' does not exist');
                        }
                        else {
                            resolve('User ' + userupdated.email + ' updated');
                        }
                    }
                }
            );
        })
    }
    //------------------------------------------------------
    // Get a user object and update login / logout dates
    // Returns a promise
    //------------------------------------------------------
    UpdateConnection() {
        return new Promise((resolve, reject) => {
            UserModel.findOneAndUpdate( {email: this.model.email}, 
                { 
                    lastlogin: this.model.lastlogin,
                    lastlogout: this.model.lastlogout,
                    updated: Date.now(),
 
                },
                { upsert: false, new: true }, // Do not update a non existing user
                (err, userupdated) => {
                    if (err) reject(err);
                    else{
                        if(userupdated === null) {
                            resolve('User ' + this.model.email + ' does not exist');
                        }
                        else {
                            resolve('User ' + userupdated.email + ' updated');
                        }
                    }
                }
            );
        })
    }
    //-------------------------------------
    // MULTI USER METHODS
    //-------------------------------------
    // List all or some user(s)
    // Returns a promise
    //-------------------------------------
    listUsers(filter = '') {
        return new Promise((resolve, reject) => {
            (async () => {
                let query = UserModel.find({});
                query.select().where( { 'email': { '$regex' : filter, '$options' : 'i' }});
                await query.exec(function(err, userlist) {

                        if (err !== null) { 
                            reject(err);
                        }
                        if(userlist.length === 0) {
                            reject("No user in the DB");
                        }
                        else {
                            resolve(userlist);
                        }
                    }
                )
            })();
        });
    }
    //-------------------------------------
    // List all user(s) : emails and IDs
    //-------------------------------------
    listUsersEmailsIds() {
        return new Promise((resolve, reject) => {
            (async () => {
                await UserModel.find({}, 'email _id', (function(err, userlist) {
                        if (err) { 
                            reject(err);
                        }
                        if(userlist.length === 0) {
                            reject("No user in the DB");
                        }
                        else {
                            resolve(userlist);
                        }
                    })
                )
            })();
        });
    }
    //-------------------------------------
    // List all user(s) : get the requested attributes
    //-------------------------------------
    listUsersRequestedAttributes(attrlist = "_id email name", filter = '') {
        return new Promise((resolve, reject) => {
            (async () => {
                let query = UserModel.find({}, attrlist);
                query.select().where( { 'email': { '$regex' : filter, '$options' : 'i' }}).sort( { email: 1});
                
                await query.exec(function(err, userlist) {
                        if (err) { 
                            reject(err);
                        }
                        if(userlist.length === 0) {
                            resolve( {message: "No user in the DB", data: [] });
                        }
                        else {
                            resolve({message: userlist.length + ' user(s) found', data: userlist});
                        }
                    })
            })();
        });
    }
    //-------------------------------------
    // List all user(s) : emails and IDs and names
    //-------------------------------------
    listUsersEmailsIdsNames() {
        return new Promise((resolve, reject) => {
            (async () => {
                await UserModel.find({}, 'email _id name', (function(err, userlist) {
                        if (err) { 
                            reject(err);
                        }
                        if(userlist.length === 0) {
                            reject("No user in the DB");
                        }
                        else {
                            resolve(userlist);
                        }
                    })
                )
            })();
        });
    }
    //-----------------------------------------------------------------------------------
    // Delete all users
    // Returns a promise
    //-----------------------------------------------------------------------------------
    DeleteAll()  {
        return new Promise((resolve, reject) => {
            UserModel.deleteMany({})
                .then(result => resolve(`Deleted ${result.deletedCount} item(s).`))
                .catch(err => reject(`Delete failed with error: ${err}`))            
        })
    }
    //-----------------------------------------------------------------------------------
    // Password checking
    //-----------------------------------------------------------------------------------
    comparePassword(candidatePassword, hash, callback) {
        bcryptjs.compare(candidatePassword, hash, (err, isMatch) => {
            if (err) throw err;
            callback(null, isMatch);
        });
    };
}

//----------------------------------------------------------------------------
// Private 
// Beware, these functions don't  have access to 'this'
//----------------------------------------------------------------------------
function hashPassword(password) {
    let salt = bcryptjs.genSaltSync(10);
    let hash = bcryptjs.hashSync(password, salt);
    return hash;
}


//-----------------------------------------------------------------------------------
// get and check user profile
//-----------------------------------------------------------------------------------
function getValidProfile(profcode) {
    let profile = validprofiles.find(  (prof) => prof === profcode );
    return profile !== undefined ? profile : validprofiles[0];
}

//----------------------------------------------------------------------------
// C O D E    R E S E R V O I R
//----------------------------------------------------------------------------
