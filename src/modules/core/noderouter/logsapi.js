/*----------------------------------------------------------------------------
    jan 30 2020   Initial
----------------------------------------------------------------------------*/
const express = require('express');
const router = express.Router();
const mongodb = require('../services/mongodb');
const datetime = require('../services/datetime');

const Version = 'logsapi.js:1.00, Jan 30 2020 ';

// Few dummy routes APIs tests
router.get('/logs/list', (req, res) => {
});

module.exports = router ;