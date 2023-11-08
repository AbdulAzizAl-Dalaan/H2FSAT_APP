const sequelize = require('../../db');
const { Model, DataTypes } = require('sequelize');
const Survey_Info = require('./Survey_Q');

class Survey_D extends Model {}

Survey_D.init({
    survey_id:
    {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    email: // the user who took the survey
    {
        type: DataTypes.STRING,
        allowNull: false, 
        primaryKey: true
    },
    version: 
    {
        type: DataTypes.INTEGER,
        allowNull: false,
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
        allowNull: true

    }

}, {
    sequelize,
    modelName: 'Survey_D'
});

module.exports = Survey_D