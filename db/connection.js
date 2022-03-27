const mysql = require('mysql2');

//require('dotenv').config();

//console.log(process.env);

// Connect to database 
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'employee_tracker_db'
    },
    console.log('Connected to the employee tracker database.')
);

module.exports = db;