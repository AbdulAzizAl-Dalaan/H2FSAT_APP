// models/FMS/FMS_Q.js
const sequelize = require('../../db');
const { Model, DataTypes } = require('sequelize');
const FMS_A = require('./FMS_A')

class FMS_Q extends Model {
    async fmsScore() {
      const answers = await FMS_A.findAll({
        where: {
          thequestion: this.qid
        }
      });
  
      const score = answers.reduce((total, answer) => total + answer.score, 0);
      return score;
    }
  }

FMS_Q.init({
    qid:
    {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    question: 
    {
        type: DataTypes.STRING,
        allowNull: false,
    }
}, { 
    sequelize, 
    modelName: 'FMS_Q' 
});

FMS_Q.hasMany(FMS_A, { foreignKey: 'thequestion' });
FMS_A.belongsTo(FMS_Q, { foreignKey: 'thequestion' });

module.exports = FMS_Q;
