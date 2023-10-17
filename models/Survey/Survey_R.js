const sequelize = require('../../db');
const { Model, DataTypes, Sequelize } = require('sequelize');
const User = require('../User');
const Survey_Info = require('./Survey_Q');

class Survey_R extends Model {}

Survey_R.init({
    survey_id:
    {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Survey_Info,
            key: "survey_id"
        },
        primaryKey: true
    },
    email: // the user who took the survey
    {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: User,
            key: "email"
        },
        primaryKey: true
    },
    results: // should be stored as a JSON object with the question_id as the key and the answer_id as the value
    {
        type: DataTypes.JSON,
        allowNull: false,
    },
    timestamp:
    {
        type: DataTypes.DATE, 
        allowNull: false,
        defaultValue: DataTypes.NOW

    },
    isOutdated:
    {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
}, {
    sequelize,
    modelName: 'Survey_R'
});

module.exports = Survey_R