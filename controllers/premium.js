const Users = require('../models/users');
const Expense = require('../models/expense');
const sequelize = require('../util/database');

const getUserLeaderBoard = async (req, res) => {
    try {
        const users = await Users.findAll();
        const expenses = await Expense.findAll();
        const userAggregateExpense = {}
        const userLeaderBoard = [];

        expenses.forEach((expense) => {
            if(userAggregateExpense[expense.userId]) {
                userAggregateExpense[expense.userId] = userAggregateExpense[expense.userId] + expense.amount;
            } else {
                userAggregateExpense[expense.userId] = expense.amount;
            }
        });

        users.forEach((user) => {
            userLeaderBoard.push({name : user.username, totalExpense: userAggregateExpense[user.id] || 0});
        });

        console.log(userLeaderBoard);
        userLeaderBoard.sort((a, b) => a.totalExpense - b.totalExpense);
        return res.status(200).json(userLeaderBoard);

    }
    catch(err) {
        console.log(err);
        return res.status(500).json(err);
    }
}

module.exports = {
    getUserLeaderBoard,
}