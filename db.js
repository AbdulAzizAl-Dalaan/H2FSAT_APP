const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('new_database', 'root', 'Password123#@!', {
    host: 'localhost',
    dialect: 'mysql',
    define: {
        timestamps: false
    }
})

module.exports = sequelize;