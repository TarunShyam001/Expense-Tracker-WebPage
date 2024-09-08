const Sequelize = require('sequelize');
const sequelize = new Sequelize(
    'expense-tracker', // Database schema name
    'root', // Username
    'Manju012@', // Password
    {
        dialect: 'mysql',
        host: 'localhost'
    }
);

module.exports = sequelize;
