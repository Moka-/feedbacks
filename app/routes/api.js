'use strict';

var dal = require('../dal/dal');

var widgetAvgQuery = 'SELECT widget_id,ROUND(AVG(t.rating),1) FROM feedbacks t GROUP BY widget_id';
var insertFeedback = 'INSERT INTO feedbacks SET ?';

module.exports = {
    visitors: {
        list: function (req, res) {
            req.sql = 'SELECT * FROM `visitors`';
            handle_database(req, res);
        },
        view: function (req, res) {
            console.log(req.params.id);
            req.sql = 'SELECT * FROM `visitors` WHERE ?';
            handle_database(req, res);
        },
        add: function (req, res) {
            req.query = 'INSERT INTO visitors SET';
            handle_database(req, res);
        },
        update: function (req, res) {
            handle_database(req, res);
        },
        delete: function (req, res) {
            req.query = 'DELETE visitors WHERE id ='
            handle_database(req, res);
        }
    },
    feedbacks: {
        list: function (req, res) {
            var params = {widget_id: req.params.widget_id};
            dal.feedbacks.list(params, function (err, results) {
                res.json(results);
            });
        },
        view: function (req, res) {

        },
        add: function (req, res) {
            // var params = {
            //     id:"fdsfdsfssd",
            // comment
            //     :
            //     "this is a test",
            // comment_title
            //     :
            //     "Quisque erat eros, viverra eget, congue eget, semper rutrum, nulla.",
            // created_on
            //     :
            //     "2015-07-28T21:00:00.000Z",
            // edited_on
            //     :
            //     "2016-04-25T21:00:00.000Z",
            // rating
            //     :
            //     10,
            // visitor_id
            //     :
            //     "8884d4e3-2fda-4dbe-a0b8-605fccaa3b0c",
            // widget_id
            //     :
            //     "bcac1c8a-3b11-4374-aff7-e865a14c2681comp-imxne0xw"
            // }

            handle_database1(req, res, params);
            console.log('111');
        },
        update: function (req, res) {
            res.render('widget');
        },
        delete: function (req, res) {
            res.render('widget');
        }
    },
    widgets: {
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
    },
    sites: {
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
    }
};