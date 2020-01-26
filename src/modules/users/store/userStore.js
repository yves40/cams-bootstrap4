/*----------------------------------------------------------------------------
    userstore.js    

    Oct 04 2019   Initial
    Oct 06 2019   Vuex tests
    Nov 01 2019   Start using the store and improve my Vuex knowledge
    Nov 02 2019   actions new syntax
    Nov 03 2019   router and axios calls
    Nov 04 2019   Manage the state after login
    Nov 05 2019   Some date format, logout action and mutation
    Nov 08 2019   Register 
    Nov 22 2019   Logout message 
    Nov 23 2019   Logout message : 2nd run!
    Nov 24 2019   getemail fixed
    Nov 29 2019   Remove some logging
    Nov 30 2019   WIP on tokentime expiration
    Dec 03 2019   WIP on tokentime expiration, manage expiration with a pre-alert
    Dec 06 2019   log session alerts and expiration in mongolog
    Dec 09 2019   user logs
    Dec 12 2019   user messages for session killed and session alert changed
    Dec 13 2019   Manage user logs queries severity param
    Dec 16 2019   Add filterbox, to select info type in logs
    Dec 17 2019   Manage filters when UI selects them
                  Add a user update action
    Dec 19 2019   Getter for user profiles codes
    Dec 20 2019   Getter for user profiles codes, Grrrrr
    Dec 21 2019   Delete mutation
    Dec 23 2019   Timeout when deleting user 
    Dec 26 2019   Log window management : refresh it when session soon expires
    Dec 27 2019   Log window management
    Dec 31 2019   Double user registration bug
    Jan 02 2020   Getters to check user privileges
    Jan 16 2020  Investigate error after deleting your account
    Jan 17 2020  Strange import suppressed
    Jan 26 2020  Now get user privileges from the UI
----------------------------------------------------------------------------*/
import Vue from 'vue';  
import Vuex from 'vuex';

const logger = require('../../core/services/logger');
const properties = require('../../core/services/properties');
const AXIOS = properties.axioscall;
const datetime = require('../../core/services/datetime')
const jwthelper = require('../services/jwthelper');

Vue.use(Vuex);

