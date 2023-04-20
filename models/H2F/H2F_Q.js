const sequelize = require('../../db');
const { Model, DataTypes } = require('sequelize');

class H2F_Q extends Model {}

H2F_Q.init({
    qid:
    {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    question: 
    {
        type: DataTypes.STRING,
        allowNull: false,
    },
    category:
    {
        type: DataTypes.STRING,
        allowNull: false,
    }
}, { 
    sequelize, 
    modelName: 'H2F_Q' 
});


module.exports = H2F_Q