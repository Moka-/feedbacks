'use strict';

var fs = require('fs');
var dummy_visitors = JSON.parse(fs.readFileSync('./app/dummy_data/visitors.json', 'utf8'));
var dummy_feedbacks = JSON.parse(fs.readFileSync('./app/dummy_data/feedbacks.json', 'utf8'));

var mysql = require('mysql');
var pool = mysql.createPool({
    connectionLimit: 100, //important
    host: 'wix-feedbacks-test.cohruqtd5dnp.us-west-2.rds.amazonaws.com',
    port: '1337',
    user: 'feedback',
    password: 'Aa123456',
    database: 'wix_feedbacks_test',
    debug: true
});

function handle_database(req, res) {
    pool.getConnection(function (err, connection) {
        if (err) {
            connection.release();
            console.log(err);
            res.json(err);
            return;
        }

        console.log('connected as id ' + connection.threadId);

        connection.config.queryFormat = function (query, values) {
            if (!values) return query;
            return query.replace(/:(\w+)/g, function (txt, key) {
                if (values.hasOwnProperty(key)) {
                    return this.escape(values[key]);
                }
                return txt;
            }.bind(this));
        };

        connection.query(req.sql, function (err, rows) {
            connection.release();
            if (!err) {
                res.json(rows);
            }
        });

        connection.on('error', function (err) {
            console.log(err);
            res.json(err);
            return;
        });
    });
}

var widgetAvgQuery = 'SELECT widget_id,ROUND(AVG(t.rating),1) FROM feedbacks t GROUP BY widget_id';
var insertFeedback = 'INSERT ' +
                     'INTO `feedbacks` ' +
                     '(`id`, `widget_id`, `visitor_id`, `created_on`, `edited_on`, `rating`, `comment`, `comment_title`) ' +
                     'VALUES ' +
                     '(<{id: }>,<{widget_id: }>, <{visitor_id: }>, <{created_on: }>, <{edited_on: }>, <{rating: }>, <{comment: }>, <{comment_title: }>)'

exports.visitors = {
    list: function (req, res) {
        req.query = 'SELECT * FROM visitors';
        req.params = '';
        handle_database(req, res);
    },
    view: function (req, res) {
        console.log(req.params.id);
        req.sql = 'SELECT * FROM `visitors` WHERE `id`=' + pool.escape(req.params.id);
        handle_database(req, res);
    },
    add: function (req, res) {
        req.sql = 'INSERT INTO `visitors` SET';
        handle_database(req, res);
    },
    update: function (req, res) {
        handle_database(req, res);
    },
    delete: function (req, res) {
        req.sql = 'DELETE `visitors` WHERE `id` ='
        handle_database(req, res);
    }
};

exports.feedbacks = {
    list: function (req, res) {
        var id = req.params.widgetid;
        /*
        var results = dummy_feedbacks.filter(function (obj) {
            return obj.widget_id == id;
        });
        console.log(results.length);
        res.json(results);*/
        req.sql = 'SELECT * FROM `feedbacks` where `widget_id` = ' + pool.escape(id);
        handle_database(req, res);
    },
    view: function (req, res) {
        res.render('widget');
    },
    add: function (req, res) {
        req.sql = 'INSERT INTO feedbacks SET ';
        handle_database(req, res);
    },
    update: function (req, res) {
        res.render('widget');
    },
    delete: function (req, res) {
        res.render('widget');
    }
};

exports.widgets = {
    list: function (req, res) {
        res.json(dummy_visitors);
    },
    view: function (req, res) {
        res.render('widget');
    },
    add: function (req, res) {
        res.render('widget');
    },
    update: function (req, res) {
        res.render('widget');
    },
    delete: function (req, res) {
        res.render('widget');
    }
};

exports.sites = {
    list: function (req, res) {
        res.json(dummy_visitors);
    },
    view: function (req, res) {
        res.render('widget');
    },
    add: function (req, res) {
        res.render('widget');
    },
    update: function (req, res) {
        res.render('widget');
    },
    delete: function (req, res) {
        res.render('widget');
    }
};