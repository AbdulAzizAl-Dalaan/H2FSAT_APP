const sequelize = require('../../db');
const { Model, DataTypes } = require('sequelize');
const Survey_Info = require('./Survey_Info');

class Survey_Q extends Model { }

Survey_Q.init({
    question_id:
    {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    },
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
    prompt: // the question itself
    {
        type: DataTypes.STRING,
        allowNull: false
    },
    type: // all (for select all), one (for multiple choice),  range (for number entry), and text (for text entry)
    {
        type: DataTypes.STRING,
        allowNull: false
    },
    top_range: // only used for range type questions
    {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null
    },
    bottom_range: // only used for range type questions
    {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null
    }
}, {
    sequelize,
    modelName: 'Survey_Q'
});


module.exports = Survey_Q
