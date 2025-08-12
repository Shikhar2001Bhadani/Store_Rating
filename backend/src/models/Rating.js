const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./User");
const Store = require("./Store");

const Rating = sequelize.define("Rating", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  ratingValue: { type: DataTypes.INTEGER, allowNull: false },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  storeId: { type: DataTypes.INTEGER, allowNull: false },
  comment: { type: DataTypes.TEXT, allowNull: true }
}, {
  tableName: "ratings",
  timestamps: true
});

Rating.belongsTo(User, { foreignKey: "userId", as: "user" });
Rating.belongsTo(Store, { foreignKey: "storeId", as: "store" });
Store.hasMany(Rating, { foreignKey: "storeId", as: "ratings" });
User.hasMany(Rating, { foreignKey: "userId", as: "ratings" });

module.exports = Rating;
