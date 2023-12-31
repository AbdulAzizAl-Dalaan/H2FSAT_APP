const sequelize = require('../db');
const { Model, DataTypes } = require('sequelize');

class Notification extends Model { }

Notification.init({
    core_category: 
    {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    },
    core_assessment_id: { //  1 for H2F, 2 for CPA, 3 for FMS
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    unit: { // Will be the abbreviation of the state the user is in (should include all states and DC)
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    },
    description: { // Will be the description of the notification for each of the notification id types
        type: DataTypes.STRING,
        allowNull: false
    },
    resource_email:
    {
        type: DataTypes.STRING,
        allowNull: true  
    },
    resource_phone:
    {
        type: DataTypes.STRING,
        allowNull: true  
    
    }
}, {
    sequelize,
    modelName: "Notification"
});

module.exports = Notification;