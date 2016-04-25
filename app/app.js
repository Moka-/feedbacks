'use strict';

var express = require('express'),
    path = require('path'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    http = require('http');

var app = express();

var routes = require('./routes/widget');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.set('port', process.env.PORT || 9000);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/node', express.static(path.join(__dirname, '../node_modules')));
app.use('/bower', express.static(path.join(__dirname, 'bower_components')));

// serve index and view partials
app.get('/widget', routes.widget);
app.get('/settings', routes.settings);
app.get('/partials/:name', routes.partials);
app.use('/partials/templates', express.static(path.join(__dirname, 'views/partials/templates')));

// JSON API
//app.get('/api/name', api.name);

// redirect all others to the index (HTML5 history)
//app.get('*', widget_routes.widget);

// catch 404 and forward to error handler
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
