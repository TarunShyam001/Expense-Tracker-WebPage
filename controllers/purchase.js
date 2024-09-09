const RazorPay = require('razorpay');
const Order = require('../models/order')

exports.purchasePremium = async (req, res) => {
    try {
        var rzp = new RazorPay({
            key_id : process.env.RAZORPAY_KEY_ID,
            key_secret : process.env.RAZORPAY_KEY_SECRET
        });
        const amount = 250;
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

exports.updatedTransactionStatus = async (req, res) => {
    try {
        const { payment_id, order_id } = req.body;
        Order.findOne({where: {orderId : order_id}})
        .then(order => {
            order.update({ paymentId : payment_id, status : 'SUCCESSFUL'})
            .then(() => {
                req.user.update({ isPremiumUser : true}).then(() => {
                    return res.status(202).json({success : true, message: "Transaction Successful"});
                }).catch(err => {
                    throw new Error(err);
                })
            }).catch(err => {
                throw new Error(err);
            })
        }).catch(err => {
            throw new Error(err);
        })
    } catch(err) {
        
    }
}