export default { 
    namespaced: true,
    /*----------------------------------------------------------------------------
        VUEX states
    ----------------------------------------------------------------------------*/
    state: {
        Version: 'userstore:2.05, Jan 26 2020 ',
        theuser: null,
        token: null,
        tokenobject: '{}',
        tokenvalidtime: null,
        tokenremainingtime: null,
        tokenremainingtimeraw: null,
        tokenalert: false,
        logrefresh: false,
        therouter: null,            // set on login logout to manage token time expiration
        userlogs: null,
        filterbox: [ '0', '1', '2', '3', '4'],
    },
    /*----------------------------------------------------------------------------
        VUEX Getters
    ----------------------------------------------------------------------------*/
    getters: {
        getVersion(state) {return state.Version;},
        getEmail(state) {return state.theuser === null ? 'Not logged' : state.theuser.model.email;},
        getName(state) {return state.theuser === null ? 'Not logged' : state.theuser.model.name;},
        getDescription(state) {return state.theuser === null ? 'Not logged' : state.theuser.model.description;},
        getLastlogin(state) {
            return state.theuser === null ? 'Not logged' : datetime.getDateTime(state.theuser.model.lastlogin);
        },
        getSessionTime(state) { return state.tokenremainingtime; },
        getSessionTimeRaw(state) { return state.tokenremainingtimeraw; },
        getTokenalert(state) { return state.tokenalert; },
        // Get a user logs
        getUserLogs(state) { return state.userlogs; },
        getFilters(state) { return state.filterbox; },
        getUserProfiles(state) {  
            if ( state.theuser !== null) {
                return state.theuser.model.profilecode === null ? [ 'NO PROFILE' ] : state.theuser.model.profilecode ; 
            }
        },
        isLogged(state) {return state.theuser === null ? false : true ;},
        //------------------------------------------------------
        // Check user profiles, returns a boolean
        // Valid profiles : 
        // [ "STD", "USERADMIN", "CAMADMIN", "SUPERADMIN" ];
        //------------------------------------------------------
        isUserAdmin(state) {
            if(state.theuser !== null) {
                return (state.theuser.model.profilecode.find(  (prof) => prof === 'USERADMIN' ) === 'USERADMIN' ? true : false);
            }
            else{ return false; }
        },
        isCamAdmin(state) {
            if(state.theuser !== null) {
                return (state.theuser.model.profilecode.find(  (prof) => prof === 'CAMADMIN' ) === 'CAMADMIN' ? true : false);
            }
            else{ return false; }
        },
        isSuperAdmin(state) {
            if(state.theuser !== null) {
                return (state.theuser.model.profilecode.find(  (prof) => prof === 'SUPERADMIN' ) === 'SUPERADMIN' ? true : false);
            }
            else{ return false; }
        },
    },
    /*----------------------------------------------------------------------------
        VUEX mutations
    ----------------------------------------------------------------------------*/
    mutations: { // Synchronous
        updateloginstate(state, payload) {
            state.theuser = payload.theuser;
            state.token = payload.token;
            state.tokenobject = jwthelper.verifyToken(payload.token);
            const tokendata = jwthelper.getTokenTimeMetrics(state.tokenobject);
            state.tokenremainingtime = tokendata.remainingtime;
            state.tokenremainingtimeraw = tokendata.remainingtimeraw;
        },
        updateuserlogs(state, severity = undefined) {
            if (severity === undefined) severity =  [ "0", "1", "2", "3", "4" ]; 
            properties.axioscall(
                {
                    method: 'post',
                    url: '/users/mylog',
                    headers: { 'Authorization': 'jwt ' + window.localStorage.getItem('jwt') },
                    data: {
                        "severity": severity,
                        "lineslimit": 40,     
                    }
                }
            )
            .then((response) => { 
                    state.userlogs = response.data; 
                    logger.debug(state.Version + 'Got ' + state.userlogs.length + ' log entries');
                },
            )
            .catch((error) => {
                    logger.error(state.Version + error);
                },
            );
        },
        deleteloginstate(state) {
            state.theuser = null;
            state.tokenalert = false;
            state.logrefresh = false;
        },
        update(state, payload) {
            state.theuser.model.name = payload.name;
            state.theuser.model.description = payload.description;
            state.theuser.model.profilecode = payload.privs; 
        },
        delete(state) {
            AXIOS(
                {
                    method: 'post',
                    url: '/users/delete/email',
                    headers: { 'Authorization': 'jwt ' + window.localStorage.getItem('jwt') },
                 }
            )
            .then((response) => {
                logger.debug(state.Version + response.data);
                }
            )
            .catch((error) => {
                logger.error(state.Version + error);
                }
            );
        },
        refreshtokentime(state) {
            if (state.theuser) {
                const decodedtoken = jwthelper.verifyToken(state.token);
                const tokendata = jwthelper.getTokenTimeMetrics(decodedtoken);
                state.tokenremainingtime = tokendata.remainingtime;
                state.tokenremainingtimeraw = tokendata.remainingtimeraw;
                // Session about to expire ?
                if (state.tokenremainingtimeraw < properties.tokenexpirationalert ) {
                    if(!state.tokenalert) {
                        properties.axioscall(
                            {
                                method: 'post',
                                url: '/users/messages',
                                headers: { 'Authorization': 'jwt ' + window.localStorage.getItem('jwt') },
                                data: {
                                    message: 'Session soon expired for user ' + state.theuser.model.email,
                                    severity: 'W',
                                },
                             }
                        )
                        .then((response) => {
                            },
                        )
                        .catch((error) => {
                            logger.error(state.Version + error);
                            },
                        );
                        state.tokenalert = true;
                        state.logrefresh = true;
                    }
                } 
                // Session expired ?
                if (state.tokenremainingtimeraw === 0) {
                    properties.axioscall(
                        {
                            method: 'post',
                            url: '/users/messages',
                            headers: { 'Authorization': 'jwt ' + window.localStorage.getItem('jwt') },
                            data: {
                                message: 'Session killed  for user ' + state.theuser.model.email,
                                severity: 'F',
                            },
                         }
                    )
                    .then((response) => {
                    },
                    )
                    .catch((error) => {
                        logger.error(state.Version + error);
                        },
                    );
                    state.therouter.push({ name: 'login' });
                    state.therouter = null;
                    state.theuser = null;
                    state.tokenalert = false;
                    state.logrefresh = false;
                }
            }
        }
    },
    /*----------------------------------------------------------------------------
        VUEX actions
    ----------------------------------------------------------------------------*/
    actions:  {
        // Login action -------------------------------------------------------------------
        // Payload contains credentials and the global router to 
        // be able to call another vue
        login({commit, state}, payload) {
            return new Promise((resolve, reject) => {
                properties.axioscall(
                    {
                        method: 'post',
                        url: '/users/login',
                        data: {
                            email: payload.email,
                            password: payload.password,
                        },
                     }
                )
                .then((response) => {
                    window.localStorage.setItem('jwt', response.data.token);
                    commit('updateloginstate', { theuser: response.data.theuser, token:response.data.token });
                    commit('updateuserlogs');
                    resolve('User ' + payload.email + ' logged');
                    state.therouter = payload.router;
                    payload.router.push({ name: 'home' });
                    },
                )
                .catch((error) => {
                    logger.error(state.Version + error);
                    reject('User ' + payload.email + ' not logged, invalid credentials');
                    },
                );
            })
        },
        // Logout action -------------------------------------------------------------------
        logout({commit, state}, payload) {
            return new Promise((resolve, reject) => {
                properties.axioscall(
                    {
                        method: 'post',
                        url: '/users/logout',
                        headers: { 'Authorization': 'jwt ' + window.localStorage.getItem('jwt') },
                        data: {
                            mode: payload.mode,
                        }
                    }
                )
                .then((response) => {
                        window.localStorage.setItem('jwt', response.data.token);
                        resolve('User ' +  response.data.email +  ' disconnected');
                        commit('deleteloginstate');
                        state.therouter = null;
                        if(payload.path !== '/home') {
                            payload.router.push({ name: 'home' });
                        }
                    },
                )
                .catch((error) => {
                    logger.error(state.Version + error);
                    reject('An error occured');
                    },
                );
            })
        },
        // Register action -------------------------------------------------------------------
        register({commit, state}, payload) {
            return new Promise((resolve, reject) => {
                properties.axioscall(
                    {
                        method: 'post',
                        url: '/users/register',
                        data: {
                            name : payload.name,
                            email: payload.email,
                            userdescription: payload.userdescription,
                            password: payload.password,
                            privs: payload.privs,
                        },
                    }
                )
                .then((response) => {
                        commit('deleteloginstate');
                        resolve(response.data.message);
                    },
                )
                .catch((error) => {
                    logger.error(state.Version + error);
                    reject(error.response.data.message);
                    },
                );
            })
        },
        // Update action -------------------------------------------------------------------
        update({commit, state}, payload) {
            return new Promise((resolve, reject) => {
                properties.axioscall(
                    {
                        method: 'post',
                        url: '/users/update',
                        headers: { 'Authorization': 'jwt ' + window.localStorage.getItem('jwt') },
                        data: {
                            name : payload.name,
                            description: payload.description,
                            privs: payload.privs,
                        },
                    }
                )
                .then((response) => {
                        commit('update', { name: payload.name, description: payload.description,
                                    privs:  payload.privs} );
                        resolve('User updated');
                    },
                )
                .catch((error) => {
                    logger.error(state.Version + error);
                    reject('An error occured');
                    },
                );
            })
        },
        // Update the remaining session time
        // This action is triggered from corestore timer action : settimer
        updateTokenTime({commit, state}) {
            commit('refreshtokentime');
            if(state.logrefresh) {
                commit('updateuserlogs');
                state.logrefresh = false;
            }
        }, 
        // Delete a user ( on its own request )
        deleteMe({ commit })
        {
            commit('delete');
        }
    },
}


