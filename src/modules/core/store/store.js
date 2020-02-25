/*----------------------------------------------------------------------------
    store.js    

    Oct 06 2019     Initial
    Oct 05 2019     Reorg
    Oct 06 2019     Install common services
    Oct 23 2019     Add mongo 
    Jan 20 2020     WIP on users listing interface
    Jan 30 2020     logstore
    Feb 25 2020     cap error on userstore
----------------------------------------------------------------------------*/

import Vue from 'vue';
import Vuex from 'vuex'

const logger = require('../services/logger');

// Get various stores
import corestore from './corestore';
import userstore from '../../users/store/userStore';
import userliststore from '../../users/store/userListStore';
import logstore from './logstore';
import mongostore from './mongostore';

export default new Vuex.Store({
    modules: {
        corestore: corestore ,
        userstore: userstore,
        userliststore: userliststore,
        mongostore: mongostore,
        logstore: logstore,
    }
  });
