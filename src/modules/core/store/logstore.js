/*----------------------------------------------------------------------------
    logstore.js    

    Jan 29 2020     Initial
    Jan 30 2020     WIP I
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
    Version: 'logstore.js:1.01, Jan 30 2020 ',
    today: datetime.getDate(),
    hourminute: datetime.getShortTime(),
    logs: null,
};
/*----------------------------------------------------------------------------
    VUEX Getters
----------------------------------------------------------------------------*/
const getters = {
    getVersion(state) {
        return state.Version;
    },
    getLogs() {
      return state.logs;
    },
};
/*----------------------------------------------------------------------------
    VUEX mutations
----------------------------------------------------------------------------*/
const mutations = { // Synchronous
    updatelogs(state, payload) {
      state.logs = payload;
    },
};
/*----------------------------------------------------------------------------
    VUEX actions
----------------------------------------------------------------------------*/
const actions = { 
  getLogs( {commit, state } ) {
    properties.axioscall(
      {
          method: 'post',
          url: '/users/mylog',
          headers: { 'Authorization': 'jwt ' + window.localStorage.getItem('jwt') },
          data: {
              "severity": severity,
              "lineslimit": 40,     
          }
      }
      )
      .then((response) => { 
              state.userlogs = response.data; 
              logger.debug(state.Version + 'Got ' + state.userlogs.length + ' log entries');
          },
      )
      .catch((error) => {
              logger.error(state.Version + error);
          },
      );
    commit('updatelogs', thelogs);
  }
};

export default {
    namespaced: true,
    getters,
    mutations,
    actions,
};

