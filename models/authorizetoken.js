"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class AuthorizeToken extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.User, {
        foreignKey: "userId",
      });
    }
  }
  AuthorizeToken.init(
    {
      accessToken: DataTypes.STRING,
      accessTokenExpiresAt: DataTypes.DATE,
      clientId: DataTypes.STRING,
      userId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "AuthorizeToken",
    }
  );
  return AuthorizeToken;
};
