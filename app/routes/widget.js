'use strict';

exports.index = function(req, res){
    res.render('index');
};
exports.index1 = function(req, res){
    console.log("1");
    res.render('index');
};
exports.index2 = function(req, res){
    console.log("2");
    res.render('index');
};
exports.index3 = function(req, res){
    console.log("3");
    res.render('index');
};
exports.index4 = function(req, res){
    console.log("4");
    res.render('index');
};

exports.partials = function (req, res) {
    var name = req.params.name;
    res.render('partials/' + name);
};

