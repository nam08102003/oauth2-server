"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Authorizes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Authorizes.init(
    {
      clientId: DataTypes.STRING,
      userId: {
        type: DataTypes.STRING,
        references: "User",
      },
      code: DataTypes.STRING,
      expiresAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Authorizes",
    }
  );
  return Authorizes;
};
