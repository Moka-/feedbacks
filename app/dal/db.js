'use strict';

var mysql = require('mysql');
var pool = mysql.createPool({
    typeCast: true,
    connectionLimit: 100,
    host: 'wix-feedbacks-test.cohruqtd5dnp.us-west-2.rds.amazonaws.com', // TODO: move the connection data to a config
    port: '1337',
    user: 'feedback',
    password: 'Aa123456',
    database: 'wix_feedbacks_test'
});

module.exports = {
    query: function (sql, params, callback) {
        pool.query({
                sql: mysql.format(sql, params),
                typeCast: function (field, next) {
                    if (field.type == 'TINY' && field.length == 1) {
                        return (field.string() == '1'); // 1 = true, 0 = false
                    }
                    return next();
                }
            },
            function (err, rows, fields) {
                if (err) throw err;
                callback(err, rows);
            });
        // pool.getConnection(function (err, connection) {
        //     if (err) {
        //         console.log('Error opening a connection to the DB');
        //         callback(err);
        //         connection.release();
        //         return;
        //     }
        //
        //     connection.beginTransaction(function (err) {
        //         if (err) {
        //             console.log('Error opening a transaction');
        //             connection.release();
        //             callback(err);
        //             return;
        //         }
        //
        //         connection.query(sql, params, function (err, results, fields) {
        //             if (err) {
        //                 console.log('Error executing the query');
        //                 console.log(mysql.format(sql, params));
        //                 connection.release();
        //                 callback(err);
        //                 return;
        //             }
        //             if (!results) {
        //                 console.log('Warning: Your query retrieved no rows');
        //                 console.log(mysql.format(sql, params));
        //             }
        //             console.log(fields);
        //             connection.commit(function (err) {
        //                 if (err) {
        //                     connection.rollback(function () {
        //                         console.log('Error while committing the following sql:');
        //                         console.log(mysql.format(sql, params));
        //                         callback(err);
        //                         connection.release();
        //                     });
        //
        //                     return;
        //                 }
        //
        //                 console.log(results[0]);
        //                 callback(err, results); // Success!
        //                 connection.release();
        //             });
        //         });
        //     });
        // });
    }
}