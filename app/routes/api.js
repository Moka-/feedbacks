'use strict';

var dal = require('../dal/dal');
var uuid = require('node-uuid');
var https = require('https');
var googleAuth = require('google-auth-library');
var verifier = require('google-id-token-verifier');
var async = require('async');
var express = require('express');
var router = express.Router();

var request = require('request');


// app's client IDs to check with audience in ID Token.
var clientId = '4644920241-or3rocgiqb3156n1r5j7r40taetolkja.apps.googleusercontent.com';

// TODO: remove previous implementation
// module.exports = {
//     visitors: {
//         list: function (req, res) {
//             dal.visitors.list(req.params, function (err, result) {
//                 res.json(result);
//             });
//         },
//         view: function (req, res) {
//             dal.visitors.view(req.params, function (err, result) {
//                 res.json(result);
//             });
//         },
//         add: function (req, res) {
//             req.query = 'INSERT INTO visitors SET';
//             handle_database(req, res);
//         },
//         update: function (req, res) {
//             handle_database(req, res);
//         },
//         delete: function (req, res) {
//             req.query = 'DELETE visitors WHERE id ='
//             handle_database(req, res);
//         }
//     },
//     feedbacks: {
//         list: function (req, res) {
//             var params = [req.params.app_instance, req.params.component_id];
//             dal.feedbacks.list(params, function (err, results) {
//                 res.json(results);
//             });
//         },
//         view: function (req, res) {
//             dal.feedbacks.view(req.params, function (err, results) {
//                 res.json(results);
//             });
//         },
//         add: function (req, res) {
//
//             console.log(req.body.visitor_id);
//             (new (new googleAuth).OAuth2).verifyIdToken(req.body.visitor_id, null, function (err, googleRes) {
//                 if (err) {
//                     console.error(err);
//                     throw err;
//                 }
//
//                 var googleAttributes = googleRes.getPayload();
//
//                 dal.visitors.view(googleAttributes.email, function (err, user) {
//                     var feedback = {
//                         id: uuid.v4(),
//                         app_instance: req.body.app_instance,
//                         component_id: req.body.component_id,
//                         visitor_id: googleAttributes.email,
//                         created_on: new Date().toISOString(),
//                         rating: req.body.rating,
//                         comment: req.body.comment
//                     };
//
//                     if (user.length == 0) {
//                         var visitor = {
//                             display_name: googleAttributes.given_name,
//                             avatar_url: googleAttributes.picture,
//                             id: googleAttributes.email
//                         };
//
//                         dal.visitors.add(visitor, function (err) {
//                             if (err) {
//                                 console.error(err);
//                                 throw err;
//                             }
//
//                             dal.feedbacks.add(feedback, function (err, results) {
//                                 if (err) {
//                                     console.log(err);
//                                     console.log(results);
//                                     res.json(err);
//                                 } else {
//                                     var widgetParams = [feedback.app_instance, feedback.component_id, feedback.id];
//                                     dal.feedbacks.view(widgetParams, function (err, results) {
//                                         res.json(results);
//                                     });
//                                 }
//                             });
//                         });
//                     } else {
//                         dal.feedbacks.add(feedback, function (err, results) {
//                             if (err) {
//                                 console.log(err);
//                                 console.log(results);
//                                 res.json(err);
//                             } else {
//                                 var widgetParams = [feedback.app_instance, feedback.component_id, feedback.id];
//                                 dal.feedbacks.view(widgetParams, function (err, results) {
//                                     res.json(results);
//                                 });
//                             }
//                         });
//                     }
//                 });
//             });
//         },
//         update: function (req, res) {
//             res.render('widget');
//         },
//         delete: function (req, res) {
//             res.render('widget');
//         }
//     },
//     widgets: {
//         list: function (req, res) {
//             var params = [req.params.app_instance];
//             dal.widgets.list(params, function (err, results) {
//                 res.json(results);
//             });
//         },
//         view: function (req, res) {
//             var params = [req.params.app_instance, req.params.component_id];
//             dal.widgets.view(params, function (err, widget) {
//                 if (widget.length == 0) {
//                     dal.widgets.settingsCopy(req.params.app_instance, function (err, appWidgetSettings) {
//                         var params = appWidgetSettings[0];
//
//                         params.component_id = req.params.component_id;
//                         params.catalog_id = null;
//                         dal.widgets.add(params, function (err, results) {
//                             res.json(results);
//                         });
//                     });
//                 } else {
//                     res.json(widget);
//                 }
//             });
//         },
//         add: function (req, res) {
//             res.render('widget');
//         },
//         update: function (req, res) {
//             dal.widgets.update(req.body, function (err, results) {
//                 res.json(results);
//             });
//         },
//         delete: function (req, res) {
//             res.render('widget');
//         }
//     },
//     sites: {
//         list: function (req, res) {
//             res.json(dummy_visitors);
//         },
//         view: function (req, res) {
//             res.render('widget');
//         },
//         add: function (req, res) {
//             res.render('widget');
//         },
//         update: function (req, res) {
//             res.render('widget');
//         },
//         delete: function (req, res) {
//             res.render('widget');
//         }
//     },
//     catalogs: {
//         list: function (req, res) {
//             console.log(req.params);
//             dal.catalogs.list(req.params, function (err, catalogs) {
//                 dal.widgets.list(req.params, function (err, widgets) {
//                     catalogs.forEach(function (current) {
//                         current.widgets = widgets.filter(function (value) {
//                             return value.catalog_id == current.id;
//                         });
//                     });
//
//                     var defaultCatalog = {
//                         name: "Default Catalog",
//                         id: 0,
//                         widgets: widgets.filter(function (value) {
//                             return value.catalog_id == null;
//                         })
//                     };
//
//                     catalogs.push(defaultCatalog);
//                     res.json(catalogs);
//                 });
//             });
//         },
//         view: function (req, res) {
//             dal.catalogs.view(req.params, function (err, results) {
//                 res.json(results);
//             });
//         },
//         add: function (req, res) {
//             var newCatalogs = [];
//
//             req.body.filter(function (catalog) {
//                 return catalog.new == true;
//             }).forEach(function (catalog) {
//                 newCatalogs.push({
//                     app_instance: catalog.app_instance,
//                     name: catalog.name
//                 });
//             });
//
//             if (newCatalogs.length > 0) {
//                 dal.catalogs.add(newCatalogs, function (err, results) {
//                     console.log(results);
//                     for (var i = 0; i < req.body.length; i++) {
//                         var updateParameters = [req.body[i].catalog_id];
//                         dal.widgets.updateCatalog(req.body[i].widgets, function (err, results) {
//
//                         });
//                     }
//                 });
//             }
//             /*for (var i = 0; i < req.body.length; i++) {
//              if(req.body[i].new == true){
//
//              }
//
//              dal.widgets.update(req.body[i].widgets);
//              }
//              dal.catalogs.add(req.body.filter(function (catalog) {
//              return catalog.new == true;
//              }), function (err, result) {
//              if(err){
//              throw err;
//              }
//
//              for (var i = 0; i < req.body.length; i++) {
//              dal.widgets.update(req.body[i].widgets);
//              }
//
//              });
//
//              for (var i = 0; i < req.body.length; i++) {
//              if (req.body[i].new == true) {
//
//              }
//              }*/
//         },
//         update: function (req, res) {
//             res.render('widget');
//         },
//         delete: function (req, res) {
//             res.render('widget');
//         }
//     }
// };

