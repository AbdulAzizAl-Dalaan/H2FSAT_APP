const sequelize = require('../../db');
const { Model, DataTypes } = require('sequelize');

class H2F_R extends Model {}

H2F_R.init({
    email:
    {
        type: DataTypes.STRING,
        allowNull: false,
    },
    reasult_dict: 
    {
        type: DataTypes.TEXT,
        allowNull: false,
    }
}, { 
    sequelize, 
    modelName: 'H2F_R' 
});


module.exports = H2F_R