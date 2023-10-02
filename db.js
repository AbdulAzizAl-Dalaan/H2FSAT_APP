const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('mysql', 'root', 'Password123#@!', {
    host: 'localhost',
    dialect: 'mysql',
    define: {
        timestamps: false
    }
})

module.exports = sequelize;