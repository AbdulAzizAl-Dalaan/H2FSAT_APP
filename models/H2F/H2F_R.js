const sequelize = require('../../db');
const { Model, DataTypes } = require('sequelize');

class H2F_R extends Model {}

H2F_R.init({
    email:
    {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    },
    unit:
    {
        type: DataTypes.STRING,
        allowNull: false,
    },
    results: 
    {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    score:
    {
        type: DataTypes.FLOAT,
        allowNull: false,
    }
}, { 
    sequelize, 
    modelName: 'H2F_R' 
});


module.exports = H2F_R