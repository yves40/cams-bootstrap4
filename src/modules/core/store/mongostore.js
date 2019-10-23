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
----------------------------------------------------------------------------*/
import Vue from 'vue';  
import Vuex from 'vuex';

const logger = require('../services/logger');
const axiosutility = require('../services/axios');
const axiosinstance = axiosutility.getAxios();

const DOWN = 0;
const UP = 1;
const TIMEDELAYCHECK = 1000;
const MONGODELAYCHECK = 2000;
let failures = 0;

Vue.use(Vuex);

/*----------------------------------------------------------------------------
    VUEX states
----------------------------------------------------------------------------*/
const state =  {
    Version: 'mongoStore:1.67, Oct 23 2019 ',
    clock: '',
    MAXLOG:16,
    mongostatus: DOWN,
    mongodown: true,        // TRUE if mongodb is down
};
/*----------------------------------------------------------------------------
    VUEX Getters
----------------------------------------------------------------------------*/
const getters = {
    getVersion(state) {
        return state.Version;
    },
    getTime(state) {
        return state.clock;
    },
    getMongoStatus(state) {
        return state.mongostatus===UP ? 'Mongo running': 'Mongo Down';
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
    updateTime(state) {
        state.clock = new Date().toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1");
    },
    updateMongoStatus(state) {  // Check mongo status every 2 seconds
        return axiosinstance({
            url: '/mongo/status',
            method: 'get',
            })
            .then((response) => {
            if (failures !== 0) {
                failures = 0;     // Back to normal status
                logger.debug(state.Version + 'mongodb status service is back');

            }
            state.mongostatus = response.data.mongostatus;
            state.mongodown = response.data.mongodown;
            })
            .catch(() => {
            ++failures;
            state.mongostatus = DOWN;
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
    setClockTimer(context) {
        setInterval(() => {
            context.commit('updateTime')
            }, TIMEDELAYCHECK);
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
