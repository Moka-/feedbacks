'use strict';

var dal = require('../dal/dal');
var uuid = require('node-uuid');
const https = require('https');

//noinspection JSUnresolvedVariable
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
            req.body = {
                
                id:"fdsfdsfssd",
                comment
                    :
                    "this is a test",
                comment_title
                    :
                    "Quisque erat eros, viverra eget, congue eget, semper rutrum, nulla.",
                created_on
                    :
                    "2015-07-28T21:00:00.000Z",
                edited_on
                    :
                    "2016-04-25T21:00:00.000Z",
                rating
                    :
                    10,
                visitor_id
                    :
                    "eyJhbGciOiJSUzI1NiIsImtpZCI6ImM5YmNkMGNjZjU5Yzc4OTI3MzBlNzY1ZmM3NTYzZjU2ZGMwMmJkOWUifQ.eyJpc3MiOiJhY2NvdW50cy5nb29nbGUuY29tIiwiYXRfaGFzaCI6InRhV25WOXdmdlV3bzluOTB0OGh3V2ciLCJhdWQiOiI0NjQ0OTIwMjQxLW9yM3JvY2dpcWIzMTU2bjFyNWo3cjQwdGFldG9sa2phLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwic3ViIjoiMTA0NjI5MjUzOTk5MDY1MTQwNTkyIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImF6cCI6IjQ2NDQ5MjAyNDEtb3Izcm9jZ2lxYjMxNTZuMXI1ajdyNDB0YWV0b2xramEuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJlbWFpbCI6ImVibW9oYUBnbWFpbC5jb20iLCJpYXQiOjE0NjI2MjM1MDMsImV4cCI6MTQ2MjYyNzEwMywibmFtZSI6Ik1va2EiLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tLy1nUEdxVkc5allyZy9BQUFBQUFBQUFBSS9BQUFBQUFBQUx3RS9mUEV3amQ4NXdfRS9zOTYtYy9waG90by5qcGciLCJnaXZlbl9uYW1lIjoiTW9rYSIsImZhbWlseV9uYW1lIjoiLiIsImxvY2FsZSI6ImVuIn0.G8FnvMDte-xWKn1a606LqEVJWQd8r3HOyC0nlEYdzNkOmPmr0hUORFR01xmRSRLkMqsDHqagvF33jw7ukXc9gtOahCPe8bE5mzH08DOEy0O0sRLd53PFgpKcdfAKvjV_yQt4cEUhX16ERkQ8u32-kfFO8OmfohfLR8OZna4iwwUNaBpIv3hS3U6JsyqP414KF1t3WK4iwfbvNuk1m4_rSvIs4tMYaHIiTl_fKBdX73rcBb1sdT7CoiO7wYX7buWU9Jz0qrH3oEhLF1K8vJTIZKTnYeo2YBDC6-5NUU8fiE5spJabYTlQLZUtwlzTUe0mAkz3oKny9_AQF8-NqsTqYw",
                widget_id
                    :
                    "bcac1c8a-3b11-4374-aff7-e865a14c2681comp-imxne0xw"
            }
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
            var tokenInfoUrl = 'https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=' + feedback.visitor_id;

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
            dal.widgets.view(req.params, function (err, results) {
                res.json(results);
            });
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
    },
    catalogs: {
        list: function (req, res) {
            dal.catalogs.list(req.params, function (err, catalogs) {
                dal.widgets.view({app_instance: req.params.app_instance}, function (err, widgets) {
                    catalogs.forEach(function(current){
                        current.widgets = widgets.filter(function (value) {
                            return value.app_instance == current.app_instance &&
                                value.catalog_id == current.id;
                        });
                    });
                    res.json(catalogs);
                });
            });
        },
        view: function (req, res) {
            dal.catalogs.view(req.params, function (err, results) {
                res.json(results);
            });
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