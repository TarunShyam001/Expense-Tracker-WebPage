const express = require('express');
const app = express();
const sequelize = require ('./util/database');

const cors = require("cors");
const Users = require ('./models/users');

const userRoutes = require('./routes/users');

app.use(express.json());
app.use(cors());

app.use(userRoutes);

const port = 3450;

Users.sync();
sequelize
.sync()
.then((result) => {
    console.log(`server is working on http://localhost:${port}`);
   app.listen(port);
}).catch((err) => {
    console.log(err)
});



