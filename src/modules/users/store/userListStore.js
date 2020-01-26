/*----------------------------------------------------------------------------
    userListStore.js    

    Jan 17 2020   Initial
    Jan 18 2020   Send parameters with axios : params 
    Jan 19 2020   Track user search filter update in the UI 
                  Spec user list attributes
    Jan 20 2020   Add individual hidden flag in the users array during the 
                  mutation
    Jan 24 2020   Change ma,agement of empty user list after search 
    Jan 26 2020   Now get the user list with profilecodes
                  Add some methods to colllapse UI in users list
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
        Version: 'userListStore:1.17, Jan 27 2020 ',
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
            state.userlist.forEach(element => {
                element.show = false;
            });
        },
        resetList(state) {
            state.userlist = {};    // Clear the list something bad happened
        },
        collapse(state) {
            state.userlist.forEach(element => {
                element.show = false;
            });
        },
        expand(state) {
            state.userlist.forEach(element => {
                element.show = true;
            });
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
                            attrlist: '_id email name description lastlogin lastlogout created updated profilecode'
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
        // Reset the expanded flag into the user list
        collapseAll( {commit }) {
            commit('collapse');
        },
        // Set the expanded flag into the user list
        expandAll( {commit }) {
            commit('expand');
        }
    }
}


