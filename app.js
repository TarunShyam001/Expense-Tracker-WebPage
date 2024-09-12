const express = require('express');
const app = express();
const sequelize = require ('./util/database');

const cors = require("cors");
const Users = require ('./models/users');
const Expense = require('./models/expense');
const Order = require('./models/order');
const ForgetPassword = require('./models/forget');
const dotenv = require('dotenv');

// get config vars
dotenv.config();

const userRoutes = require('./routes/users');
const expenseRoutes = require('./routes/expense');
const purchaseRoutes = require('./routes/purchase');
const premiumRoutes = require('./routes/premium');
const forgetRoutes = require('./routes/forget');

app.use(express.json());
app.use(cors());

Users.hasMany(Expense);
Expense.belongsTo(Users);

Users.hasMany(Order);
Order.belongsTo(Users);

Users.hasMany(ForgetPassword);
ForgetPassword.belongsTo(Users);

app.use('/user', userRoutes);
app.use('/expense', expenseRoutes);
app.use('/purchase', purchaseRoutes);
app.use('/premium', premiumRoutes);
app.use('/password', forgetRoutes);

const port = 3450;

// {force : true}

sequelize
.sync()
.then((result) => {
    console.log(`server is working on http://localhost:${port}`);
   app.listen(port);
}).catch((err) => {
    console.log(err)
});



