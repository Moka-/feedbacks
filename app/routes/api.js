'use strict';

var dal = require('../dal/dal');
//var uuid = require('node-uuid');
var https = require('https');
var googleAuth = require('google-auth-library');
var async = require('async');
var express = require('express');
var router = express.Router();
//var analysis = require('../bl/analysis');
//var popularity = require('../bl/popularity-algorithm');
var request = require('request');

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/FeedbacksDB');
var models = require('../dal/models')(mongoose);
var ObjectId = mongoose.Types.ObjectId;

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

// router.route('/visitors')
//     // .get(function (req, res, next) {
//     //     dal.visitors.list(req.params, function (err, result) {
//     //         res.json(result);
//     //     });
//     // })
//     .post(function (req, res, next) {
//         next(new Error('not implemented'));
//     });

router.route('/visitor/:id_token')
    .get(function (req, res) {
        var id_token = req.params.id_token;

        verifyToken(id_token, function (err, user) {
            if (err)
                res.error();
            else {
                var email = user.email,
                    name = user.given_name,
                    picture_url = user.picture;

                models.Visitor.findOneOrCreate({email}, {email, name, picture_url}, function (err, visitor) {
                    if (err)
                        res.error();
                    else
                    res.json(visitor);
                });
            }
        });
    });
    // .put(function (req, res, next) {
    //     next(new Error('not implemented'));
    // })
    // .delete(function (req, res, next) {
    //     next(new Error('not implemented'));
    // });

router.route('/feedbacks/:widget_id')
    .get(function (req, res, next) {
        var target_id = new ObjectId(req.params.widget_id);

        models.Feedback.find({ target_id, deleted: false }, function (err, feedbacks) {
            res.json(feedbacks);
        });
    })
    .post(function (req, res, next) {
        verifyToken(req.body.publisher_token, function (err, tokenInfo) {
            var email = tokenInfo.email,
                name = tokenInfo.given_name,
                picture_url = tokenInfo.picture;

            models.Visitor.findOneOrCreate({email}, {email, name, picture_url}, function (err, visitor) {
                var target_id = new ObjectId(req.params.widget_id),
                    visitor_id = visitor._id,
                    visitor_email = visitor.email,
                    visitor_name = visitor.name,
                    visitor_picture_url = visitor.picture_url,
                    comment = req.body.comment,
                    rating = req.body.rating;

                var newFeedback = new models.Feedback({ target_id, visitor_id, visitor_email, visitor_name, visitor_picture_url, comment, rating });
                newFeedback.save(function (err, feedback) {
                    res.json(feedback);
                })
            })
        });
    })
    .put(function (req, res, next) {
        var token = req.body.user_id_token;
        var updatedFeedback = req.body.feedback;

        verifyToken(token, function (err, user) {
            models.Feedback.findOne(
                {_id: updatedFeedback._id, visitor_email: user.email},
                function (err, feedback) {
                    if
                        (err) res.error();
                    else {
                        feedback.comment = updatedFeedback.comment;
                        feedback.rating = updatedFeedback.rating;
                        feedback.visitor_name = user.name;
                        feedback.visitor_picture_url = user.picture;
                        feedback.edited_on = new Date();

                        feedback.save();

                        res.send(feedback);
                    }
                }
            );
        });
    });

router.route('/feedbacks/delete/:feedback_id')
    .post(function (req, res, next) {
        var feedback_id = req.params.feedback_id;
        var token = req.body.user_id_token;

        verifyToken(token, function (err, user) {
            models.Feedback.findOne(
                {_id: feedback_id, visitor_email: user.email},
                function (err, feedback) {
                    if
                        (err) res.error();
                    else {
                        feedback.deleted = true;
                        feedback.save();
                        res.send(feedback);
                    }
                }
            );


            // models.Feedback.findOneAndUpdate(
            //     {_id: feedback_id, visitor_email: user.email},
            //     {$set: {deleted: true}},
            //     {new: true},
            //     function (err, feedback) {
            //         if (err) res.error();
            //         else     res.send(feedback);
            //     }
            // );
        });
    });

