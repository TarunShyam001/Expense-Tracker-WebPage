const { where } = require('sequelize');
const Users = require('../models/users');
const Expense = require('../models/expense');
const bcrypt = require('bcrypt');
const sequelize = require('../util/database');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

const getExpense = async (req, res) => {
    const page = +req.query.page || 1;
    const ItemPerPage = +req.query.limit || 2;
    try {
        const totalItems = await Expense.count({where : {userId : req.user.id}});

        const expenses = await Expense.findAll({
            where : {userId : req.user.id},
            offset : (page - 1) * ItemPerPage,
            limit : ItemPerPage
        });

        const pageData = {
            totalItems : totalItems,
            currentPage : page,
            hasPrevPage : page > 1,
            prevPage : page - 1,
            hasNextPage : (ItemPerPage * page) < totalItems,
            nextPage : page + 1,
            lastPage : Math.ceil(totalItems/ItemPerPage)
        }
        return res.status(200).json({expenses, pageData});

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

async function uploadToS3(data, filename) {
    try{
        const BUCKET_NAME = 'expensetracking123';
        const IAM_USER_ACCESS_KEY = 'AKIAU6VTTSFC6TROJK4Z';
        const IAM_USER_SECRET_KEY = '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';
    
        const s3Region = 'us-east-1'
        const s3 = new S3Client({
            region: s3Region,
            credentials: {
                accessKeyId: IAM_USER_ACCESS_KEY,
                secretAccessKey: IAM_USER_SECRET_KEY,
            }
        });
    
        const params = {
            Bucket: BUCKET_NAME,
            Key: filename,
            Body: data,
            ACL: 'public-read'
        };
    
        const command = new PutObjectCommand(params);
    
        return s3.send(command)
            .then(() => {
                // Construct the file URL using bucket name and filename
                const fileUrl = `https://${BUCKET_NAME}.s3.amazonaws.com/${filename}`;
                console.log('file url : ', fileUrl);
                return fileUrl;
            })
            .catch(err => {
                console.log('Error uploading file:', err);
                throw err;
            });

    } catch  (err) {
        console.log('Error uploading file:', err);
        throw err;
    }
}


    // return new Promise((resolve, reject) => {
    //     s3bucket.send(command, (err,s3response) => {
    //         if(err) {
    //             console.log('Something went wrong', err);
    //             reject(err);
    //         } else {
    //             console.log('success : ', s3response);
    //             resolve(s3response.Location);
    //         }
    //     })

    // })

// }

const downloadFile = async (req, res) => {
    try {
        const expenses = await Expense.findAll({where : {userId : req.user.id}});
        // console.log(expenses);
        const currentTime = JSON.stringify(new Date());
        const stringifiedExpenses = JSON.stringify(expenses);
        const fileName = `Expenses-${req.user.id}-data/${currentTime}.txt`;
        const fileUrl = await uploadToS3(stringifiedExpenses, fileName);
        return res.status(201).json({ fileUrl, success : true});
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