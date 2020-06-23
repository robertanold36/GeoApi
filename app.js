const express = require('express');
const app = express();
require('dotenv').config();
const nodemailer = require('nodemailer');

const port = process.env.PORT || 8080;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/api/nearby', require('./Routes/data/data'));
app.use('/user/register', require('./Routes/user/user'));
app.use('/workshop/register',require('./Routes/workshop/workshopSchema'));
app.use('/workshop/requestWorkshop',require('./Routes/workshop/requestWorkshop'));

app.listen(port);