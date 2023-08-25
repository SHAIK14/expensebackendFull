const Sequelize = require('sequelize');

const sequelize = new Sequelize('expensefull', 'root', 'root', {
  host: 'localhost',
  dialect: 'mysql',
});

module.exports = sequelize;
