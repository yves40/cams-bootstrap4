/*----------------------------------------------------------------------------
    jan 30 2020   Initial
    jan 31 2020   Bug on lines limit
    feb 05 2020   Filter on logs with severity
----------------------------------------------------------------------------*/
const Version = 'logsapi.js:1.05, Feb 05 2020 ';

const express = require('express');
const router = express.Router();
const cors = require('cors');
const passport = require('passport');

const corsutility = require("../services/corshelper");
const mongologgerclass = require('../classes/mongologgerclass');
let mongolog = new mongologgerclass(Version, 'LOGSAPI');


/*
    Load a bunch of logs. Limited to a max number and started with
    most recent
*/
router.get('/logs/list', 
    cors(corsutility.getCORS()),
    passport.authenticate('jwt'),
    (req, res) => {
        let lineslimit = parseInt(req.query.lineslimit);
        let filter = req.query.filter;
        const mongologs = new mongologgerclass();
        mongologs.getLogs(lineslimit, filter).then((logs) => {
            res.status(200).send(logs);
        })
        .catch((errormessage => {
            res.status(500).send(errormessage);
        }))
    });

module.exports = router ;