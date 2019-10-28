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
//    Oct 27 2019    Integrate cams-bootstrap4
//    Oct 28 2019    Reorg
//----------------------------------------------------------------------------

const User = require('../model/userModel');
const bcryptjs = require('bcryptjs');
const logger = require('../../core/services/logger');

module.exports = class user {
    constructor (usermail = "dummy@free.fr") {
        this.Version = 'userclass:1.36, Oct 28 2019 ';
        this.User = new(User);
        this.User.email = usermail;
    };

    // Setters & getters
    getVersion() { return this.Version; }
    getemail() {return this.User.email;}
    setname(name) { this.User.name = name; }
    getname() { return this.User.name; }
    setemail(email) { this.User.email = email; }
    getemail() { return this.User.email; }
    setpassword(password) { this.User.password =  hashPassword(password);;}
    getpassword() { return this.User.password; }
    setprofilecode(profilecode) { this.User.profilecode = profilecode;  }
    getprofilecode() { return this.User.profilecode; }
    setdescription(description) { this.User.description = description;  }
    getdescription() { return this.User.description; }   

    //-------------------------------------
    // Get a user object and save it
    // ASYNC can be true of false ( for batch job useradmin )
    //  Default is ASYNC
    //-------------------------------------
    S_createUser(user) {
        User.find( { email: user.email }, (err, found) => {
            if (err) {
                console.log(err);
                throw new Error(err);
            } 
            else {
                if (found.length !== 0) throw new Error('User ' + user.email + ' already exist')
                else {
                    this.User.email = user.email;
                    this.User.name = user.name;
                    this.User.password = hashPassword(user.password);
                    this.User.profilecode = user.profilecode;
                    this.User.description = user.description;
                    this.User.save(this.User, (err, inserteduser) => {
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
           User.find( { email: user.email }, (err, found) => {
                if (err) {
                    reject(err);
                } 
                else {
                    if (found.length !== 0) reject('User ' + user.email + ' already exist')
                    else {
                        this.User.email = user.email;
                        this.User.name = user.name;
                        this.User.password = hashPassword(user.password);
                        this.User.profilecode = user.profilecode;
                        this.User.description = user.description;
                        if (ASYNC) {
                            this.User.save(this.User, (err, inserteduser) => {
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
                                this.User.save(this.User, (err, inserteduser) => {
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
                User.findOneAndRemove( {email: this.User.email},
                    (err, userupdated) => {
                        if (err) reject(err);
                        else {
                            if (userupdated === null)
                                resolve(this.User.email + ' does not exists');
                            else
                                resolve('User ' + this.User.email + ' deleted');
                        } 
                    });
            }
            else {
                (async () => {
                    User.findOneAndRemove( {email: this.User.email},
                        (err, userupdated) => {
                            if (err) reject(err);
                            else {
                                if (userupdated === null)
                                    resolve(this.User.email + ' does not exists');
                                else
                                    resolve('User ' + this.User.email + ' deleted');
                            } 
                        });
                })();                    
            }
        });
    }
    //-------------------------------------
    // Get a user object and update it
    //-------------------------------------
    updateUser(user) {
        return new Promise((resolve, reject) => {
            this.User.email = user.email;
            this.User.name = user.name;
            this.User.password = hashPassword(user.password);
            this.User.profilecode = user.profilecode;
            this.User.description = user.description;
            User.findOneAndUpdate( {email: this.User.email}, 
                {
                    email: this.User.email,
                    name: this.User.name,
                    password: this.User.password,
                    profilecode: this.User.profilecode,
                    description: this.User.description,
                },
                { upsert: false, new: true }, // Do not update a non existing user
                (err, userupdated) => {
                    if (err) reject(err);
                    else{
                        if(userupdated === null) {
                            resolve('User ' + this.User.email + ' does not exist');
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
    listUser() {
        return new Promise((resolve, reject) => {
            let querylog = User.find({});
            (async () => {
                await querylog.exec(function(err, userlist) {
                    if (err) console.log(err);
                    if(userlist.length === 0) {
                        reject({});
                    }
                    else {
                        resolve(userlist);
                    }
                });
            })();
        });
    }
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
