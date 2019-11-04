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
//----------------------------------------------------------------------------

const UserModel = require('../model/userModel').UserModel;    // Mongoose stuff
const bcryptjs = require('bcryptjs');
const logger = require('../../core/services/logger');

module.exports = class user {
    constructor (usermail = "dummy@free.fr") {
        this.Version = 'userclass:1.42, Nov 04 2019 ';
        this.model = new(UserModel);
        this.model.email = usermail;
        this.model.name = 'Not logged';
        this.model.password = '';
        this.model.profilecode = UserModel.STDUSER;
        this.model.description = '';
        this.model.lastlogin = null;
        this.model.lastlogout = null;
    };

    // Setters & getters
    getVersion() { return this.Version; }
    setemail(email) { this.model.email = email; }
    getemail() {return this.model.email;}
    setname(name) { this.model.name = name; }
    getname() { return this.model.name; }
    setpassword(password) { this.model.password =  hashPassword(password);;}
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
    listUser() {
        return new Promise((resolve, reject) => {
            let querylog = UserModel.find({});
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
