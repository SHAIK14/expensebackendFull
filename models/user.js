const { DataTypes } = require("sequelize"); // already added, but just simply adding
const sequelize = require("../config/config.js");

const User = sequelize.define("Users", {
  id: {
    type: DataTypes.INTEGER, // earlied i used to Sequelize  = require("sequelize") and used to add it to the type : Sequelize.Integer but this time tried new
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = User;
