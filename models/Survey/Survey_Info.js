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
    description:
    {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'Survey_Info'
});

module.exports = Survey_Info
