/*----------------------------------------------------------------------------
    userstore.js    

    Oct 04 2019   Initial
    Oct 06 2019   Vuex tests
    Nov 01 2019   Start using the store and improve my Vuex knowledge
    Nov 02 2019   actions new syntax
    Nov 03 2019   router and axios calls
----------------------------------------------------------------------------*/
import Vue from 'vue';  
import Vuex from 'vuex';

const logger = require('../../core/services/logger');
const properties = require('../../core/services/properties');

Vue.use(Vuex);

export default { 
    namespaced: true,
    /*----------------------------------------------------------------------------
        VUEX states
    ----------------------------------------------------------------------------*/
    state: {
        Version: 'userstore:1.27, Nov 03 2019 ',
        callcount: 0,
    },
    /*----------------------------------------------------------------------------
        VUEX Getters
    ----------------------------------------------------------------------------*/
    getters: {
        getVersion(state) {
            return state.Version;
        },
    },
    /*----------------------------------------------------------------------------
        VUEX mutations
    ----------------------------------------------------------------------------*/
    mutations: { // Synchronous
        updateloginstate(state, payload) {
            logger.debug(state.Version + 'userStore/mutation/updateloginstate for ' + payload.email + '/' + payload.password);
        }
    },
    /*----------------------------------------------------------------------------
        VUEX actions
    ----------------------------------------------------------------------------*/
    actions:  {
        // Login action : payload contains credentials and the global router to 
        // be able to call another vue
        login({commit, state}, payload) {
            logger.debug(state.Version + 'userStore/action/login for ' + payload.email + ' with password ' + payload.password);
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
                    commit('updateloginstate', payload);
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


