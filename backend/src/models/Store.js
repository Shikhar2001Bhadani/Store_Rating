const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./User");

const Store = sequelize.define("Store", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(255), allowNull: false },
  email: { type: DataTypes.STRING, allowNull: true },
  address: { type: DataTypes.TEXT, allowNull: true },
  ownerId: { type: DataTypes.INTEGER, allowNull: true },
  averageRating: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 }
}, {
  tableName: "stores",
  timestamps: true
});

Store.belongsTo(User, { foreignKey: "ownerId", as: "owner" });

module.exports = Store;