function verifyToken(token, callback) {
    request('https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=' + token, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            callback(error, JSON.parse(body));
        }
    })
}

router.route('/visitors')
    .get(function (req, res, next) {
        dal.visitors.list(req.params, function (err, result) {
            res.json(result);
        });
    })
    .post(function (req, res, next) {
        next(new Error('not implemented'));
    });

router.route('/visitors/:id')
    .get(function (req, res, next) {
        dal.visitors.view(req.params, function (err, result) {
            res.json(result);
        });
    })
    .put(function (req, res, next) {
        next(new Error('not implemented'));
    })
    .delete(function (req, res, next) {
        next(new Error('not implemented'));
    });

router.route('/feedbacks/:app_instance/:component_id')
    .get(function (req, res, next) {
        var params = [req.params.app_instance, req.params.component_id];
        dal.feedbacks.list(params, function (err, results) {
            res.json(results);
        });
    })
    .post(function (req, res, next) {
        var publisher;
        var feedback = {
            app_instance: req.params.app_instance,
            component_id: req.params.component_id,
            created_on: new Date().toISOString(),
            rating: req.body.rating,
            comment: req.body.comment
        };

        async.series([
                function (callback) {
                    (new (new googleAuth).OAuth2).verifyIdToken(req.body.publisher_token, null, function (err, googleRes) {
                        if (err) callback(err);

                        var googleAttributes = googleRes.getPayload();
                        publisher = {
                            display_name: googleAttributes.given_name,
                            avatar_url: googleAttributes.picture,
                            id: googleAttributes.email
                        };

                        feedback.visitor_id = publisher.id;

                        callback(null, publisher);
                    })
                },
                function (callback) { // add the publisher to visitors
                    dal.visitors.view(feedback.visitor_id, function (err, user) {
                        if (user.length == 0) {
                            dal.visitors.add(publisher, function (err) {
                                callback(err);
                            });
                        } else {
                            callback();
                        }
                    });
                },
                function (callback) { // add the feedback
                    dal.feedbacks.add(feedback, function (err, results) {
                        if (err) {
                            callback(err);
                        } else {
                            console.log(results);
                            callback(null, results);
                            // var widgetParams = [feedback.app_instance, feedback.component_id, feedback.id];
                            // dal.feedbacks.view(widgetParams, function (err, results) {
                            //     callback(err);
                            // });
                        }
                    });
                }
            ],
            function (err, results) {
                if (err) {
                    res.status(500).json({error: "Internal server error"});
                } else {
                    res.json(results);
                }
            }
        );
    });

