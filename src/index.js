const express = require('express');
const app = express();
require('dotenv').config();
const controller = require('./controllers')
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');

const PORT = process.env.PORT || 3000;

mongoose.connect('mongodb://root:example@localhost:27017/deliveryDB?authSource=admin')
    .then(() => console.log('MongoDB connected!'));

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(session({
    secret: 'Secret',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));

app.use(passport.initialize());
app.use(passport.session());

controller(app);

app.listen(PORT, () => console.log(`Listening on ${PORT}!`));