'use strict';

exports.widget = function(req, res){
    res.render('widget');
};

exports.partials = function (req, res) {
    var name = req.params.name;
    res.render('partials/' + name);
};

exports.templates = function (req, res) {
    var name = req.params.name;
    res.render('partials/templates/' + name);
};