router.route('/feedbacks/:app_instance/:component_id/:feedback_id')
    .get(function (req, res, next) {
        dal.feedbacks.view(req.params, function (err, results) {
            res.json(results);
        });
    })
    .put(function (req, res, next) {
        var app_instance = req.params.app_instance;
        var component_id = req.params.component_id;
        var feedback_id = req.params.feedback_id;

        verifyToken(req.body.user_id_token, function (err, tokenInfo) {
            dal.feedbacks.update(
                app_instance,
                component_id,
                feedback_id,
                tokenInfo.email,
                req.body.feedback.comment,
                req.body.feedback.rating,
                function (err, results) {
                    if (err)
                        res.error();
                    else
                        res.json(results);
                });
        });
    });

router.route('/feedbacks/:app_instance/:component_id/:feedback_id/:id_token')
    .delete(function (req, res, next) {

        var app_instance = req.params.app_instance;
        var component_id = req.params.component_id;
        var feedback_id = req.params.feedback_id;
        var id_token = req.params.id_token;

        verifyToken(id_token, function (err, tokenInfo) {
            dal.feedbacks.delete(
                app_instance,
                component_id,
                feedback_id,
                tokenInfo.email,
                function (err, results) {
                    if (err)
                        res.error();
                    else
                        res.json(results);
                });
        });
    });

router.route('/widgets/:app_instance')
    .get(function (req, res, next) {
        var params = [req.params.app_instance];

        dal.widgets.list(params, function (err, results) {
            res.json(results);
        });
    })
    .post(function (req, res, next) {
        next(new Error('not implemented'));
    });

router.route('/widgets/:app_instance/:component_id')
    .get(function (req, res, next) {
        var viewParams = [req.params.app_instance, req.params.component_id];

        dal.widgets.view(viewParams, function (err, widget) {
            if (widget.length == 0) {
                dal.widgets.settingsCopy(req.params.app_instance, function (err, appWidgetSettings) {
                    var params = req.params;

                    if (appWidgetSettings.length > 0) {
                        params = appWidgetSettings[0];
                        params.component_id = req.params.component_id;
                        params.catalog_id = null;
                    }

                    dal.widgets.add(params, function (err, results) {
                        res.json(results);
                    });
                });
            } else {
                res.json(widget);
            }
        });
    })
    .put(function (req, res, next) {
        dal.widgets.update(req.body, function (err, results) {
            res.json(results);
        });
    })
    .delete(function (req, res, next) {
        next(new Error('not implemented'));
    });

router.route('/catalogs/:app_instance')
    .get(function (req, res, next) {
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

                catalogs.unshift(defaultCatalog);
                res.json(catalogs);
            });
        });
    });

