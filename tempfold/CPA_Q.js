const sequelize = require('../../db');
const { Model, DataTypes } = require('sequelize');
const CPA_A = require('./CPA_A');

class CPA_Q extends Model {
  async totalMotivationScore() {
    const answers = await CPA_A.findAll({
      where: {
        questionId: this.qid
      }
    });

    const score = answers.reduce((total, answer) => total + answer.score, 0);
    return score;
  }
}

CPA_Q.init({
  qid: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  question: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'CPA_Q',
  timestamps: false
});

CPA_Q.hasMany(CPA_A, { foreignKey: 'questionId' });
CPA_A.belongsTo(CPA_Q, { foreignKey: 'questionId' });

module.exports = CPA_Q;