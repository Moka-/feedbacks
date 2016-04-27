'use strict';

var fs = require('fs');
var dummy_visitors = JSON.parse(fs.readFileSync('./app/dummy_data/visitors.json', 'utf8'));
var dummy_feedbacks = JSON.parse(fs.readFileSync('./app/dummy_data/feedbacks.json', 'utf8'));

exports.visitors = {
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

exports.feedbacks = {
    list: function (req, res) {
        var id = req.params.widgetid;

        var results = dummy_feedbacks.filter(function(obj){return obj.widget_id == id ;});
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