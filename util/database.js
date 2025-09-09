const Sequelize = require('sequelize');

const sequelize = new Sequelize(
    process.env.DB_NAME, // Database schema name
    process.env.DB_USER, // Username
    process.env.DB_PASSWORD, // Password
    {
        host: process.env.DB_HOST,
        dialect: 'mysql',
    }
);

module.exports = sequelize;