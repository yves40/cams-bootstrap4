/*----------------------------------------------------------------------------
    Oct 16 2019   Initial
----------------------------------------------------------------------------*/
const express = require('express');
const router = express.Router();
const logger = require('../services/logger');

const Version = 'api.js:1.03, Oct 16 2019';

// Few dummy routes APIs tests
router.get('/ping', (req, res) => {
    res.json({
        message: 'Welcome to the Server Yves, check me',
        apiversion: Version,
    });
    logger.debug(Version + '/api/ping served');
  });

router.get('/test', (req, res) => {
    res.json({
        message: 'API test',
        apiversion: Version,
    });
    logger.debug(Version + '/api/test served');
  });

  module.exports = router ;