const sequelize = require('../db');
const { Model, DataTypes } = require('sequelize');
const User = require('./User');

class Unit extends Model { }

Unit.init({
    id: // Unit Identification Code String
    {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    },
    state: // State the unit is in
    {
        type: DataTypes.STRING,
        allowNull: false
    },
    leader: // Email of the unit leader
    {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: User,
            key: "email"
        }
    }
}, {
    sequelize,
    modelName: "Unit"
});

module.exports = Unit;
