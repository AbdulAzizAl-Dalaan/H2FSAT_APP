const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../db');
const User = require('../User');

class CPA_R extends Model {}

CPA_R.init({
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: User,
      key: 'email'
    }
  },
  unit: {
    type: DataTypes.STRING,
    allowNull: false
  },
  motivation_physical: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 0,
      max: 10
    }
  },
  motivation_mental: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 0,
      max: 10
    }
  },
  motivation_nutritional: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 0,
      max: 10
    }
  },
  motivation_spiritual: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 0,
      max: 10
    }
  },
  motivation_sleep: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 0,
      max: 10
    }
  },
  total_score: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
        min: 0,
        max: 50
    }
  },
  abilityPH: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 0,
      max: 10
    }
  },
  abilityMH: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 0,
      max: 10
    }
  },
  abilityNH: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 0,
      max: 10
    }
  },
  abilitySPH: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 0,
      max: 10
    }
  },
  abilitySLH: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 0,
      max: 10
    }
  },
  abilityTS: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
        min: 0,
        max: 50
    }
  },
  curPH: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 0,
      max: 10
    }
  },
  curMH: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 0,
      max: 10
    }
  },
  curNH: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 0,
      max: 10
    }
  },
  curSPH: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 0,
      max: 10
    }
  },
  curSLH: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 0,
      max: 10
    }
  },
  curTS: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
        min: 0,
        max: 50
    }
  },
}, {
  sequelize,
  modelName: 'CPA_R',
  timestamps: false
});

User.hasMany(CPA_R, { foreignKey: 'email' });
CPA_R.belongsTo(User, { foreignKey: 'email' });

module.exports = CPA_R;