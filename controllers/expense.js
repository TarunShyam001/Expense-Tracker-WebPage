const { where } = require('sequelize');
const Users = require('../models/users');
const Expense = require('../models/expense');
const bcrypt = require('bcrypt');
const sequelize = require('../util/database');
const AWS = require('aws-sdk');



const getExpense = async (req, res) => {
    try {
        const expenses = await Expense.findAll({where : {userId : req.user.id}});
        return res.status(200).json(expenses);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Server error' });
    }
};

const postAddExpense = async (req, res) => {
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

 const postDeleteExpense = async (req, res) => {
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

function uploadToS3(data, filename) {
    const BUCKET_NAME = 'expensetracking123';
    const IAM_USER_ACCESS_KEY = 'AKIAU6VTTSFC6TROJK4Z';
    const IAM_USER_SECRET_KEY = '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';

    let s3bucket = new AWS.S3({
        accessKeyId : IAM_USER_ACCESS_KEY,
        secretAccessKey : IAM_USER_SECRET_KEY,
        region : 'us-east-1'
    })

    return new Promise((resolve, reject) => {
        var params = {
            Bucket : BUCKET_NAME,
            Key : filename,
            Body : data,
            ACL : 'public-read'
        };
        s3bucket.upload(params, (err,s3response) => {
            if(err) {
                console.log('Something went wrong', err);
                reject(err);
            } else {
                console.log('success : ', s3response);
                resolve(s3response.Location);
            }
        })
    });


}

const downloadFile = async (req, res) => {
    try {
        const expenses = await Expense.findAll({where : {userId : req.user.id}});
        // console.log(expenses);
    
        const stringifiedExpenses = JSON.stringify(expenses);
        const fileName = 'Expenses.txt';
        const fileURL = uploadToS3(stringifiedExpenses, fileName);
        return res.status(200).json({file : fileURL, success : true});
    } catch(err) {
        return res.status(500).json({error : err, success : false});
    }
}

module.exports = {
    getExpense,
    postAddExpense,
    downloadFile,
    postDeleteExpense
}