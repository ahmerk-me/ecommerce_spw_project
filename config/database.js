// database module
var mysql = require('mysql');
var config = {
    host: 'eu-cdbr-west-03.cleardb.net',
    user: 'b34c0eac082c96',
    password: '0228b973',
    database: 'heroku_d7ff10c819a6b45'
};

// init database
var pool = mysql.createPool(config);

//Fetch data
function RunQuery(sql, callback) {
    pool.getConnection(function (err, conn) {
        if (err) {
            ShowErrors(err);
        }
        conn.query(sql, function (err, rows, fields) {
            if (err) {
                ShowErrors(err);
            }
            conn.release();
            callback(rows);
        });
    });
}

//Throw errors
function ShowErrors(err) {
    throw err;
}

module.exports = {
    RunQuery: RunQuery
};