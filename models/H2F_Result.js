const sequelize = require('../db');
const { Model, DataTypes } = require('sequelize');
const User = require('./User');

class H2F_Result extends Model { }

H2F_Result.init({
    user_email:
    {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: User,
            key: "email"
        },
        primaryKey: true
    },
    h2f_results:
    {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: null
    },
    cpa_results:
    {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: null
    },
    fms_results:
    {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: null
    }
}, {
    sequelize,
    modelName: "H2F_Result"
});

module.exports = H2F_Result;
