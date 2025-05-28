const express = require('express');
const app = express();
require('dotenv').config();
const router = require('./router/index');

const PORT = process.env.PORT || 3000;

app.use(express.json())
app.use('/', router)

app.listen(PORT, () => console.log(`Listening on ${PORT}!`));