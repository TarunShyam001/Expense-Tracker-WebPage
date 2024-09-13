const path = require('path');

const express = require('express');

const expenseController = require('../controllers/expense');

const userAuthenticate = require('../middleware/auth')

const router = express.Router();

router.get('/get-expenses', userAuthenticate.authorization , expenseController.getExpense);

router.post('/add-expense', userAuthenticate.authorization , expenseController.postAddExpense);

router.delete('/delete-expense/:expenseId', expenseController.postDeleteExpense);

router.get('/download', userAuthenticate.authorization, expenseController.downloadFile);

module.exports = router;