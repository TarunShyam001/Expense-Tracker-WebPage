const path = require('path');

const express = require('express');

const adminController = require('../controllers/users');

const router = express.Router();

router.post('/user/signup', adminController.postAddUsers);

router.post('/user/login', adminController.postAddLogin);

module.exports = router;