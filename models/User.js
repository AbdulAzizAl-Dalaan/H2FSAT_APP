const sequelize = require('../db');
const { Model, DataTypes } = require('sequelize');

class User extends Model {
    static async findUser(username, password)
    {
        try 
        {
            const user = await User.findByPk(username)
            if(user && user.password === password)
            {
                return user
            }
            else
            {
                return null
            }
        } 
        catch (error) 
        {
            console.log(error)
            return null
        }
    }
}

User.init({
    firstname:
    {
        type: DataTypes.STRING,
        allowNull: false
    },
    lastname:
    {
        type: DataTypes.STRING,
        allowNull: false
    },
    unit:
    {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "None"
    },
    state:
    {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "None"
    },
    email:
    {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    },
    rank:
    {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "None"
    },
    password: 
    { 
        type: DataTypes.STRING, 
        allowNull: true
    },
    gender:
    {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "None"
    },
    dob:
    {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "None"
    },
    isUnitLeader:
    {
        type: DataTypes.BOOLEAN,
        allowNull: true
    },
    isAdmin:
    {
        type: DataTypes.STRING,
        allowNull: true
    }
    
}, { 
    sequelize, 
    modelName: 'User' 
});


module.exports = User