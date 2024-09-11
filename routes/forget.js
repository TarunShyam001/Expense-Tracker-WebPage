const path = require('path');

const express = require('express');

const adminController = require('../controllers/forget');

const router = express.Router();

router.post('/forgetpassword', adminController.forgetPassword);

module.exports = router;