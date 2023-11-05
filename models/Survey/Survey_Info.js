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
        autoIncrement: true
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
    version:
    {
        type: DataTypes.INTEGER,
        allowNull: false,
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
        allowNull: true
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
    isCSVdata://**New to Model**
    {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    isCore: // checks if the survey is a core survey or not (1 for H2F, 2 for FMS, 3 for CPA)
    {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false // 0 for not a core survey
    },
}, {
    sequelize,
    modelName: 'Survey_Info'
});

module.exports = Survey_Info
