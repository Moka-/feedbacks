'use strict';

exports.widget = function(req, res){
    res.render('widget');
};

exports.settings = function(req, res){
    res.render('widget');
};

exports.partials = function (req, res) {
    var name = req.params.name;
    res.render('partials/' + name);
};

