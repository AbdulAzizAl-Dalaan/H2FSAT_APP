const sequelize = require('../../db');
const { Model, DataTypes } = require('sequelize');

class H2F_A extends Model {}

H2F_A.init({
    qid: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    aid:
    {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    answer: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    correct: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    }
}, { 
    sequelize, 
    modelName: 'H2F_A' 
});


module.exports = H2F_A