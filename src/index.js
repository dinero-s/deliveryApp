const express = require('express');
const app = express();
require('dotenv').config();
const controller = require('./controllers')
const mongoose = require('mongoose');
const passport = require('passport');
const http = require('http');
const socketIO = require('../src/controllers/socket');

const server = http.createServer(app);

const PORT = process.env.PORT || 3000;

mongoose.connect('mongodb://root:example@localhost:27017/deliveryDB?authSource=admin')
    .then(() => console.log('MongoDB connected!'));

socketIO(server)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(passport.initialize());

controller(app);

app.listen(PORT, () => console.log(`Listening on ${PORT}!`));