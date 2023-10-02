const sequelize = require('../../db');
const { Model, DataTypes } = require('sequelize');
const Survey_Info = require('./Survey_Info');

class Survey_Q extends Model { }

Survey_Q.init({
    question_id:
    {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        //autoIncrement: true
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
    header: // the header of the question
    {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null
    },
    prompt: // the question text itself
    {
        type: DataTypes.STRING,
        allowNull: false
    },
    img:
    {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null
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
    },
    point_value:
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
