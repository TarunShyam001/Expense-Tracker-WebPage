const Sequelize = require('sequelize');
const sequelize = new Sequelize(
    'node-complete', // Database name
    'root', // Username
    'Manju012@', // Password
    {
        dialect: 'mysql',
        host: 'localhost'
    }
);

module.exports = sequelize;
