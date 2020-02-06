/*----------------------------------------------------------------------------
    logstore.js    

    Jan 29 2020     Initial
    Jan 30 2020     WIP I
    Jan 31 2020     WIP II
    Feb 05 2020     WIP III
----------------------------------------------------------------------------*/

import Vue from 'vue';
import Vuex from 'vuex'
import datetime from '../services/datetime';
import logger from '../services/logger';
import properties from '../services/properties'

Vue.use(Vuex);
export default { 
    namespaced: true,
    /*----------------------------------------------------------------------------
        VUEX states
    ----------------------------------------------------------------------------*/
    state:  {
        Version: 'logstore.js:1.09, Feb 05 2020 ',
        today: datetime.getDate(),
        hourminute: datetime.getShortTime(),
        updatecount: 0,
        logs: [ ],
        filter: '',
    },
    /*----------------------------------------------------------------------------
        VUEX Getters
    ----------------------------------------------------------------------------*/
    getters: {
        getVersion(state) {
            return state.Version;
        },
        getLogs(state) {
            return state.logs;
        },
        getUpdateCount(state) {
            return state.updatecount;
        }
    },
    /*----------------------------------------------------------------------------
        VUEX mutations
    ----------------------------------------------------------------------------*/
     mutations:  { // Synchronous
        updateLogs(state, payload) {
            state.logs = payload;
            state.updatecount++;
        },
    },
    /*----------------------------------------------------------------------------
        VUEX actions
    ----------------------------------------------------------------------------*/
    actions:  { 
        loadLogs( {commit, state }, filter = [ "0", "1", "2", "3", "4" ] ) {
            properties.axioscall(
            {
                method: 'get',
                url: '/logs/list',
                headers: { 'Authorization': 'jwt ' + window.localStorage.getItem('jwt') },
                params: {
                    "filter": filter,
                    "lineslimit": 100,     
                }
            }
            )
            .then((response) => { 
                commit('updateLogs', response.data);
            },
            )
            .catch((error) => {
                    logger.error(state.Version + error);
                },
            );
        }, 
    }   
}
