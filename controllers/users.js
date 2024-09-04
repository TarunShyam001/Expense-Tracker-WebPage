const { where } = require('sequelize');
const Users = require('../models/users');
const bcrypt = require('bcrypt');

function isPasswordValid(str) {
  const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z0-9]{8,20}$/; // Alphanumeric with at least one lowercase, one uppercase, one digit
  return typeof str === 'string' && pattern.test(str);
}

exports.postAddUsers = async (req, res) => {
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
    const user = await Users.create({ username, email, password: hash }); 
    res.status(201).json(user);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.postAddLogin = async (req, res) => {
  const {email, password} = req.body; 
  try {
    const user = await Users.findAll({where : {email}});
    if(user.length > 0) {
      bcrypt.compare(password, user[0].password, (err, response) => {
        if(!err) {
          res.status(201).json({message: 'Login Successfully'});
        } else {
          res.status(401).json({ message: 'Incorrect Password' });
        }
      });
    } else {
      res.status(404).json({ message: 'User Not Found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};