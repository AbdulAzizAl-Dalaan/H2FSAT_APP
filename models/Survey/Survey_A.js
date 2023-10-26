const sequelize = require('../../db');
const { Model, DataTypes } = require('sequelize');
const Survey_Q = require('./Survey_Q');

class Survey_A extends Model { }


Survey_A.init({
    survey_id:
    {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Survey_Q,
            key: "survey_id"
        },
        primaryKey: true
    },
    question_id:
    {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    answer_id:
    {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    text: // doubles as either the choice text for ('all' and 'one' type questions) or the text answer for ('text' and 'range' type questions)
    {
        type: DataTypes.STRING,
        allowNull: true
    }, 
    is_correct: // only used in point value questions to check if the answer is correct or not (add the question point value to the total if correct)
    {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: null
    }
}, {
    sequelize,
    modelName: 'Survey_A'
});

module.exports = Survey_A
