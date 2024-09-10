const { where } = require('sequelize');
const Users = require('../models/users');
const Expense = require('../models/expense');
const bcrypt = require('bcrypt');

exports.getExpense = async (req, res) => {
    try {
        const expenses = await Expense.findAll({where : {userId : req.user.id}});
        return res.status(200).json(expenses);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Server error' });
    }
};

exports.postAddExpense = async (req, res) => {
    try{
        const userId = req.user.id;
        const {title, category, amount, details} = req.body;
        await Expense.create({title, category, amount, details, userId})
        .then(expense => {
            const totalExpense = Number(req.user.totalExpense) + Number(expense.amount);
            Users.update({
                totalExpense : totalExpense,
            },{
                where : { id : req.user.id },
            }).then(async () => {
                return res.status(200).json(expense);
            }).catch(err => {
                console.log(err);
                return res.status(404).json({success : false, error : err});
            });
        })
        .catch(err => {
            console.log(err);
            return res.status(404).json({success : false, error : err});
        });
    } catch(err) {
        return res.status(403).json({success : false, error : err});
    }
  };

  exports.postDeleteExpense = async (req, res) => {
    try {
        const id = req.params.expenseId;
        await Expense.findByPk(id)
        .then(async (expense) => {
            if (!expense) {
                return res.status(404).json({ err: 'Expense not found' });
            }
            const user = await Users.findByPk(expense.userId);
            const totalExpense = Number(user.totalExpense) - Number(expense.amount);
            Users.update({
                totalExpense : totalExpense,
            },{
                where : { id : user.id},
            }).then(async () => {
                await expense.destroy();
                res.status(200).json({ message: 'Expense deleted successfully' }); // Send a response
            }).catch(err => {
                console.log(err);
                return res.status(404).json({success : false, error : err});
            });
        })
        .catch(err => {
            console.log(err);
            return res.status(404).json({success : false, error : err});
        });
    } catch (error) {
        console.error('Error deleting expense:', error);
        res.status(500).json({ error: 'Server error' });
    }
};