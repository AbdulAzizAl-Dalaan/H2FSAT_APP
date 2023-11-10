const { Sequelize } = require('sequelize');
const fs = require('fs');

// Azure MySQL connection details
const host = 'h2f-wsu-capstone.mysql.database.azure.com';
const username = 'brian'; // Your Azure MySQL username
const password = 'WSUcapstone#2023'; // Your Azure MySQL password
const database = 'h2f_database'; // Your Azure MySQL database name
const port = 3306; // Default MySQL port

// SSL configuration
const caCert = fs.readFileSync('DigiCertGlobalRootCA.crt.pem'); // Replace with your CA cert filename

const sequelize = new Sequelize(database, username, password, {
    host: host,
    port: port,
    dialect: 'mysql',
    dialectOptions: {
        ssl: {
            ca: caCert
        }
    },
    define: {
        timestamps: false
    }
});

module.exports = sequelize;
