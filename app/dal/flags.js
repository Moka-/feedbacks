'use strict';

var db = require('./db');

module.exports = {
        flag: function (params, callback) {
            var sql = 'SELECT * FROM `visitors`';
            db.query(sql, params, callback);
        },
        unflag: function (params, callback) {
            var sql = 'SELECT * FROM `visitors` WHERE `id` = ?';
            db.query(sql, params, callback);
        },
        markAppropriate: function (params, callback) {
            var sql = 'INSERT INTO `visitors` SET ?';
            db.query(sql, params, callback);
        },
        markInappropriate: function (params, callback) {
            var sql = "";
            db.query(sql, params, callback);
        }
    };