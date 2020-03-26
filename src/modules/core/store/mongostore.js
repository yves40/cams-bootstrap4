/*----------------------------------------------------------------------------
    mongoStore.js    

    Feb 20 2019     Initial
    Feb 21 2019     Finalize timer code
    Mar 01 2019     Mongo utils in a specific file
    Mar 05 2019     Store not working, report mongo as down : fix pb
                    Add mongodown flag
    Mar 06 2019     Use logger. Not to a file, just in the console
    Mar 07 2019     Cleanup some code
    Mar 10 2019     Reduce checking delay for mongo to 2 seconds
                    Suppress unnecessary log messages
    Mar 13 2019     Reduce log messages
    Oct 23 2019     cams-bootstrap project
    Oct 24 2019     Remove one timer, add log
    Oct 25 2019     Log a message only when mongo state has changed 
    Nov 03 2019     No longer use the developped axios module
    Nov 05 2019     Mongo status service, send back the string. Check
    Nov 29 2019     Investigate timer mechanism
    Feb 26 2020     Mongo status messages
    Mar 22 2020     New axios class
    Mar 23 2020     More info sent back for mongo status
    Mar 25 2020     Define a node server symbolic name
----------------------------------------------------------------------------*/
import Vue from 'vue';  
import Vuex from 'vuex';

const logger = require('../services/logger');
const axiosclass = require('../classes/axiosclass');
const properties = require('../services/properties');
const MONGODELAYCHECK = properties.MONGODELAYCHECK;
const MONGOUP = properties.MONGOUP;
const MONGODOWN = properties.MONGODOWN;

Vue.use(Vuex);
const ax = new axiosclass();
/*----------------------------------------------------------------------------
    VUEX states
----------------------------------------------------------------------------*/
const state =  {
    Version: 'mongoStore:1.86, Mar 25 2020 ',
    MAXLOG:16,
    mongodown: true,        // TRUE if mongodb is down
    mongoserver: '',
    messagelock: false,     // Just to avoid zillions messages in the console
    errorlock: false,
};
/*----------------------------------------------------------------------------
    VUEX Getters
----------------------------------------------------------------------------*/
const getters = {
    getVersion(state) {
        return state.Version;
    },
    getMongoStatus(state) {
        if (state.mongodown) {
            return state.mongoserver + ' :Mongo Down';
        }
        else {
            return state.mongoserver + ' :Mongo Up';
        }
    },
    IsMongoDown(state) {
        return state.mongodown;
    },
};
/*----------------------------------------------------------------------------
    VUEX mutations
----------------------------------------------------------------------------*/
const mutations = { // Synchronous
    clearlog(state) {
        state.logs = [];
    },
    updateMongoStatus(state) {  // Check mongo status every 5 seconds
        if (!state.messagelock) {
            logger.debug(state.Version + ' get mongo status from ' + properties.nodeserver);
            state.messagelock = true;
        }
        ax.get('/mongo/status')
        .then((response) => {
                state.mongodown = response.data.isdown;
                state.errorlock = false;
            })
        .catch(() => {
            if (!state.errorlock) {
                logger.debug(state.Version + ' Error when getting mongo status from ' + properties.nodeserver);
                state.errorlock = true;
                state.messagelock = false;
            }
        })
        .finally(() => {
            state.mongoserver = ax.getSelectedServerName();
        });
    },
};
/*----------------------------------------------------------------------------
    VUEX actions
----------------------------------------------------------------------------*/
const actions = { // Asynchronous
    clearlog(context) {
        context.commit('clearlog');
    },
    setMongoTimer(context) {
        logger.debug('mongostore set timer');
        setInterval(() => {
            context.commit('updateMongoStatus')
            }, MONGODELAYCHECK);
    },
};

export default { 
    namespaced: true,
    state,
    getters,
    mutations,
    actions,
};
