/*----------------------------------------------------------------------------
    Oct 16 2019   Initial
    Oct 23 2019   Change PATH
----------------------------------------------------------------------------*/
const express = require('express');
const router = express.Router();
const logger = require('../services/logger');
const mongodb = require('../services/mongodb');

const Version = 'mongoapi.js:1.04, Oct 23 2019';

// Few dummy routes APIs tests
router.get('/mongo/status', (req, res) => {
    let status = mongodb.getMongoDBStatusText();
    res.json({
        message: 'Checking mongodb server status',
        status: status,
        apiversion: Version,
    });
    logger.debug(Version + '/mongostatus served');
  });

router.get('/mongo/close', (req, res) => {
    mongodb.closeMongoDBConnection();
    res.json({
        message: 'Requested closing of mongo connection',
        apiversion: Version,
    });
    logger.debug(Version + '/mongoclose served');
});

module.exports = router ;