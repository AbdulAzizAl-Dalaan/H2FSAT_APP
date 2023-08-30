// models/FMS/FMS_A.js
const sequelize = require("../../db");
const { Model, DataTypes } = require("sequelize");
const FMS_Q = require("./FMS_Q");

class FMS_A extends Model {}

FMS_A.init(
  {
    // thequestion: {
    //   type: DataTypes.INTEGER,
    //   allowNull: false,
    //   references: {
    //     model: FMS_Q,
    //     key: "qid",
    //   },
    // },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    score: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { 
        min: 0, 
        max: 3 
    },
    },
  },
  {
    sequelize,
    modelName: "FMS_A",
  }
);

module.exports = FMS_A;
