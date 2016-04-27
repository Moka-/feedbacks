/**
 * Created by Kostya on 27/4/2016.
 */
/*var mysql = require('mysql');
var pool = mysql.createPool({
    connectionLimit: 100, //important
    host: 'wix-feedbacks-test.cohruqtd5dnp.us-west-2.rds.amazonaws.com',
    port: '1337',
    user: 'feedback',
    password: 'Aa123456',
    database: 'wix_feedbacks_test',
    debug: true
});

exports.dal = {
    query: function (req, res) {

    },
    insert: function (req, res) {
        handle_database(req, res);
    },
    update: function (req, res) {

    },
    delete: function (req, res) {

    }

}

function handle_database(req, res) {
    pool.getConnection(function (err, connection) {
        if (err) {
            connection.release();
            console.log(err);
            res.json(err);
            return;
        }

        console.log('connected as id ' + connection.threadId);

        connection.query(req.query, function (err, rows) {
            connection.release();
            if (!err) {
                res.json(rows);
            }
        });

        connection.on('error', function (err) {
            console.log(err);
            res.json(err);
            return;
        });
    });
}*/
