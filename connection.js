// Dependency
const mysql = require('mysql2');

// Create connection to db
const dbConnector = mysql.createConnection(
    {
        host: 'localhost',
        port: 3306,
        user: 'newuser',
        password: 'password',
        database: 'tracker'
    }
);

module.exports = dbConnector;