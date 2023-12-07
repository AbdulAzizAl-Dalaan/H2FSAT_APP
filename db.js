const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('h2f_database', 'root', 'Password123#@!', {
    host: 'localhost',
    dialect: 'mysql',
    define: {
        timestamps: false
    }
})

module.exports = sequelize;