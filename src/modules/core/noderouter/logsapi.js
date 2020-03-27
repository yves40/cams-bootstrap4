/*----------------------------------------------------------------------------
    jan 30 2020   Initial
    jan 31 2020   Bug on lines limit
    feb 05 2020   Filter on logs with severity
    feb 07 2020   Filter on logs with severity and message filter
    feb 08 2020   Log info removed
----------------------------------------------------------------------------*/
const Version = 'logsapi.js:1.10, Feb 08 2020 ';

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
        let severityfilter = req.query.severityfilter;
        let messagefilter = req.query.messagefilter;
        let start = req.query.start;
        let end = req.query.end;
        const mongologs = new mongologgerclass();
        console.log(JSON.stringify(req.query))
        mongologs.getLogs(lineslimit, severityfilter, messagefilter, start, end).then((logs) => {
            res.status(200).send(logs);
        })
        .catch((errormessage => {
            res.status(500).send(errormessage);
        }))
    });

module.exports = router ;