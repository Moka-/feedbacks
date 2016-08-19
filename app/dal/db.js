'use strict';

var mysql = require('mysql');
var pool = mysql.createPool({
    typeCast: true,
    connectionLimit: 100,
    acquireTimeout: 30000,
    host: 'wix-feedbacks-test.cohruqtd5dnp.us-west-2.rds.amazonaws.com', // TODO: move the connection data to a config
    port: '1337',
    user: 'feedback',
    password: 'Aa123456',
    database: 'wix_feedbacks_test'
});

module.exports = {
    query: function (sql, params, callback) {
        var querySql = mysql.format(sql, params);
        pool.query({
                sql: querySql,
                typeCast: function (field, next) {
                    if (field.type == 'TINY' && field.length == 1) {
                        return (field.string() == '1'); // 1 = true, 0 = false
                    }
                    return next();
                }
            },
            function (err, rows, fields) {
                console.log(querySql);

                if (err) {
                    console.error(err);
                }

                callback(err, rows);
            });
    }
}