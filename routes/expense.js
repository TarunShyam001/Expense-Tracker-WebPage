const path = require('path');

const express = require('express');

const expenseController = require('../controllers/expense');

const router = express.Router();

router.get('/get-expenses', expenseController.getExpense);

router.post('/add-expense', expenseController.postAddExpense);

router.delete('/delete-expense/:expenseId', expenseController.postDeleteExpense);


module.exports = router;