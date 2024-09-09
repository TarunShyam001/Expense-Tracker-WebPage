const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Users = sequelize.define('user', {
  id : {
    type : Sequelize.INTEGER,
    autoIncrement : true,
    allowNull : false,
    primaryKey : true
  },
  username: {
    type: Sequelize.STRING,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  },
  isPremiumUser : {
    type : Sequelize.BOOLEAN,
    allowNull : false
  }
});

module.exports = Users;
