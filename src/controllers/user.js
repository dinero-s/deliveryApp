const express = require('express');
const router = express.Router();
const userService = require('../service/user');
const userMiddleWare = require('../middleware/loginMiddleware')

router.post('/signup', userService.createUser);
router.post('/getUserByEmail', userService.getUserByEmail);
router.post('/signin', userMiddleWare, userService.authUser);


module.exports = router;