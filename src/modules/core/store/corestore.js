/*----------------------------------------------------------------------------
    corestore.js    

    Oct 04 2019     Initial
    Oct 05 2019     Reorg
    Oct 06 2019     Install common services
    Oct 09 2019     Getter for date
    Oct 10 2019     Getter for hour minutes
    Oct 11 2019     Vuex integration
    Nov 05 2019     Reduce timer delay to 5 sec
----------------------------------------------------------------------------*/

import Vue from 'vue';
import Vuex from 'vuex'
import datetime from '../services/datetime';
import logger from '../services/logger';

Vue.use(Vuex);
/*----------------------------------------------------------------------------
    VUEX states
----------------------------------------------------------------------------*/
const state = {
    Version: 'corestore.js:1.22, Nov 05 2019',
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
    updatetime(state) {
        state.hourminute = datetime.getShortTime();
    },
};
/*----------------------------------------------------------------------------
    VUEX actions
----------------------------------------------------------------------------*/
const actions = { 
    settimer({ commit, dispatch }) {
        setInterval(() => {
            commit('updatetime');  
            dispatch('userstore/updateTokenTime',null, {root:true});
        }, require('../services/properties').COREDELAY);
    },
};

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions,
};

