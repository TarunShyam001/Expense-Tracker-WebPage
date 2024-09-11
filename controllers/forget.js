const Users = require('../models/users');
const sequelize = require('../util/database');

const forgetPassword = async (req, res) => {
    try {
        
    }
    catch(err) {
        console.log(err);
        return res.status(500).json(err);
    }
}

module.exports = {
    forgetPassword,
}