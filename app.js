const dotenv = require('dotenv');
// dotenv.config(); // when running the app via "npm start" 
dotenv.config({path : './Expense-Tracker-WebPage/.env'}); // when running with simple "run command"

const path = require('path');
const fs = require('fs');
const express = require('express');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
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

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags : 'a'});

app.use(helmet());
app.use(compression());
app.use(morgan('combined', {stream : accessLogStream}));

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



