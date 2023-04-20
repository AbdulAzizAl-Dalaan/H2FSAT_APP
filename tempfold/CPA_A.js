const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../db');
const CPA_Q = require('./CPA_Q');

class CPA_A extends Model {}

CPA_A.init({
  questionId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: CPA_Q,
      key: 'qid'
    }
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  score: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 0,
      max: 10
    }
  }
}, {
  sequelize,
  modelName: 'CPA_A',
  timestamps: false
});

module.exports = CPA_A;