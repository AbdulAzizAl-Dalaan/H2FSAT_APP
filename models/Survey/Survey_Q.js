const sequelize = require('../../db');
const { Model, DataTypes } = require('sequelize');
const Survey_Info = require('./Survey_Info');

class Survey_Q extends Model { }

Survey_Q.init({
    survey_name:
    {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: Survey_Info,
            key: "survey_name"
        },
        primaryKey: true
    },
    question_id:
    {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    question_text:
    {
        type: DataTypes.STRING,
        allowNull: false
    },
    question_type: // select all, select one, text, range number
    {
        type: DataTypes.STRING,
        allowNull: false
    },
    question_top_range:
    {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    question_bottom_range:
    {
        type: DataTypes.INTEGER,
        allowNull: true
    },

}, {
    sequelize,
    modelName: 'Survey_Q'
});

module.exports = Survey_Q