router.route('/feedbacks/:app_instance/:component_id/:feedback_id')
    .get(function (req, res, next) {
        dal.feedbacks.view(req.params, function (err, results) {
            res.json(results);
        });
    });

router.route('/feedbacks/:app_instance/:component_id/:feedback_id/:id_token')

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
        var app_instance = req.params.app_instance,
            component_id = req.params.component_id;

        models.Widget.findOneOrCreate(
            { app_instance, component_id },
            { app_instance, component_id },
            function (err, widget) {
                res.json(widget);
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
        var app_instance = req.params.app_instance;
            res.success();
        // models.Catalog.find({ app_instance }, function(err, catalogs){
        //     res.json(catalogs);
        // });

        // dal.catalogs.list(req.params, function (err, catalogs) {
        //     dal.widgets.list([req.params.app_instance], function (err, widgets) {
        //         dal.widgets.score(req.params.app_instance, function (err, feedbacks) {
        //             widgets.forEach(function (current) {
        //                 current.feedbacks = feedbacks.filter(function (value) {
        //                     return value.component_id == current.component_id;
        //                 });
        //
        //                 current.score = popularity.getWidgetScore(5, current.created_on, current.feedbacks);
        //             });
        //
        //             catalogs.forEach(function (current) {
        //                 current.widgets = widgets.filter(function (value) {
        //                     return value.catalog_id == current.id;
        //                 });
        //             });
        //
        //             var defaultCatalog = {
        //                 name: "Default Catalog",
        //                 id: 0,
        //                 widgets: widgets.filter(function (value) {
        //                     return value.catalog_id == null;
        //                 })
        //             };
        //
        //             catalogs.unshift(defaultCatalog);
        //             res.json(catalogs);
        //         });
        //     });
        // });
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

router.route('/reply')
    .post(function (req, res, next) {
        dal.replies.add(req.body, function (err, results) {
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

router.route('/analysis/highlights/:app_instance/:component_id')
    .get(function (req, res, next) {
        var params = [req.params.app_instance, req.params.component_id];
        dal.feedbacks.list(params, function (err, results) {
            analysis.highlights(results, function (err, results) {
                res.json(results);
            });
        });
    });

router.route('/analysis/catalogsFeedbacks/:app_instance')
    .get(function (req, res, next) {
        analysis.catalogsFeedbacks(req.params.app_instance, function (err, results) {
            res.json(results);
        });
    });

router.route('/flagged')
    .post(function (req, res, next) {
        dal.flagged.add(req.body, function (err, result) {
            if (err) {
                res.json(err);
            } else {
                res.json(result);
            }
        });
    });

router.use('/flags', require('./api/flags'));

router.route('/vote')
    .post(function (req, res, next) {
        dal.votes.add(req.body, function (err, results) {
            if (err) {
                res.json(err);
            } else {
                res.json(results);
            }
        });
    });

router.route('/upvote/:target_id')
    .post(function (req, res) {
        var target_id = req.params.target_id;
        var token = req.body.visitor_token;

        verifyToken(token, function (err, user) {
            var email = user.email,
                name = user.given_name,
                picture_url = user.picture;

            models.Visitor.findOneOrCreate({email}, {email, name, picture_url}, function (err, visitor) {
                models.Feedback.findOne(
                    {_id: target_id},
                    (function (visitor_id, err, feedback) {
                        if (err) res.error();
                        else
                            if (feedback.up_voters.indexOf(visitor_id) !== -1)
                                feedback.up_voters.pull(visitor_id);
                            else
                                feedback.up_voters.addToSet(visitor_id);
                        feedback.save();
                        res.json(feedback);
                    }).bind(null, visitor._id)
                );
            })
        })
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