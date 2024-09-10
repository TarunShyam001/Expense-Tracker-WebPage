const { where } = require('sequelize');
const Users = require('../models/users');
const Expense = require('../models/expense');
const bcrypt = require('bcrypt');
const sequelize = require('../util/database');

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
    const t = await sequelize.transaction();
    try{
        const userId = req.user.id;
        const {title, category, amount, details} = req.body;
        const expense = await Expense.create({title, category, amount, details, userId}, { transaction : t});
        
        const totalExpense = Number(req.user.totalExpense) + Number(expense.amount);

        await Users.update({
            totalExpense : totalExpense,
        },{
            where : { id : req.user.id },
            transaction : t
        });

        await t.commit();
        return res.status(200).json(expense);

    } catch(err) {
        await t.rollback();
        console.log(err);
        return res.status(500).json({success : false, error : err});
    }
  };

  exports.postDeleteExpense = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const id = req.params.expenseId;
        const expense = await Expense.findByPk(id)
        if (!expense) {
            return res.status(404).json({ err: 'Expense not found' });
        }
        
        const user = await Users.findByPk(expense.userId);
        const totalExpense = Number(user.totalExpense) - Number(expense.amount);
        await Users.update({
            totalExpense : totalExpense,
        },{
            where : { id : user.id},
            transaction : t
        })

        await expense.destroy({transaction : t});

        await t.commit();
        res.status(200).json({ message: 'Expense deleted successfully' }); // Send a response

    } catch (error) {

        await t.rollback();
        console.error('Error deleting expense:', error);
        res.status(500).json({ error: 'Server error' });
    }
};