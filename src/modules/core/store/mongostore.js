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
----------------------------------------------------------------------------*/
import Vue from 'vue';  
import Vuex from 'vuex';

const logger = require('../services/logger');
const axiosutility = require('../services/axios');
const axiosinstance = axiosutility.getAxios();

const MONGODELAYCHECK = require('../services/properties').MONGODELAYCHECK;
let failures = 0;

Vue.use(Vuex);

/*----------------------------------------------------------------------------
    VUEX states
----------------------------------------------------------------------------*/
const state =  {
    Version: 'mongoStore:1.73, Oct 24 2019 ',
    MAXLOG:16,
    mongodown: true,        // TRUE if mongodb is down
};
/*----------------------------------------------------------------------------
    VUEX Getters
----------------------------------------------------------------------------*/
const getters = {
    getVersion(state) {
        return state.Version;
    },
    getMongoStatus(state) {
        return state.mongodown ? 'Mongo Down': 'Mongo Running';
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
        return axiosinstance({
            url: '/mongo/status',
            method: 'get',
            })
            .then((response) => {
                state.mongodown = response.data.isdown;
                if(state.mongodown) {
                    ++failures;
                    logger.debug(state.Version + 'Mongo is down');
                }
                else {
                    if (failures !== 0) {
                        logger.debug(state.Version + 'mongodb  service is back after ' + failures*MONGODELAYCHECK/1000 + ' seconds');
                        failures = 0;     // Back to normal status
                    }
                    else {
                        logger.debug(state.Version + 'mongodb is up');
                    }
                }
            })
            .catch(() => {
                ++failures;
                if ((failures % 10 === 0)||(failures === 1)) {
                    logger.error(state.Version + ' Error when calling mongodb status service ');
                }
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