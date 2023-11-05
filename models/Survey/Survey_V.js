const sequelize = require('../../db');
const { Model, DataTypes } = require('sequelize');
const User = require('../User');

class Survey_V extends Model {}

Survey_V.init({
    survey_id: // the survey that was edited by an Admin
    {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    version: 
    {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    questions: // object where the key is the question_id and the value is the question text
    {
        type: DataTypes.JSON,
        allowNull: false,
    }
}, {
    sequelize,
    modelName: 'Survey_V'
});

module.exports = Survey_V
