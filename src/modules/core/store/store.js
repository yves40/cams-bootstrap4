/*----------------------------------------------------------------------------
    store.js    

    Oct 06 2019     Initial
    Oct 05 2019     Reorg
    Oct 06 2019     Install common services
    Oct 23 2019     Add mongo 
----------------------------------------------------------------------------*/

import Vue from 'vue';
import Vuex from 'vuex'

const logger = require('../services/logger');

// Get various stores
import corestore from './corestore';
import userstore from '../../users/store/userstore';
import mongostore from './mongostore';

export default new Vuex.Store({
    modules: {
        corestore: corestore ,
        userstore: userstore,
        mongostore: mongostore,
    }
  });
