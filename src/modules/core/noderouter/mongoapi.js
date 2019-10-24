/*----------------------------------------------------------------------------
    Oct 16 2019   Initial
    Oct 23 2019   Change PATH
    Oct 24 2019   Add results to the status service
----------------------------------------------------------------------------*/
const express = require('express');
const router = express.Router();
const logger = require('../services/logger');
const mongodb = require('../services/mongodb');
const datetime = require('../services/datetime');

const Version = 'mongoapi.js:1.07, Oct 24 2019';

// Few dummy routes APIs tests
router.get('/mongo/status', (req, res) => {
    let status = mongodb.getMongoDBStatusText();
    let isdown = mongodb.IsMongoDown();
    res.json({
        message: 'Checking mongodb server status',
        status: status,
        isdown: isdown,
        apiversion: Version,
        checktime: datetime.getTime(),
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