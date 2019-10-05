/*----------------------------------------------------------------------------
    store.js    

    Oct 04 2019     Initial
    Oct 05 2019     Reorg
----------------------------------------------------------------------------*/

import Vue from 'vue'
import Vuex from 'vuex'

import UserStore from '../../users/store/userStore'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    UserStore,
  }
})