router.route('/catalogs')
    .post(function (req, res, next) {
        var catalogs = req.body.catalogs;
        var newCatalogsData = {app_instance: req.body.app_instance, catalogs: []};
        var deletedCatalogsData = {app_instance: req.body.app_instance, catalogs: []};
        var updatedCatalogsData = {app_instance: req.body.app_instance, catalogs: []};

        newCatalogsData.catalogs = catalogs.filter(function (catalog) {
            if (catalog.new != true) {
                updatedCatalogsData.catalogs.push(catalog);
            } else {
                return true;
            }
        });

        deletedCatalogsData.catalogs = catalogs.filter(function (catalog) {
            if (catalog.deleted != true) {
                updatedCatalogsData.catalogs.push(catalog);
            } else {
                return true;
            }
        }).map(function (catalog) {
            return catalog.id;
        });

        async.series([
                function (callback) {
                    if (newCatalogsData.catalogs.length > 0) {
                        dal.catalogs.add(newCatalogsData, function (err) {
                            if (err) {
                                console.error(err);
                            }
                            updateWidgets(newCatalogsData, callback);
                        });
                    } else {
                        callback();
                    }
                },
                function (callback) {
                    if (updatedCatalogsData.catalogs.length > 0) {
                        updateWidgets(updatedCatalogsData, callback);
                    } else {
                        callback();
                    }
                },
                function (callback) {
                    if (deletedCatalogsData.catalogs.length > 0) {
                        dal.catalogs.delete(deletedCatalogsData, function (err, result) {
                            if (err) {
                                console.error(err);
                                callback(err);
                            } else {
                                callback();
                            }
                        });
                    } else {
                        callback();
                    }
                }],
            function (err, result) {
                if (err) {
                    res.json(err);
                } else {
                    res.json(result);
                }
            });
    });

router.route('/catalogs/:app_instance/:catalog_id')
    .get(function (req, res, next) {
        next(new Error('not implemented'));
    })
    .put(function (req, res, next) {
        next(new Error('not implemented'));
    })
    .delete(function (req, res, next) {
        next(new Error('not implemented'));
    });

router.route('reply')
    .post(function (req, res, next) {
        dal.replies.add(req.body.params, function (err, results) {
            if (err) {
                res.json(err);
            } else {
                res.json(results);
            }
        })
    });
router.route('/replies/:feedback_ids')
    .get(function (req, res, next) {
        dal.replies.list(req.params.feedback_ids, function (err, results) {
            if (err) {
                res.json(err);
            } else {
                var repliesTree = listToTree(results);
                res.json(repliesTree);
            }
        });
    });

module.exports = router;


function listToTree(data) {
    var tree = {},
        childrenOf = {};
    var item, id, parentId;

    for (var i = 0, length = data.length; i < length; i++) {
        item = data[i];
        id = item['id'];
        parentId = item['recipient_id'];
        // every item may have children
        childrenOf[id] = childrenOf[id] || [];
        // init its children
        item['replies'] = childrenOf[id];
        if (parentId) {
            // init its parent's children object
            childrenOf[parentId] = childrenOf[parentId] || [];
            // push it into its parent's children object
            childrenOf[parentId].push(item);
        } else {
            if (!tree[item.feedback_id]) {
                tree[item.feedback_id] = [];
            }

            tree[item.feedback_id].push(item);
        }
    }

    return tree;
}

function updateWidgets(catalogsData, callback) {
    console.log(catalogsData.catalogs);
    for (var i = 0; i < catalogsData.catalogs.length; i++) {
        if (catalogsData.catalogs[i].deleted == false &&
            catalogsData.catalogs[i].id != 0 &&
            catalogsData.catalogs[i].widgets.length > 1) {
            var widgetIds = catalogsData.catalogs[i].widgets.map(function (obj) {
                return '\'' + obj.component_id + '\'';
            }).join(",");

            var updateParameters = {
                catalog_id: catalogsData.catalogs[i].id,
                app_instance: catalogsData.app_instance,
                widgetIds: widgetIds
            };
            dal.widgets.updateCatalog(updateParameters, function (err, results) {
                console.log(results);
                if (err) {
                    console.error(err);
                    callback();

                    return;
                }
            });
        }
    }

    callback();
}