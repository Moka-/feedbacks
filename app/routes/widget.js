'use strict';

exports.index = function(req, res){
    res.render('index');
};

exports.widget = function(req, res){
    res.render('widget');
};

exports.settings = function(req, res){
    res.render('settings');
};

exports.dashboard = function(req, res){
    res.render('dashboard');
};

exports.partials = function (req, res) {
    var name = req.params.name;
    res.render('partials/' + name);
};

