const express = require('express');
const router = express.Router();
const userService = require('../service/user');
const userMiddleWare = require('../middlewares/loginMiddleware')

router.post('/signup', userService.createUser);
router.post('/signin', userMiddleWare, userService.authUser);
router.post('/getUserByEmail', userService.getUserByEmail);


module.exports = router;