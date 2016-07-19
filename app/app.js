'use strict';

var express = require('express'),
    path = require('path'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    http = require('http'),
    app = express(),
    routes = require('./routes/views'),
    api = require('./routes/api'),
    dal = require('./dal/dal');

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(logger('dev', {
    /* skip: function (req, res) {
        return req.baseUrl == '/node' && res.statusCode < 400;
     }*/
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

//////////////////////////////DEBUG AREA/////////////////////////////////////
/*var req = {params : {feedback_id : [16 ,17] }};
 dal.replies.list(req.params.feedback_id.join(","), function (err, results) {
 if (err) {
 res.json(err);
 } else {
 var repliesTree = listToTree(results);
 }
 });


 function listToTree(data) {
 var tree = [],
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
 if (!tree[item.feedback_id]){
 tree[item.feedback_id] = [];
 }

 tree[item.feedback_id].push(item);
 }
 }

 return tree;
 }

 /////////////*////////DEBUG AREA END////////////////////////

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



