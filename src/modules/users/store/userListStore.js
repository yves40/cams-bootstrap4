/*----------------------------------------------------------------------------
    userListStore.js    

    Jan 17 2020   Initial
    Jan 18 2020   Send parameters with axios : params 
    Jan 19 2020   Track user search filter update in the UI 
----------------------------------------------------------------------------*/
import Vue from 'vue';  
import Vuex from 'vuex';

const logger = require('../../core/services/logger');
const properties = require('../../core/services/properties');
const AXIOS = properties.axioscall;
const datetime = require('../../core/services/datetime')

Vue.use(Vuex);

export default { 
    namespaced: true,
    /*----------------------------------------------------------------------------
        VUEX states
    ----------------------------------------------------------------------------*/
    state: {
        Version: 'userListStore:1.09, Jan 19 2020 ',
        filter: '',     // Filter user list based on the interface field
        userlist: {},
    },
    /*----------------------------------------------------------------------------
        VUEX Getters
    ----------------------------------------------------------------------------*/
    getters: {
        getVersion(state) {return state.Version;},
        getUsersList(state) { return state.userlist;}
    },
    /*----------------------------------------------------------------------------
        VUEX mutations (Synchronous) 
    ----------------------------------------------------------------------------*/
    mutations: {
        refreshUsersList(state, usersdata) {
            state.userlist = usersdata;
        }
    },
    /*----------------------------------------------------------------------------
        VUEX actions (ASynchronous) 
    ----------------------------------------------------------------------------*/
    actions:  {
        loadUsersList( {commit, state}, filter) {
            return new Promise( (resolve, reject) => {
                state.filter = filter;
                AXIOS(
                    {
                        method: 'get',
                        url: '/users/listrequested',
                        headers: { 'Authorization': 'jwt ' + window.localStorage.getItem('jwt') },
                        params: {
                            filter: filter,
                            attributes: '_id email name'
                        },
                 }
                )
                .then((response) => {
                    logger.debug(state.Version + 'Got ' + response.data.length + ' user(s)');
                    commit('refreshUsersList', response.data);
                    }
                )
                .catch((error) => {
                    logger.error(state.Version + error);
                    }
                );
    
            })
        },
    }
}


