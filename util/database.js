const Sequelize = require('sequelize');
const sequelize = new Sequelize(
    'expense-tracker', // Database schema name
    process.env.USER, // Username
    process.env.MYSQL_PASSWORD, // Password
    {
        dialect: 'mysql',
        host: process.env.HOST
    }
);

module.exports = sequelize;
