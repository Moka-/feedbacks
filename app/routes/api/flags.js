'use strict';

var flagsDAL = require('../../dal/flags');
var express = require('express');
var router = express.Router();

router.route('/appropriate')
    .post(function (req, res, next) {
        flagsDAL.markAppropriate();
        // flagsDAL.flagged.add(req.body, function (err, result) {
        //     if (err) {
        //         res.json(err);
        //     } else {
        //         res.json(result);
        //     }
        // });
    });

router.route('/inappropriate')
    .post(function (req, res, next) {
        flagsDAL.markInappropriate();
        // flagsDAL.flagged.add(req.body, function (err, result) {
        //     if (err) {
        //         res.json(err);
        //     } else {
        //         res.json(result);
        //     }
        // });
    });

module.exports = router;