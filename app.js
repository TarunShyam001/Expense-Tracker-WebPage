const dotenv = require('dotenv');
dotenv.config({path : './Expense-Tracker-WebPage/.env'});

const express = require('express');
const helmet = require('helmet');
const app = express();

const sequelize = require ('./util/database');

const cors = require("cors");
const Users = require ('./models/users');
const Expense = require('./models/expense');
const Order = require('./models/order');
const ForgetPassword = require('./models/forget');

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

app.use(helmet());
app.use('/user', userRoutes);
app.use('/expense', expenseRoutes);
app.use('/purchase', purchaseRoutes);
app.use('/premium', premiumRoutes);
app.use('/password', forgetRoutes);

const port = process.env.PORT;

// {force : true}

sequelize
.sync()
.then((result) => {
    console.log(`server is working on http://localhost:${port}`);
   app.listen(port);
}).catch((err) => {
    console.log(err)
});



