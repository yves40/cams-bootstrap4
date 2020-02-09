/*----------------------------------------------------------------------------
    logstore.js    

    Jan 29 2020     Initial
    Jan 30 2020     WIP I
    Jan 31 2020     WIP II
    Feb 05 2020     WIP III
    Feb 07 2020     Handle the message filter for log search
    Feb 09 2020     Add dates to filter results
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
        Version: 'logstore.js:1.16, Feb 09 2020 ',
        today: datetime.getDate(),
        hourminute: datetime.getShortTime(),
        updatecount: 0,
        logs: [ ],
        severityfilter: [ '0', '1', '2', '3', '4' ],
        messagefilter: '',
        startdate: '',
        enddate: '',
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
        loadLogs( {commit, state}, payload ) {
            if (payload !== undefined) {
                state.severityfilter = payload[0];
                state.messagefilter = payload[1];
            }
            properties.axioscall(
            {
                method: 'get',
                url: '/logs/list',
                headers: { 'Authorization': 'jwt ' + window.localStorage.getItem('jwt') },
                params: {
                    "severityfilter": state.severityfilter,
                    "lineslimit": 100,
                    "messagefilter": state.messagefilter
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
