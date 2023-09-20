const sequelize = require('../../db');
const { Model, DataTypes } = require('sequelize');
// DEFINE BOTH USER AND SURVEY_INFO MODELS

class Survey_R extends Model {}

Survey_R.init({
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
    results: // should be stored as a JSON object with the question_id as the key and the answer_id as the value
    {
        type: DataTypes.JSON,
        allowNull: false,
    },
    score:
    {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null
    }
}, {
    sequelize,
    modelName: 'Survey_R'
});

module.exports = Survey_R