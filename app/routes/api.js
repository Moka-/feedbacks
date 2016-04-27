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

        connection.query(req.query, req.params, function (err, rows) {
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
var dummy_visitors = JSON.parse(fs.readFileSync('./app/dummy_data/visitors.json', 'utf8'));
var dummy_feedbacks = JSON.parse(fs.readFileSync('./app/dummy_data/feedbacks.json', 'utf8'));

exports.visitors = {
    list: function (req, res) {
        req.query = 'SELECT * FROM visitors';
        req.params = '';
        handle_database(req, res);
    },
    view: function (req, res) {
        console.log('1'); // moka's magnificent work
        //console.log(params); // params undefined, throws exception
        console.log(req.params); // working log
        var id = req.params.id;
        req.query = 'SELECT * FROM visitors WHERE id = ' + pool.escape(id);
        //andle_database(req, res); why comment
        //res.json(params);// again, params does not exist
        res.json(req.params);//
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
};

exports.feedbacks = {
    list: function (req, res) {
        var id = req.params.widgetid;

        var results = dummy_feedbacks.filter(function (obj) {
            return obj.widget_id == id;
        });
        console.log(results.length);
        res.json(results);
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