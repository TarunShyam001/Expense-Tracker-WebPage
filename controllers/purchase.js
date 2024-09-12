const RazorPay = require('razorpay');
const Order = require('../models/order');
const Users = require('../models/users');
const userController = require('../controllers/users');

const purchasePremium = async (req, res) => {
    try {
        var rzp = new RazorPay({
            // key_id : process.env.RAZORPAY_KEY_ID,
            key_id : 'rzp_test_ymshxTVZbrKr6k',
            // key_secret : process.env.RAZORPAY_KEY_SECRET
            key_secret : 'LnUsgIaS6LReW9gap0K4yG5n'
        });
        const amount = 2500;
        rzp.orders.create({amount, currency: "INR"}, (err, order) => {
            if(err) {
                throw new Error(JSON.stringify(err));
            }
            req.user.createOrder({ orderId : order.id, status : "PENDING"})
            .then(() => {
                return res.status(201).json({ order, key_id : rzp.key_id});
            }).catch(err => {
                throw new Error(err);
            });
        })
    }
    catch (err) {

    }
};

const updatedTransactionStatus = async (req, res) => {
    try {
        const userId = req.user.id;
        const userName = req.user.username;
        const { payment_id, order_id } = req.body;
        const order = await Order.findOne({where: {orderId : order_id}})
        const promise1 = order.update({ paymentId : payment_id, status : 'SUCCESSFUL'})
        const promise2 = req.user.update({ isPremiumUser : true})

        Promise.all([promise1, promise2]).then(() => {
            return res.status(202).json({
                success: true, 
                message: "Transaction Successful", 
                token: userController.generateAccessToken(userId, userName, true) });
        })
        .catch (err => {
            throw new Error(err);
        }) 
    } catch(err) {
        return res.status(403).json({success : false, message: "Server Failed"});   
    }
}

module.exports = {
    purchasePremium,
    updatedTransactionStatus,
    Order
}