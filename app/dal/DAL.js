'use strict';

var db = require('./db');

var widgetFeedbacksQuery =
    'SELECT f.*, v.display_name, v.avatar_url ' +
    'FROM `feedbacks` f,`visitors` v ' +
    'WHERE f.visitor_id = v.id ' +
    'AND f.app_instance = ? ' +
    'AND f.component_id = ?';

var feedbackQuery = widgetFeedbacksQuery + ' AND f.id = ?';

var widgetDataQuery =
    'SELECT COUNT(f.id)  \'feedbacks_count\',ROUND(AVG(f.rating),1) \'average_rating\', w.* ' +
    'FROM `feedbacks` f ,`widgets` w ' +
    'WHERE f.app_instance = w.app_instance ' +
    'AND f.component_id = w.component_id ' +
    'AND f.app_instance = ? ' +
    'AND f.component_id = ?';

// In here you should perform all your queries
module.exports = {
    visitors: {
        list: function (params, callback) {
            var sql = 'SELECT * FROM `visitors`';
            db.query(sql, params, callback);
        },
        view: function (params, callback) {
            var sql = 'SELECT * FROM `visitors` WHERE `id` = ?';
            db.query(sql, params, callback);
        },
        add: function (params, callback) {
            var sql = 'INSERT INTO `visitors` SET ?';
            db.query(sql, params, callback);
        },
        update: function (params, callback) {
            var sql = "";
            db.query(sql, params, callback);
        },
        delete: function (params, callback) {
            var sql = 'DELETE `visitors` WHERE ?';
            db.query(sql, params, callback);
        }
    },
    feedbacks: {
        list: function (params, callback) {
            var sql = widgetFeedbacksQuery;
            db.query(sql, params, callback);
        },
        view: function (params, callback) {
            var sql = feedbackQuery;
            db.query(sql, params, callback);
        },
        add: function (params, callback) {
            var sql = 'INSERT INTO `feedbacks` SET ?';
            db.query(sql, params, callback);
        },
        update: function (params, callback) {
            var sql = "";
            db.query(sql, params, callback);
        },
        delete: function (params, callback) {
            var sql ="";
            db.query(sql, params, callback);
        }
    },
    widgets: {
        list: function (params, callback) {
            var sql = "SELECT * FROM `widgets` w WHERE w.app_instance = ?";
            db.query(sql, params, callback);
        },
        view: function (params, callback) {
            var sql = widgetDataQuery;
            db.query(sql, params, function(err, results){
                callback(err, results);
            });
        },
        add: function (params, callback) {
            var sql = 'INSERT INTO `widgets` SET ?';
            db.query(sql, params, callback);
        },
        update: function (params, callback) {
            var sql = "";
            db.query(sql, params, callback);
        },
        delete: function (params, callback) {
            var sql = "";
            db.query(sql, params, callback);
        }
    },
    sites: {
        list: function (params, callback) {
            var sql = "";
            db.query(sql, params, callback);
        },
        view: function (params, callback) {
            var sql = "";
            db.query(sql, params, callback);
        },
        add: function (params, callback) {
            var sql = "";
            db.query(sql, params, callback);
        },
        update: function (params, callback) {
            var sql = "";
            db.query(sql, params, callback);
        },
        delete: function (params, callback) {
            var sql = "";
            db.query(sql, params, callback);
        }
    },
    catalogs: {
        list: function (params, callback) {
            var sql = 'SELECT * FROM `catalogs` WHERE ?';
            db.query(sql, params, function(err, results){
                callback(err, results);
            });
        },
        view: function (params, callback) {
            var sql = 'SELECT * FROM `catalogs` WHERE ?';
            db.query(sql, params, function(err, results){
                callback(err, results);
            });
        },
        add: function (params, callback) {
            var sql = "";
            db.query(sql, params, callback);
        },
        update: function (params, callback) {
            var sql = "";
            db.query(sql, params, callback);
        },
        delete: function (params, callback) {
            var sql = "";
            db.query(sql, params, callback);
        }
    }
};