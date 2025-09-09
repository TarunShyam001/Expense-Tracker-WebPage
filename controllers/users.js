const { where } = require('sequelize');
const Users = require('../models/users');
const Expense = require('../models/expense');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

function isPasswordValid(str) {
  const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z0-9]{8,20}$/; // Alphanumeric with at least one lowercase, one uppercase, one digit
  return typeof str === 'string' && pattern.test(str);
}

const postAddUsers = async (req, res) => {
  const {username, email, password} = req.body; 
  console.log('Received Data'+ req.body);
  try {
    const existingUser = await Users.findOne({where : {email}});
    if(existingUser) {
        return res.status(409).json({ message: 'A user with the same email is already exists.' });
    } 
    if (!isPasswordValid(password)) {
      if(password.length < 8) {
        return res.status(404).json({ message: 'The password length is too short' });
      } else if(password.length > 20) {
        return res.status(404).json({ message: 'The password length is too long' });
      } else {
        return res.status(404).json({ message: 'A password must have atleast one lower case, one higher case, and one digit (No other characters)' });
      }
    } 
    const saltrounds = 10;
    const hash = await bcrypt.hash(password, saltrounds);
    const user = await Users.create({ username, email, password: hash, isPremiumUser: false}); 
    res.status(201).json(user);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

function generateAccessToken(id, name, isPremium) {
  const secretKey = process.env.TOKEN_SECRET;
  return jwt.sign({ userId : id, userName : name, isPremium: isPremium}, secretKey)
}

const postAddLogin = async (req, res) => {
  const { email, password } = req.body; 
  try {
    const user = await Users.findOne({ where: { email } });
    if (user) {
      // Compare the provided password with the hashed password in the database
      const match = await bcrypt.compare(password, user.password);
      if(match) {    // If passwords match
        console.log('Login Successfully');
        return res.status(200).json({ 
          success : true, 
          message: 'Login Successfully', 
          token : generateAccessToken(user.id, user.username, user.isPremiumUser)
        });
      } else {
        console.log('Incorrect Password');
        return res.status(401).json({ message: 'Incorrect Password' });
      }
    } else {
      console.log('User Not Found');
      return res.status(404).json({ message: 'User Not Found' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  postAddUsers,
  postAddLogin,
  generateAccessToken
}