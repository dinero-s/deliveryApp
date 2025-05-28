const express = require('express');
const router = express.Router();
const chatService = require('../service/chat');

router.get('/chat', chatService.chat);


module.exports = router;