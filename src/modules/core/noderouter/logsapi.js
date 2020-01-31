/*----------------------------------------------------------------------------
    jan 30 2020   Initial
    jan 31 2020   Bug on lines limit
----------------------------------------------------------------------------*/
const Version = 'logsapi.js:1.04, Jan 31 2020 ';

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
        const mongologs = new mongologgerclass();
        mongologs.getLogs(lineslimit).then((logs) => {
            res.status(200).send(logs);
            console.log(logs[0])
        })
        .catch((errormessage => {
            res.status(500).send(errormessage);
        }))
    });

module.exports = router ;