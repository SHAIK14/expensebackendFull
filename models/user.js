const Sequelize = require("sequelize"); // already added, but just simply adding
const sequelize = require("../config/config.js");

const User = sequelize.define("Users", {
  id: {
    type: Sequelize.INTEGER, // earlied i used to Sequelize  = require("sequelize") and used to add it to the type : Sequelize.Integer but this time tried new
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  isPremium: {
    type: Sequelize.BOOLEAN,
  },
});

module.exports = User;
