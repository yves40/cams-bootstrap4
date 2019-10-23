/*----------------------------------------------------------------------------
    Oct 16 2019   Initial
    Oct 23 2019   Change PATH
----------------------------------------------------------------------------*/
const express = require('express');
const router = express.Router();
const logger = require('../services/logger');

const Version = 'api.js:1.04, Oct 23 2019';

// Few dummy routes APIs tests
router.get('/api/ping', (req, res) => {
    res.json({
        message: 'Welcome to the Server Yves, check me',
        apiversion: Version,
    });
    logger.debug(Version + '/api/ping served');
  });

router.get('/api/test', (req, res) => {
    res.json({
        message: 'API test',
        apiversion: Version,
    });
    logger.debug(Version + '/api/test served');
  });

  module.exports = router ;