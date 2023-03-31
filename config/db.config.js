var mysql = require('mysql');

var connection = mysql.createConnection({
    host : '127.0.0.1',
    database : 'distributed',
    user : 'root',
    password : '19990920'
});

connection.connect()