const express = require('express');
const app = express();
require('dotenv').config();
const controller = require('./controllers')

const PORT = process.env.PORT || 3000;

app.use(express.json())
controller(app);

app.listen(PORT, () => console.log(`Listening on ${PORT}!`));