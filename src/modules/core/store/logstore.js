/*----------------------------------------------------------------------------
    logstore.js    

    Jan 29 2020     Initial
    Jan 30 2020     WIP I
    Jan 31 2020     WIP II
    Feb 05 2020     WIP III
    Feb 07 2020     Handle the message filter for log search
    Feb 09 2020     Add dates to filter results
    Feb 10 2020     Date parameters 
    Feb 12 2020     Max log list length from properties
    Mar 26 2020     Use axiosclass now
    Mar 27 2020     Use axiosclass now, phase II
----------------------------------------------------------------------------*/

import Vue from 'vue';
import Vuex from 'vuex'
import logger from '../services/logger';
import properties from '../services/properties'
import datetime from '../services/datetime'
const axiosclass = require('../../core/classes/axiosclass');
const ax = new axiosclass();

Vue.use(Vuex);
export default { 
    namespaced: true,
    /*----------------------------------------------------------------------------
        VUEX states
    ----------------------------------------------------------------------------*/
    state:  {
        Version: 'logstore.js:1.27, Mar 27 2020 ',
        today: datetime.getDate(),
        hourminute: datetime.getShortTime(),
        updatecount: 0,
        logs: [ ],
        severityfilter: [ '0', '1', '2', '3', '4' ],
        messagefilter: '',
        startdate: datetime.getDateBrowserFormatMax(),
        enddate: datetime.getDateBrowserFormatMin(-10),
        starthour: '',
        endhour: '',
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
        resetDates(state) {
            state.startdate = datetime.getDateBrowserFormat();
            state.enddate = datetime.getDateBrowserFormat(-10);
        }
    },
    /*----------------------------------------------------------------------------
        VUEX actions
    ----------------------------------------------------------------------------*/
    actions:  { 
        loadLogs( {commit, state}, payload ) {
            if (payload !== undefined) {
                state.severityfilter = payload[0];
                state.messagefilter = payload[1];
                state.startdate = payload[2];
                state.enddate = payload[3];
            }
            ax.get('/logs/list',{
                "severityfilter": state.severityfilter,
                "lineslimit": properties.LOGLISTMAX,
                "messagefilter": state.messagefilter,
                "start": state.startdate,
                "end": state.enddate,
                },  
                { 'Authorization': 'jwt ' + window.localStorage.getItem('jwt') }
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
        resetDates( { commit } ) {
            commit('resetDates');
        }
    }   
}
