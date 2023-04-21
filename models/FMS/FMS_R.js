const sequelize = require('../../db');
const { Model, DataTypes } = require('sequelize');

class FMS_R extends Model {}

FMS_R.init({
    // id: {
    //     type: DataTypes.INTEGER,
    //     allowNull: false,
    //     primaryKey: true,
    //     //autoIncrement: true,
    //   },
    email:
    {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    },
    unit:
    {
        type: DataTypes.STRING,
        allowNull: false,
    },
    deep_squat:
    {
        type: DataTypes.INTEGER,
        allowNull: false,
        
        validate: {
            min: 0,
            max: 3
        }
    },
    hurdle_step:
    {
        type: DataTypes.INTEGER,
        allowNull: false,
        
        validate: {
            min: 0,
            max: 3
        }
    },
    inline_lunge:
    {
        type: DataTypes.INTEGER,
        allowNull: false,
        
        validate: {
            min: 0,
            max: 3
        }
    },
    shoulder_mobility:
    {
        type: DataTypes.INTEGER,
        allowNull: false,
        
        validate: {
            min: 0,
            max: 3
        }
    },
    active_straight_leg_raise:
    {
        type: DataTypes.INTEGER,
        allowNull: false,
        
        validate: {
            min: 0,
            max: 3
        }
    },
    trunk_stability_pushup:
    {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 0,
            max: 3
        }
    },
    rotary_stability:
    {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 0,
            max: 3
        }
    },
    score:
    {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
            min: 0,
            max: 21
        }
    },
    fms_grader:
    {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    },
}, { 
    sequelize, 
    modelName: 'FMS_R' 
});

module.exports = FMS_R;
