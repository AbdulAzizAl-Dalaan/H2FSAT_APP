const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database/H2Fdb.sqlite'
})

module.exports = sequelize;