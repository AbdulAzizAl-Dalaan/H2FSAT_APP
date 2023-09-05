const sequelize = require('../../db');
const { Model, DataTypes } = require('sequelize');
const Survey_Q = require('./Survey_Q');

class Survey_A extends Model { }


Survey_A.init({
    question_id:
    {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Survey_Q,
            key: "question_id"
        },
        primaryKey: true
    },
    answer_id:
    {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    answer_text:
    {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    sequelize,
    modelName: 'Survey_A'
});

module.exports = Survey_A
