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
        const expense = await Expense.create({title, category, amount, details, userId});
        return res.status(200).json(expense);
    } catch(err) {
        return res.status(403).json({success : false, error : err});
    }
  };

  exports.postDeleteExpense = async (req, res) => {
    try {
        const id = req.params.expenseId;
        const expense = await Expense.findByPk(id);
        if (!expense) {
            return res.status(404).json({ err: 'Expense not found' });
        }

        await expense.destroy();
        res.status(200).json({ message: 'Expense deleted successfully' }); // Send a response
    } catch (error) {
        console.error('Error deleting expense:', error);
        res.status(500).json({ error: 'Server error' });
    }
};
