'use strict';

var mysql = require('mysql');
var pool = mysql.createPool({
    connectionLimit: 100, //important
    host: 'wix-feedbacks-test.cohruqtd5dnp.us-west-2.rds.amazonaws.com', // TODO: move the connection data to a config
    port: '1337',
    user: 'feedback',
    password: 'Aa123456',
    database: 'wix_feedbacks_test',
    debug: false
});

module.exports = {
    query: function (sql, params, callback) {
        pool.getConnection(function (err, connection) {
            if (err) {
                console.log('Error opening a connection to the DB');
                callback(err);
                return;
            }

            connection.beginTransaction(function (err) {
                if (err) {
                    console.log('Error opening a transaction');
                    connection.release();
                    callback(err);
                    return;
                }

                connection.query(sql, params, function (err, results) {
                    if (err) {
                        console.log('Error executing the query');
                        console.log(mysql.format(sql, params));
                        connection.release();
                        callback(err);
                        return;
                    }
                    if (!results) {
                        console.log('Warning: Your query retrieved no rows');
                        console.log(mysql.format(sql, params));
                    }

                    connection.commit(function (err) {
                        if (err) {
                            connection.rollback(function () {
                                console.log('Error while committing the following sql:');
                                console.log(mysql.format(sql, params));
                                callback(err);
                            });
                            return;
                        }

                        callback(err, results); // Success!
                        connection.release();
                    });
                });
            });
        });
    }
}