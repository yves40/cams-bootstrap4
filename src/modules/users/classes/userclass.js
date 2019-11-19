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
//----------------------------------------------------------------------------
const UserModel = require('../model/userModel').UserModel
const bcryptjs = require('bcryptjs');
const logger = require('../../core/services/logger');
const datetime = require('../../core/services/datetime');

const validprofiles = [ "STD", "USERADMIN", "CAMADMIN", "SUPERADMIN" ];

module.exports = class userclass {

    constructor (
            email = "dummy@free.fr",
            name = "Unknown",
            password = "nothingspecial",
            profilecode = undefined,
            description = "None",
        ) 
    {
        this.Version = 'userclass:1.74, Nov 13 2019 ';
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
                    const usermetrics =  {
                        name: found.name, 
                        email: found.email, 
                        password: found.password,
                        profilecode: Array.toString(found.profilecode),
                        description: found.description, 
                        lastlogin: datetime.convertDateTime(found.lastlogin) , 
                        lastlogout: datetime.convertDateTime(found.lastlogout),
                        created: datetime.convertDateTime(found.created),
                        updated: datetime.convertDateTime(found.updated),
                    }
                    resolve(usermetrics);
                }
                else {
                    reject('User not found');
                }
            });
        })
    }
    //------------------------------------------------------
    // Check a user existence
    //------------------------------------------------------
    Exists(email = this.model.email) { 
        return new Promise((resolve, reject) => { 
            UserModel.findOne( { email: email }, (err, found) => { 
                console.log("Check user existence : result :" + found)
                if(err) reject (err);
                if(found) {
                    resolve(true);
                }
                else {
                    reject(false);
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
           UserModel.find( { email: this.email }, (err, found) => {
                if (err) {
                    reject(err);
                } 
                if (found.length !== 0) reject('User ' + user.email + ' already exist')
                this.model.created = Date.now();
                this.model.save(this.model, (err, inserteduser) => {
                    if (err){
                        logger.debug(this.Version + 'Error here');
                        reject(err);
                    } 
                    else {
                        resolve('User ' + inserteduser.email + ' created');
                    }
                });
            })
        })
    }
    //-------------------------------------
    // Remove this user
    // Returns a promise
    //-------------------------------------
    Delete(ASYNC = true) {
        return new Promise((resolve, reject) => {
            if (ASYNC) {
                UserModel.findOneAndRemove( {email: this.model.email},
                    (err, userupdated) => {
                        if (err) reject(err);
                        else {
                            if (userupdated === null)
                                resolve(this.model.email + ' does not exists');
                            else
                                resolve('User ' + this.model.email + ' deleted');
                        } 
                    });
            }
            else {
                (async () => {
                    UserModel.findOneAndRemove( {email: this.model.email},
                        (err, userupdated) => {
                            if (err) reject(err);
                            else {
                                if (userupdated === null)
                                    resolve(this.model.email + ' does not exists');
                                else
                                    resolve('User ' + this.model.email + ' deleted');
                            } 
                        });
                })();                    
            }
        });
    }

    //------------------------------------------------------
    // Get a user object and update it, except the password
    // Returns a promise
    //------------------------------------------------------
    Update() {
        return new Promise((resolve, reject) => {
            UserModel.findOneAndUpdate( {email: this.model.email}, 
                {
                    email: this.model.email,
                    name: this.model.name,
                    profilecode: this.model.profilecode,
                    description: this.model.description,
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
    // MULTI USER METHODES
    //-------------------------------------
    // List user(s)
    // Returns a promise
    //-------------------------------------
    listUsers() {
        return new Promise((resolve, reject) => {
            (async () => {
                await UserModel.find({}, (function(err, userlist) {
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
//-------------------------------------
// Get a user object and save it
// ASYNC can be true of false ( for batch job useradmin )
//  Default is ASYNC
//-------------------------------------
function S_createUser(user) {
    UserModel.find( { email: user.email }, (err, found) => {
        if (err) {
            console.log(err);
            throw new Error(err);
        } 
        else {
            if (found.length !== 0) throw new Error('User ' + user.email + ' already exist')
            else {
                this.model.email = user.email;
                this.model.name = user.name;
                this.model.password = hashPassword(user.password);
                this.model.profilecode = user.profilecode;
                this.model.description = user.description;
                this.model.save(this.model, (err, inserteduser) => {
                    if (err){
                        throw new Error(err);
                    } 
                    else {
                        logger.debug('User ' + inserteduser.email + ' created');
                        return 'OK';
                    }
                });
            }
        }
    })
}
//-------------------------------------
// Get a user object and save it
// ASYNC can be true of false ( for batch job useradmin )
//  Default is ASYNC
//-------------------------------------
function createUser(user, ASYNC = true ) {
    return new Promise( (resolve, reject) => {
        /* 
            Check user does not exist yet
        */
        UserModel.find( { email: user.email }, (err, found) => {
            if (err) {
                reject(err);
            } 
            else {
                if (found.length !== 0) reject('User ' + user.email + ' already exist')
                else {
                    this.model.email = user.email;
                    this.model.name = user.name;
                    this.model.password = hashPassword(user.password);
                    this.model.profilecode = user.profilecode;
                    this.model.description = user.description;
                    if (ASYNC) {
                        this.model.save(this.model, (err, inserteduser) => {
                            logger.debug(this.Version + 'ASYNC user creation');
                            if (err){
                                logger.debug(this.Version + 'Error here');
                                reject(err);
                            } 
                            else {
                                resolve('User ' + inserteduser.email + ' created');
                            }
                        });
                    }
                    else {  // SYNC mode, must wait before sending response
                        (async () => {
                            this;this.model.save(this.model, (err, inserteduser) => {
                                if (err){
                                    logger.debug(this.Version + 'Error here');
                                    reject(err);
                                } 
                                else {
                                    resolve('User ' + inserteduser.email + ' created');
                                }
                            });
                        })();    
                    }
                }
            }
        })
    })
}

function save(theobject) {
    theobject.User.save();
}

function update(theobject) {
    User.findOneAndUpdate( {email: theobject.User.email}, 
            {
                email: theobject.User.email,
                name: theobject.User.name,
                password: theobject.User.password,
                profilecode: theobject.User.profilecode,
                description: theobject.User.description,
            },
        (err, userupdated) => {
            if (err) console.log(err);
        });
}
function remove(usermail) {
    User.findOneAndRemove( {email: usermail},
        (err, userupdated) => {
            if (err) console.log(err);
        });
}
//----------------------------------------------------------------------------
// Super sleep function ;-)
// Must be called from an ASYNC function
//----------------------------------------------------------------------------
sleep = function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
