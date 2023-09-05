const sequelize = require('../../db');
const { Model, DataTypes } = require('sequelize');

class Survey_Info extends Model { }

Survey_Info.init({
    survey_name:
    {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    }, 
    survey_description:
    {
        type: DataTypes.STRING,
        allowNull: false
    },
    survey_author:
    {
        type: DataTypes.STRING,
        allowNull: false
    },
    num_questions:
    {
        type: DataTypes.INTEGER,
        allowNull: false

    }
}, {
    sequelize,
    modelName: 'Survey_Info'
});

module.exports = Survey_Info
