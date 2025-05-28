const express = require('express');
const router = express.Router();
const userService = require('../service/user');

router.get('/user', userService.createUser);

module.exports = router;