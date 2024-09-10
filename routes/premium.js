const path = require('path');

const express = require('express');

const premiumFeatureControllers = require('../controllers/premium');

const userAuthenticate = require('../middleware/auth')

const router = express.Router();

router.get('/showLeaderBoard', userAuthenticate.authorization, premiumFeatureControllers.getUserLeaderBoard);

module.exports = router;