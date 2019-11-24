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
----------------------------------------------------------------------------*/
import Vue from 'vue';  
import Vuex from 'vuex';
import { generateCodeFrame } from 'vue-template-compiler';

const logger = require('../../core/services/logger');
const properties = require('../../core/services/properties');
const datetime = require('../../core/services/datetime')
const jwthelper = require('../services/jwthelper');

Vue.use(Vuex);

export default { 
    namespaced: true,
    /*----------------------------------------------------------------------------
        VUEX states
    ----------------------------------------------------------------------------*/
    state: {
        Version: 'userstore:1.56, Nov 24 2019 ',
        theuser: null,
        token: null,
        tokenobject: '{}',
        tokenvalidtime: null,
        tokenremainingtime: null,
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
        isLogged(state) {return state.theuser === null ? false : true ;},
        
    },
    /*----------------------------------------------------------------------------
        VUEX mutations
    ----------------------------------------------------------------------------*/
    mutations: { // Synchronous
        updateloginstate(state, payload) {
            state.theuser = payload.theuser;
            state.token = payload.token;
            state.tokenobject = jwthelper.decodeToken(payload.token);
            const tokendata = jwthelper.getTokenTimeMetrics(state.tokenobject);
            state.tokenremainingtime = tokendata.remainingtime;
        },
        deleteloginstate(state) {
            state.theuser = null;
        },
        refreshtokentime(state) {
            if (state.theuser) {
                const decodedtoken = jwthelper.decodeToken(state.token);
                const tokendata = jwthelper.getTokenTimeMetrics(decodedtoken);
                state.tokenremainingtime = tokendata.remainingtime;
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
                    resolve('User ' + payload.email + ' logged');
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
                    }
                )
                .then((response) => {
                        window.localStorage.setItem('jwt', response.data.token);
                        logger.debug(JSON.stringify(response.data))
                        resolve('User ' +  response.data.email +  ' disconnected');
                        commit('deleteloginstate');
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
                        },
                    }
                )
                .then((response) => {
                        commit('deleteloginstate');
                        resolve('User registered');
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
        updateTokenTime({commit}) {
            commit('refreshtokentime');
        } 
    },
}


