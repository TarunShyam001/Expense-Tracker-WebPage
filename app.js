const express = require('express');
const app = express();
const sequelize = require ('./util/database');

const cors = require("cors");
const Users = require ('./models/users');
const Expense = require('./models/expense');
const Order = require('./models/order');

const userRoutes = require('./routes/users');
const expenseRoutes = require('./routes/expense');
const purchaseRoutes = require('./routes/purchase');
const premiumRoutes = require('./routes/premium');

app.use(express.json());
app.use(cors());

Users.hasMany(Expense);
Expense.belongsTo(Users);

Users.hasMany(Order);
Order.belongsTo(Users);

app.use('/user', userRoutes);
app.use('/expense', expenseRoutes);
app.use('/purchase', purchaseRoutes);
app.use('/premium', premiumRoutes);

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



