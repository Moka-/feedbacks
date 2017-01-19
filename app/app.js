'use strict';

var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require('http');
var app = express();
var routes = require('./routes/views');
var api = require('./routes/api');
var dal = require('./dal/dal');
//var temp =  require('./dal/mongodb');

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(logger('dev', {
    skip: function (req, res) {
        return req.baseUrl == '/node' && res.statusCode < 400;
    }
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/node', express.static(path.join(__dirname, '../node_modules')));
app.get('/partials/:name', routes.partials);
app.use('/partials/templates', express.static(path.join(__dirname, 'views/partials/templates')));

app.use('/api', api);
app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'public/index.html')); // load the single view file (angular will handle the page changes on the front-end)
});

// redirect all others to the index (HTML5 history)
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

var server = http.createServer(app).listen(app.get('port'), function() {
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



