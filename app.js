const express = require('express');
const app = express();
const sequelize = require ('./util/database');

const cors = require("cors");
const Users = require ('./models/users');
const Expense = require('./models/expense');

const userRoutes = require('./routes/users');
const expenseRoutes = require('./routes/expense');

app.use(express.json());
app.use(cors());

Users.hasMany(Expense);
Expense.belongsTo(Users);

app.use('/user', userRoutes);
app.use('/expense', expenseRoutes);

const port = 3450;

sequelize
.sync()
.then((result) => {
    console.log(`server is working on http://localhost:${port}`);
   app.listen(port);
}).catch((err) => {
    console.log(err)
});



