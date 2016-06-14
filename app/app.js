'use strict';

var express = require('express'),
    path = require('path'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    http = require('http');
var app = express();

var routes = require('./routes/views');
var api = require('./routes/api');
var dal = require('./dal/dal');

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

app.post('/provision', function (res1, res2) {
    console.log(res1);
    console.log(res2);
});

app.get('/partials/:name', routes.partials);
app.use('/partials/templates', express.static(path.join(__dirname, 'views/partials/templates')));

app.use('/api', api);
app.get('*', function(req, res) {
    res.sendfile('app/public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
});

// var req={params : {app_instance: 'bcac1c8a-3b11-4374-aff7-e865a14c2681'}};
//  api.catalogs.list(req, function (a, b) {
//     console.log(a);
//     console.log(b);
// });
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
// app.use(function(err, req, res, next) {
//     res.status(err.status || 500);
//     res.render('error', {
//         message: err.message,
//         error: {}
//     });
// });

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



