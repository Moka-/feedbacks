'use strict';

var express = require('express'),
    path = require('path'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    http = require('http');
var router = express.Router();

var app = express();

var routes = require('./routes/widget');
var api = require('./routes/api');
var dal = require('./dal/dal');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.set('port', process.env.PORT || 9000);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/node', express.static(path.join(__dirname, '../node_modules')));
app.use('/bower', express.static(path.join(__dirname, 'bower_components')));
app.post('/provision', function (res1, res2) {
    console.log(res1);
    console.log(res2);
});
// serve index and view partials
app.get('/widget', routes.widget);
app.get('/settings', routes.settings);
app.get('/dashboard', routes.dashboard);
app.get('/partials/:name', routes.partials);
app.use('/partials/templates', express.static(path.join(__dirname, 'views/partials/templates')));

app.get('/visitors', api.visitors.list);
app.post('/visitors', api.visitors.add);
app.get('/visitor/:id', api.visitors.view);
app.put('/visitor/:id', api.visitors.update);
app.delete('/visitor/:id', api.visitors.delete);

app.get('/feedbacks/:app_instance/:component_id', api.feedbacks.list);
app.post('/feedbacks', api.feedbacks.add);
app.get('/feedback/:id', api.feedbacks.view);
app.put('/feedback/:id', api.feedbacks.update);
app.delete('/feedback/:id', api.feedbacks.delete);

app.get('/widgets', api.widgets.list);
app.post('/widgets', api.widgets.add);
app.get('/widgets/:app_instance/:component_id', api.widgets.view);
app.get('/widget-settings/:app_instance/:component_id', api.widgets.settings);
app.put('/widgets', api.widgets.update);
app.delete('/widget/:id', api.widgets.delete);

app.get('/catalogs/:app_instance', api.catalogs.list);
app.post('/catalogs', api.catalogs.add);
//app.get('/catalogs/:id', api.catalogs.view);
app.put('/catalogs/:id', api.catalogs.update);
app.delete('/catalogs/:id', api.catalogs.delete);

/*var req={};
 api.widgets.update(req, function (a, b) {
    console.log(a);
    console.log(b);
});*/
/*var req = {};
req.params = {app_instance : "4a8eda33-6035-4c65-9cf6-6befeaf2d2af",
                component_id : "comp-inx9esxf"}
 api.widgets.view(req);*/


// redirect all others to the index (HTML5 history)
//app.get('*', widget_routes.widget);

app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers
// development error handler
// will print stacktrace

if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

var server = http.createServer(app).listen( app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});

module.exports = app;

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

function cleanup () {
    server.close( function () {
        console.log( "Closed out remaining connections.");
        // Close db connections, other chores, etc.
        process.exit();
    });

    setTimeout( function () {
        console.error("Could not close connections in time, forcing shut down");
        process.exit(1);
    }, 30*1000);

}



