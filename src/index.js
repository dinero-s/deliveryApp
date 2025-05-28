const express = require('express');
const app = express();
require('dotenv').config();
const controller = require('./controllers')
const mongoose = require('mongoose');

const PORT = process.env.PORT || 3000;

mongoose.connect('mongodb://127.0.0.1:27017/deliveryDB')
    .then(() => console.log('MongoDB connected!'));

app.use(express.json())
controller(app);

app.listen(PORT, () => console.log(`Listening on ${PORT}!`));