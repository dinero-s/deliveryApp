const socketIO = require('socket.io');
const chatService = require('../service/chat');

module.exports = function(server) {
    const io = socketIO(server);

    io.on('connection', (socket) => {
        const currentUserId = socket.request.user._id;

        socket.on('getHistory', async (interlocutorId) => {
            try {
                await chatService.findChatBetweenUsers([currentUserId, interlocutorId]);
            } catch (err) {
                console.error('Error:', err);
            }
        });

        socket.on('sendMessage', async (data) => {
            try {
                const { receiver, text } = data;
                const chat = await chatService.getOrCreateChat([currentUserId, receiver]);
                await chatService.addMessage(chat._id, currentUserId, text);
            } catch (err) {
                console.error('Error:', err);
            }
        });
    });
};