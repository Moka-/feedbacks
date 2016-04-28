var db = require('./db');

// In here you should perform all your queries
module.exports = {
    visitors: {
        list: function (params, callback) {
            var sql = 'SELECT * FROM `visitors`'; // TODO: consider removeing the ` from this entire file
            db.query(sql, params, callback);
        },
        view: function (params, callback) {
            var sql = 'SELECT * FROM `visitors` WHERE ?';
            handle_database(req, res);
        },
        add: function (req, res) {
            var sql = 'INSERT INTO visitors SET';
            handle_database(req, res);
        },
        update: function (req, res) {
            var sql = "";
            handle_database(req, res);
        },
        delete: function (req, res) {
            var sql = 'DELETE visitors WHERE id ='
            handle_database(req, res);
        }
    },
    feedbacks: {
        list: function (params, callback) {
            var sql = 'SELECT f.*, v.display_name, v.avatar_url FROM `feedbacks` f,`visitors` v WHERE f.visitor_id = v.id AND ?';
            db.query(sql, params, callback);
        },
        view: function (req, res) {
            var sql = "";
            res.render('widget');
        },
        add: function (req, res) {
            var params = {
                id: "fdsfdsfssd",
                comment: "this is a test",
                comment_title: "Quisque erat eros, viverra eget, congue eget, semper rutrum, nulla.",
                created_on: "2015-07-28T21:00:00.000Z",
                edited_on: "2016-04-25T21:00:00.000Z",
                rating: 10,
                visitor_id: "8884d4e3-2fda-4dbe-a0b8-605fccaa3b0c",
                widget_id: "bcac1c8a-3b11-4374-aff7-e865a14c2681comp-imxne0xw"
            }
            var sql = 'INSERT INTO feedbacks SET ?';
            handle_database1(req, res, params);
        },
        update: function (req, res) {
            var sql = "";
            res.render('widget');
        },
        delete: function (req, res) {
            var sql ="";
            res.render('widget');
        }
    },
    widgets: {
        list: function (req, res) {
            var sql = "";
            res.json(dummy_visitors);
        },
        view: function (req, res) {
            var sql = "";
            res.render('widget');
        },
        add: function (req, res) {
            var sql = "";
            res.render('widget');
        },
        update: function (req, res) {
            var sql = "";
            res.render('widget');
        },
        delete: function (req, res) {
            var sql = "";
            res.render('widget');
        }
    },
    sites: {
        list: function (req, res) {
            var sql = "";
            res.json(dummy_visitors);
        },
        view: function (req, res) {
            var sql = "";
            res.render('widget');
        },
        add: function (req, res) {
            var sql = "";
            res.render('widget');
        },
        update: function (req, res) {
            var sql = "";
            res.render('widget');
        },
        delete: function (req, res) {
            var sql = "";
            res.render('widget');
        }
    }
};