/*----------------------------------------------------------------------------
    corestore.js    

    Oct 04 2019     Initial
    Oct 05 2019     Reorg
    Oct 06 2019     Install common services
    Oct 09 2019     Getter for date
    Oct 10 2019     Getter for hour minutes
----------------------------------------------------------------------------*/

import Vue from 'vue';
import Vuex from 'vuex'
import datetime from '../services/datetime';
const logger = require('../services/logger');

Vue.use(Vuex);
/*----------------------------------------------------------------------------
    VUEX states
----------------------------------------------------------------------------*/
const state = {
    Version: 'corestore.js:1.14, Oct 10 2019',
    today: datetime.getDate(),
    hourminute: datetime.getShortTime(),
};
/*----------------------------------------------------------------------------
    VUEX Getters
----------------------------------------------------------------------------*/
const getters = {
    getVersion(state) {
        return state.Version;
    },
    getToday(state) {
        return state.today;
    },
    getHM(state) {
        return state.hourminute;
    }
};
/*----------------------------------------------------------------------------
    VUEX mutations
----------------------------------------------------------------------------*/
const mutations = { // Synchronous
    armtimer(state) {
        setInterval(updateHM, 60000);
        logger.debug(context.state.Version + ' Timer armed');
    },
};
/*----------------------------------------------------------------------------
    VUEX actions
----------------------------------------------------------------------------*/
const actions = { 
    settimer(context) {
        context.commit('armtimer'); 
    },
};

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions,
};
/*----------------------------------------------------------------------------
    Internal
----------------------------------------------------------------------------*/
function updateHM() {
    hourminute = datetime.getShortTime();
    logger.debug('**** called');
}

