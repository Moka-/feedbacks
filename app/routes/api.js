'use strict';

var dal = require('../dal/dal');
var uuid = require('node-uuid');
var https = require('https');
var googleAuth = require('google-auth-library');

var express = require('express');
var router = express.Router();


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
                if (err) {
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
                            if (err) {
                                console.error(err);
                                throw err;
                            }

                            dal.feedbacks.add(feedback, function (err, results) {
                                if (err) {
                                    console.log(err);
                                    console.log(results);
                                    res.json(err);
                                } else {
                                    var widgetParams = [feedback.app_instance, feedback.component_id, feedback.id];
                                    dal.feedbacks.view(widgetParams, function (err, results) {
                                        res.json(results);
                                    });
                                }
                            });
                        });
                    } else {
                        dal.feedbacks.add(feedback, function (err, results) {
                            if (err) {
                                console.log(err);
                                console.log(results);
                                res.json(err);
                            } else {
                                var widgetParams = [feedback.app_instance, feedback.component_id, feedback.id];
                                dal.feedbacks.view(widgetParams, function (err, results) {
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
                    dal.widgets.settingsCopy(req.params.app_instance, function (err, appWidgetSettings) {
                        var params = appWidgetSettings[0];

                        params.component_id = req.params.component_id;
                        params.catalog_id = null;
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
            console.log(req.params);
            dal.catalogs.list(req.params, function (err, catalogs) {
                dal.widgets.list(req.params, function (err, widgets) {
                    catalogs.forEach(function (current) {
                        current.widgets = widgets.filter(function (value) {
                            return value.catalog_id == current.id;
                        });
                    });

                    var defaultCatalog = {
                        name: "Default Catalog",
                        id: 0,
                        widgets: widgets.filter(function (value) {
                            return value.catalog_id == null;
                        })
                    };

                    catalogs.push(defaultCatalog);
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
            var newCatalogs = [];

            req.body.filter(function (catalog) {
                return catalog.new == true;
            }).forEach(function (catalog) {
                newCatalogs.push({
                    app_instance: catalog.app_instance,
                    name: catalog.name
                });
            });

            if (newCatalogs.length > 0) {
                dal.catalogs.add(newCatalogs, function (err, results) {
                    console.log(results);
                    for (var i = 0; i < req.body.length; i++) {
                        var updateParameters = [req.body[i].catalog_id];
                        dal.widgets.updateCatalog(req.body[i].widgets, function (err, results) {

                        });
                    }
                });
            }
            /*for (var i = 0; i < req.body.length; i++) {
             if(req.body[i].new == true){

             }

             dal.widgets.update(req.body[i].widgets);
             }
             dal.catalogs.add(req.body.filter(function (catalog) {
             return catalog.new == true;
             }), function (err, result) {
             if(err){
             throw err;
             }

             for (var i = 0; i < req.body.length; i++) {
             dal.widgets.update(req.body[i].widgets);
             }

             });

             for (var i = 0; i < req.body.length; i++) {
             if (req.body[i].new == true) {

             }
             }*/
        },
        update: function (req, res) {
            res.render('widget');
        },
        delete: function (req, res) {
            res.render('widget');
        }
    }
};

router.route('/visitors')
    .get(function(req, res, next) {
        dal.visitors.list(req.params, function (err, result) {
            res.json(result);
        });
    })
    .post(function(req, res, next) {
        req.query = 'INSERT INTO visitors SET';
        handle_database(req, res);
    });

router.route('/visitor/:id')
    .get(function(req, res, next) {
        dal.visitors.view(req.params, function (err, result) {
            res.json(result);
        });
    })
    .post(function(req, res, next) {
        next(new Error('not implemented'));
    })
    .delete(function (req, res, next) {
        next(new Error('not implemented'));
    });

router.route('/feedbacks/:app_instance/:component_id')
    .get(function(req, res, next) {
        var params = [req.params.app_instance, req.params.component_id];
        dal.feedbacks.list(params, function (err, results) {
            res.json(results);
        });
    })
    .post(function(req, res, next) {
        (new (new googleAuth).OAuth2).verifyIdToken(req.body.visitor_id, null, function (err, googleRes) {
            if (err) {
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
                        if (err) {
                            console.error(err);
                            throw err;
                        }

                        dal.feedbacks.add(feedback, function (err, results) {
                            if (err) {
                                console.log(err);
                                console.log(results);
                                res.json(err);
                            } else {
                                var widgetParams = [feedback.app_instance, feedback.component_id, feedback.id];
                                dal.feedbacks.view(widgetParams, function (err, results) {
                                    res.json(results);
                                });
                            }
                        });
                    });
                } else {
                    dal.feedbacks.add(feedback, function (err, results) {
                        if (err) {
                            console.log(err);
                            console.log(results);
                            res.json(err);
                        } else {
                            var widgetParams = [feedback.app_instance, feedback.component_id, feedback.id];
                            dal.feedbacks.view(widgetParams, function (err, results) {
                                res.json(results);
                            });
                        }
                    });
                }
            });
        });
    });

router.route('/feedback/:app_instance/:component_id/:feedback_id')
    .get(function(req, res, next) {
        next(new Error('not implemented'));

        // dal.feedbacks.view(req.params, function (err, results) {
        //     res.json(results);
        // });
    })
    .put(function(req, res, next) {
        next(new Error('not implemented'));
    })
    .delete(function(req, res, next) {
        next(new Error('not implemented'));
    });

// app.get('/visitors', api.visitors.list);
// app.post('/visitors', api.visitors.add);
// app.get('/visitor/:id', api.visitors.view);
// app.put('/visitor/:id', api.visitors.update);
// app.delete('/visitor/:id', api.visitors.delete);

// app.get('/feedbacks/:app_instance/:component_id', api.feedbacks.list);
// app.post('/feedbacks', api.feedbacks.add);
// app.get('/feedback/:id', api.feedbacks.view);
// app.put('/feedback/:id', api.feedbacks.update);
// app.delete('/feedback/:id', api.feedbacks.delete);

app.get('/widgets', api.widgets.list);
app.post('/widgets', api.widgets.add);
app.get('/widgets/:app_instance/:component_id', api.widgets.view);
app.put('/widgets', api.widgets.update);
app.delete('/widget/:id', api.widgets.delete);

app.get('/catalogs/:app_instance', api.catalogs.list);
app.post('/catalogs', api.catalogs.add);
//app.get('/catalogs/:id', api.catalogs.view);
app.put('/catalogs/:id', api.catalogs.update);
app.delete('/catalogs/:id', api.catalogs.delete);

module.exports = router;