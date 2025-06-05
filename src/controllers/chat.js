const express = require('express');
const router = express.Router();
const chatService = require('../service/chat');

router.post('/chat', chatService.createChatHandler);
router.post('/chat/:chatId/messages', chatService.sendMessageHandler);
router.get('/chat/:chatId/messages', chatService.getMessagesHandler);


module.exports = router;