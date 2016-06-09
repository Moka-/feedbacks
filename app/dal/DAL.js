'use strict';

var db = require('./db');

var widgetFeedbacksQuery =
    'SELECT f.*, v.display_name, v.avatar_url ' +
    'FROM `feedbacks` f,`visitors` v ' +
    'WHERE f.visitor_id = v.id ' +
    'AND f.app_instance = ? ' +
    'AND f.component_id = ?';

var feedbackQuery = widgetFeedbacksQuery + ' AND f.id = ?';

var defaultAppSettings =
    'SELECT * ' +
    'FROM `widgets` ' +
    'WHERE app_instance = ? ' +
    'LIMIT 1';

var widgetSettingsQuery =
    'SELECT * ' +
    'FROM `widgets` w ' +
    'WHERE w.app_instance = ? ' +
    'AND w.component_id = ?';

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
            var sql = widgetSettingsQuery;
            db.query(sql, params, function (err, results) {
                callback(err, results);
            });
        },
        getSettingsCopy: function (params, callback) {
            var sql = defaultAppSettings;
            db.query(sql, params, function (err, results) {
                callback(err, results);
            });
        },
        add: function (params, callback) {
            var sql = 'INSERT INTO `widgets` SET ?';
            db.query(sql, params, function (err, results) {
                console.log(results);
                callback(err, results);
            });
        },
        update: function (params, callback) {
            var queryParams = [params, params.app_instance, params.component_id];
            var sql = "UPDATE `widgets` SET ? WHERE app_instance = ? AND component_id = ?";

            db.query(sql, queryParams, callback);
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