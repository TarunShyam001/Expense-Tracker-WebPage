const path = require('path');

const express = require('express');

const purchaseController = require('../controllers/purchase');

const userAuthenticate = require('../middleware/auth')

const router = express.Router();

router.get('/premium-package', userAuthenticate.authorization , purchaseController.purchasePremium);

router.post('/updated-transaction-status', userAuthenticate.authorization , purchaseController.updatedTransactionStatus);


module.exports = router;