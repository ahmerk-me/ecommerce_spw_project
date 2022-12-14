// database module
var mysql = require('mysql');
var config = {
    host: 'eu-cdbr-west-03.cleardb.net',
    user: 'bb1700adcaf1cd',
    password: '4f695da8',
    database: 'heroku_ac94777d7ec165e'
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