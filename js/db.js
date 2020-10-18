const mysql = require('mysql');
const myQuery = 'SELECT * FROM users WHERE username = 1';
const { promisify } = require('util');

//Database details
const connection = mysql.createConnection({
    host:'localhost',
    user: 'root',
    password: '1234',
    database: 'weatherapp'
});

connection.query = promisify(connection.query);
//Database connection
connection.connect((err)=> {
    if(err) console.log(err);
    else console.log('DB Connected succesfully');
});

module.exports = connection;