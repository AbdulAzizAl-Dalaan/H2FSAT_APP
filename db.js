require('dotenv').config();
const { Sequelize } = require('sequelize');
const fs = require('fs');

// Azure MySQL connection details
const host = process.env.DB_HOST;
const username = process.env.DB_USER;
const password = process.env.DB_PASS;
const database = process.env.DB_NAME;
const port = process.env.DB_PORT || 3306; // Default MySQL port

// SSL configuration
const caCert = fs.readFileSync(process.env.CA_CERT_PATH);

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