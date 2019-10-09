/*----------------------------------------------------------------------------
    corestore.js    

    Oct 04 2019     Initial
    Oct 05 2019     Reorg
    Oct 06 2019     Install common services
    Oct 09 2019     Getter for date
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
    Version: 'corestore.js:1.08, Oct 09 2019',
    today: datetime.getDate(),
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
    }
};
/*----------------------------------------------------------------------------
    VUEX mutations
----------------------------------------------------------------------------*/
const mutations = { // Synchronous
};
/*----------------------------------------------------------------------------
    VUEX actions
----------------------------------------------------------------------------*/
const actions = { 
    settimer(context) {
        setInterval(() => {
            context.commit('updateTime')
          }, 1000);
        logger.debug(context.state.Version + 'action settimer');
    },
};
/*
export const corestore = new Vuex.Store({
    state,
    getters,
    mutations,
    actions,
});
*/
export const corestore = {
    namespaced: true,
    state,
    getters,
    mutations,
    actions,
};

