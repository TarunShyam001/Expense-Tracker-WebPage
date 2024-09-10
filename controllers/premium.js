const Users = require('../models/users');
const Expense = require('../models/expense');
const sequelize = require('../util/database');

const getUserLeaderBoard = async (req, res) => {
    try {
        const leaderBoardElem = await Users.findAll({
            attributes : ['username', 'totalExpense'],
            order : [['totalExpense', "DESC"]]
        });

        console.log(leaderBoardElem);
        return res.status(200).json(leaderBoardElem);

    }
    catch(err) {
        console.log(err);
        return res.status(500).json(err);
    }
}

module.exports = {
    getUserLeaderBoard,
}