const path = require('path');

const express = require('express');

const expenseController = require('../controllers/premium');

const userAuthenticate = require('../middleware/auth')

const router = express.Router();

router.get('/showLeaderBoard', authenticatemiddleware.authenticate, premiumFeatureControllers.getUserLeaderBoard);

module.exports = router;