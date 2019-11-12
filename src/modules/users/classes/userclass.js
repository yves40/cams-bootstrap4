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
//----------------------------------------------------------------------------
const UserModel = require('../model/userModel').UserModel
const bcryptjs = require('bcryptjs');
const logger = require('../../core/services/logger');

const validprofiles = [ "STD", "USERADMIN", "CAMADMIN", "SUPERADMIN" ];

module.exports = class userclass {
    constructor (
            email = "dummy@free.fr",
            name = "Unknown",
            password = "nothingspecial",
            description = "None",
        ) 
    {
        this.Version = 'userclass:1.55, Nov 12 2019 ';
        this.model = new UserModel({ name: name, email: email, password: hashPassword(password),
                            description: description, lastlogin: null, lastlogout: null,
                            created: null}) ;
        this.email = email;
        this.name = name;
        this.password = hashPassword(password);
        this.profilecode = getValidProfile("STD");
        this.description = description;
        this.lastlogin = null;
        this.lastlogout = null;
    }

    // Setters & getters
    getVersion() { return this.Version; }
    setemail(email) { this.model.email = email; }
    getemail() {return this.model.email;}
    setname(name) { this.model.name = name; }
    getname() { return this.model.name; }
    setpassword(password) { this.model.password =  hashPassword(password);}
    getpassword() { return this.model.password; }
    setprofilecode(profilecode) { this.model.profilecode = profilecode;  }
    getprofilecode() { return this.model.profilecode; }
    setdescription(description) { this.model.description = description;  }
    getdescription() { return this.model.description; }   

    //-------------------------------------
    // Get a user object and save it
    // ASYNC can be true of false ( for batch job useradmin )
    //  Default is ASYNC
    //-------------------------------------
    S_createUser(user) {
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
    createUser(user, ASYNC = true ) {
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
    //-------------------------------------
    // Get a user object and save it
    // ASYNC can be true of false ( for batch job useradmin )
    //  Default is ASYNC
    //-------------------------------------
    Add(ASYNC = true ) {
        return new Promise( (resolve, reject) => {
            /* 
                Check user does not exist yet
            */
           UserModel.find( { email: this.email }, (err, found) => {
                if (err) {
                    reject(err);
                } 
                else {
                    if (found.length !== 0) reject('User ' + user.email + ' already exist')
                    else {
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
    //-------------------------------------
    // Remove this user
    //-------------------------------------
    removeUser(ASYNC = true) {
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
    //-------------------------------------
    // Get a user object and update it
    //-------------------------------------
    updateUser(jsonuser) {
        return new Promise((resolve, reject) => {
            this.model.email = jsonuser.email;
            this.model.name = jsonuser.name;
            this.model.password = hashPassword(jsonuser.password);
            this.model.profilecode = jsonuser.profilecode;
            this.model.description = jsonuser.description;
            UserModel.findOneAndUpdate( {email: this.model.email}, 
                {
                    email: this.model.email,
                    name: this.model.name,
                    password: this.model.password,
                    profilecode: this.model.profilecode,
                    description: this.model.description,
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
    // List user(s)
    //-------------------------------------
    listUsers() {
        return new Promise((resolve, reject) => {
            (async () => {
                await UserModel.find({}, (function(err, userlist) {
                        if (err) { 
                            logger.debug(err);
                            reject({});
                        }
                        if(userlist.length === 0) {
                            reject({});
                        }
                        else {
                            resolve(userlist);
                        }
                    })
                )
            })();
        });
    }    //-----------------------------------------------------------------------------------
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
