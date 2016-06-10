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
            
            console.log(req.body.visitor_id);
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
                               } else {
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
            var params = [req.params.app_instance];
            dal.widgets.list(params, function (err, results) {
                res.json(results);
            });
        },
        view: function (req, res) {
            var params = [req.params.app_instance, req.params.component_id];
            dal.widgets.view(params, function (err, widget) {
                if (widget.length == 0) {
                    dal.widgets.getSettingsCopy(req.params.app_instance, function (err, appWidgetSettings) {
                        var params = appWidgetSettings[0];
                        params.component_id = req.params.component_id;
                        console.log(params);
                        dal.widgets.add(params, function (err, results) {
                            res.json(results);
                        });
                    });
                } else {
                    res.json(widget);
                }
            });
        },
        add: function (req, res) {
            res.render('widget');
        },
        update: function (req, res) {
            dal.widgets.update(req.body, function (err, results) {
                res.json(results);
            });
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
                dal.widgets.list([req.params.app_instance], function (err, widgets) {
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
