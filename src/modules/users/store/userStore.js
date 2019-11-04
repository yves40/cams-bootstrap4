/*----------------------------------------------------------------------------
    userstore.js    

    Oct 04 2019   Initial
    Oct 06 2019   Vuex tests
    Nov 01 2019   Start using the store and improve my Vuex knowledge
    Nov 02 2019   actions new syntax
    Nov 03 2019   router and axios calls
    Nov 04 2019   Manage the state after login
----------------------------------------------------------------------------*/
import Vue from 'vue';  
import Vuex from 'vuex';
import { generateCodeFrame } from 'vue-template-compiler';

const logger = require('../../core/services/logger');
const properties = require('../../core/services/properties');

Vue.use(Vuex);

export default { 
    namespaced: true,
    /*----------------------------------------------------------------------------
        VUEX states
    ----------------------------------------------------------------------------*/
    state: {
        Version: 'userstore:1.33, Nov 04 2019 ',
        theuser: null,
    },
    /*----------------------------------------------------------------------------
        VUEX Getters
    ----------------------------------------------------------------------------*/
    getters: {
        getVersion(state) {return state.Version;},
        getEmail(state) {return state.theuser === null ? 'Not logged' : state.theuser.email;},
        getName(state) {return state.theuser === null ? 'Not logged' : state.theuser.name;},
        getDescription(state) {return state.theuser === null ? 'Not logged' : state.theuser.description;},
        getLastlogin(state) {return state.theuser === null ? 'Not logged' : state.theuser.lastlogin;},
    },
    /*----------------------------------------------------------------------------
        VUEX mutations
    ----------------------------------------------------------------------------*/
    mutations: { // Synchronous
        updateloginstate(state, theuser) {
            state.theuser = theuser;
        }
    },
    /*----------------------------------------------------------------------------
        VUEX actions
    ----------------------------------------------------------------------------*/
    actions:  {
        // Login action : payload contains credentials and the global router to 
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
                    commit('updateloginstate', response.data.theuser);
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
        }
    },
}


