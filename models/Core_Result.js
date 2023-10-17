const sequelize = require('../db');
const { Model, DataTypes } = require('sequelize');
const User = require('./User');

class Core_Result extends Model { }

Core_Result.init({
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
    h2f_results: // should be stored as a JSON object with each section as the key and the percentage as the value
    {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: null
    },
    cpa_results: // Motivation, Ability, and Current scores
    {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: null
    },
    cpa_flag: // flag for the CPA survey (null for not taken, "BH" any section is lower than 25, "MFT" if 1 at any point, "PASSED" otherwise)
    {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null
    },
    fms_flag: // flag for the FMS survey (null for not taken, "PT" if 0 at any point, "MFT" if 1 at any point, "PASSED" otherwise)
    {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null
    }
}, {
    sequelize,
    modelName: "Core_Result"
});

module.exports = Core_Result;
