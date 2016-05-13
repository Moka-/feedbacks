'use strict';

var dal = require('../dal/dal');
var uuid = require('node-uuid');
var https = require('https');
var googleAuth = require('google-auth-library');
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
            var params = [req.params.app_instance, req.params.component_id];
            dal.feedbacks.list(params, function (err, results) {
                res.json(results);
            });
        },
        view: function (req, res) {
            dal.feedbacks.view(req.params, function (err, results) {
                res.json(results);
            });
        },
        add: function (req, res) {
            /*req.body = {
                id: "fdsfdsfssd",
                app_instance: '4a8eda33-6035-4c65-9cf6-6befeaf2d2af',
                component_id: 'comp-inx9esxf',
                comment_title: "Le Title",
                comment: "BananasV3",
                rating: 10,
                visitor_id: "eyJhbGciOiJSUzI1NiIsImtpZCI6ImU3ZGJmNTI2ZjYzOWMyMTRjZDc3YjM5NmVjYjlkN2Y4MWQ0N2IzODIifQ.eyJpc3MiOiJhY2NvdW50cy5nb29nbGUuY29tIiwiYXRfaGFzaCI6Ikdmbm9rS21fdWxqTjhhYU4yRjl0OEEiLCJhdWQiOiI0NjQ0OTIwMjQxLW9yM3JvY2dpcWIzMTU2bjFyNWo3cjQwdGFldG9sa2phLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwic3ViIjoiMTA5MTUwNzg4NTQ1NzI3NjAxMDcxIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImF6cCI6IjQ2NDQ5MjAyNDEtb3Izcm9jZ2lxYjMxNTZuMXI1ajdyNDB0YWV0b2xramEuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJlbWFpbCI6InN5ZG9ydWsua29zdHlhQGdtYWlsLmNvbSIsImlhdCI6MTQ2MzE0MTkwMywiZXhwIjoxNDYzMTQ1NTAzLCJuYW1lIjoiS29zdHlhIFN5ZG9ydWsiLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDQuZ29vZ2xldXNlcmNvbnRlbnQuY29tLy0xS24yNXo4UHkxMC9BQUFBQUFBQUFBSS9BQUFBQUFBQUQ0Yy92Sm96SnJqdkpXcy9zOTYtYy9waG90by5qcGciLCJnaXZlbl9uYW1lIjoiS29zdHlhIiwiZmFtaWx5X25hbWUiOiJTeWRvcnVrIiwibG9jYWxlIjoiZW4ifQ.CT254AvDtrI2vRuBezrLW8fZB0156TX7jpG_czgds86QKR5E8N4MczlBxGZ5Ven_Q_BsvteEv8oxknJ_guY8XyKopgo36i30T2Y3AS3fLOtQ3rLJYGHhf-ECtNDuLOkvXhekFCEnKSGcI7jYRa4N947TZ_rajVfExwiyzLy-aYjVj_WExWH6CIuw4nqjNRr_918HWmjX5Lx4v8yZQy6Vy0GOCy6iyFXWK6IAFe2RP9mPPuJBNi1NI-GbxsYLy05tnelSbsjLuaS_Orm299SM7NQyOsE9S4Od0nbdqOTr_SoFDe2LNoiaua9czz7lz16EWBTu8KKxqUwq6TVkZzDh6Q"
            }
            console.log(req.body);*/

            (new (new googleAuth).OAuth2).verifyIdToken(req.body.visitor_id, null, function (err, googleRes) {
                if(err) {
                    console.error(err);
                    throw err;
                }

                var googleAttributes = googleRes.getPayload();

                dal.visitors.view(googleAttributes.email, function (err, user) {
                    var feedback = {
                        id: uuid.v4(),
                        app_instance: req.body.app_instance,
                        component_id: req.body.component_id,
                        visitor_id: googleAttributes.email,
                        created_on: new Date().toISOString(),
                        rating: req.body.rating,
                        comment: req.body.comment
                    };

                    if (user.length == 0) {
                        var visitor = {
                            display_name: googleAttributes.given_name,
                            avatar_url: googleAttributes.picture,
                            id: googleAttributes.email
                        };

                        dal.visitors.add(visitor, function (err) {
                            if (err){
                                console.error(err);
                                throw err;
                            }

                            dal.feedbacks.add(feedback, function (err, results) {
                               if (err){
                                    console.log(err);
                                    console.log(results);
                                    res.json(err);
                                }else {
                                    var widgetParams = [feedback.app_instance, feedback.component_id, feedback.id];
                                    dal.feedbacks.view(widgetParams, function(err, results){
                                        res.json(results);
                                    });
                                }
                            });
                        });
                    } else {
                        dal.feedbacks.add(feedback, function (err, results) {
                            if (err){
                                console.log(err);
                                console.log(results);
                                res.json(err);
                            } else {
                                var widgetParams = [feedback.app_instance, feedback.component_id, feedback.id];
                                dal.feedbacks.view(widgetParams, function(err, results){
                                    res.json(results);
                                });
                            }
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
            var params = [req.params.app_instance, req.params.component_id];
            dal.widgets.view(params, function (err, results) {
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

function addFeedback() {
    var feedback = req.body;

    feedback.id = uuid.v4();
    feedback.created_on = new Date().toISOString();
    feedback.visitor_id = googleAttributes.email;

    dal.feedbacks.add(feedback, function (err, results) {
        res.json(results);
    });
}