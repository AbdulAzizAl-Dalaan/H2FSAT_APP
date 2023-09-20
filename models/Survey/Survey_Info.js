const sequelize = require('../../db');
const { Model, DataTypes } = require('sequelize');
const User = require('../User');

class Survey_Info extends Model { }

Survey_Info.init({
    survey_id:
    {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
    },
    author: // creator of the survey
    {
        type: DataTypes.STRING,
        allowNull: false, 
        references: {
            model: User,
            key: "email"
        },
        primaryKey: true
    },
    title:
    {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    card_img: // image for the survey
    {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null
    },
    description:
    {
        type: DataTypes.TEXT,
        allowNull: false
    },
    secure: // checks if the user needs a password to access the survey
    {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    password: // only used if authorization is true
    {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null
    },
    show_question_numbers: // checks if the user wants to show question numbers
    {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    grade_by_points: // checks if the user wants to grade by points
    {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
}, {
    sequelize,
    modelName: 'Survey_Info'
});

module.exports = Survey_Info
