'use strict';

var dal = require('../dal/dal');
var uuid = require('node-uuid');
const https = require('https');

module.exports = {
    visitors: {
        list: function (req, res) {
            dal.visitors.list(req.params, function (err, result) {
                res.json(result);
            });
        },
        view: function (req, res) {
            dal.visitors.view(req.params, function (err, result) {
                res.json(result);
            });
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
            /*
             widget_id: $scope.$parent.widget_id,
             comment: $scope.new_feedback.comment,
             rating: $scope.new_feedback.rating,
             id_token: $scope.logged_user.id_token,
             full_name: $scope.logged_user.full_name,
             avatar_url: $scope.logged_user.image_url
             */

            var feedback = req.body;

            feedback.id = uuid.v4();
            feedback.created_on = new Date().toISOString();
            var tokenInfoUrl = 'https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=' + params.id_token;

            https.get(tokenInfoUrl, function (googleRes) {
                console.log('statusCode: ', googleRes.statusCode);
                console.log('headers: ', googleRes.headers);
                console.log('email: ', googleRes.body.email);
                feedback.visitor_id = res.body.email;

                dal.visitors.view(feedback.visitor_id, function (err, user) {
                    if (user.length == 0) {
                        var visitor = {
                            google_id_token: req.body.id_token,
                            display_name: req.body.full_name,
                            avatar_url: googleRes.body.picture,
                            id: res.body.email
                        };
                        dal.visitors.add(visitor, function (err, result) {
                            dal.feedbacks.add(params, function (err, results) {
                                res.json(results);
                            });
                        });
                    } else {
                        dal.feedbacks.add(params, function (err, results) {
                            res.json(results);
                        });
                    }
                });
            });
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