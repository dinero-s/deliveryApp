const { Types } = require('mongoose');
const ChatModel = require('../models/chatModel');

const validateUsers = (users) => {
    if (!Array.isArray(users)) {
        throw new Error('Users must be an array');
    }

    if (users.length !== 2) {
        throw new Error('Chat must contain exactly 2 users');
    }

    if (!users.every(id => Types.ObjectId.isValid(id))) {
        throw new Error('All user IDs must be valid ObjectId');
    }

    return users.map(id => new Types.ObjectId(id)).sort();
};

const findChatBetweenUsers = async users => {
    try {
        const sortedUsers = validateUsers(users);
        return await ChatModel.findOne({ users: sortedUsers });
    } catch (error) {
        throw new Error(`Error finding chat: ${error.message}`);
    }
};

const createChat = async (users) => {
    try {
        const validatedUsers = validateUsers(users);
        return await ChatModel.create({ users: validatedUsers });
    } catch (error) {
        throw new Error(`Chat creation failed: ${error.message}`);
    }
};

// Добавьте обработчик для POST /chat
const createChatHandler = async (req, res) => {
    try {
        const { users } = req.body;
        const chat = await createChat(users);
        res.status(201).json(chat);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getChatById = async (chatId) => {
    try {
        return await ChatModel.findById(chatId);
    } catch (error) {
        throw new Error(`Error finding chat: ${error.message}`);
    }
};

const sendMessage = async (chatId, authorId, text) => {
    try {
        const chat = await getChatById(chatId);
        if (!chat) {
            throw new Error('Chat not found');
        }

        const newMessage = {
            author: authorId,
            text,
            sentAt: new Date()
        };

        chat.messages.push(newMessage);
        await chat.save();

        return chat;
    } catch (error) {
        throw new Error(`Error sending message: ${error.message}`);
    }
};

const getChatMessages = async (chatId) => {
    try {
        const chat = await ChatModel.findById(chatId)
            .populate('messages.author', 'name');
        if (!chat) {
            throw new Error('Chat not found');
        }
        return chat.messages;
    } catch (error) {
        throw new Error(`Error getting messages: ${error.message}`);
    }
};

// Добавьте обработчики для новых endpoint'ов
const sendMessageHandler = async (req, res) => {
    try {
        const { chatId } = req.params;
        const { author, text } = req.body;
        const chat = await sendMessage(chatId, author, text);
        res.status(200).json(chat);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getMessagesHandler = async (req, res) => {
    try {
        const { chatId } = req.params;
        const messages = await getChatMessages(chatId);
        res.status(200).json(messages);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    findChatBetweenUsers,
    createChat,
    createChatHandler,
    sendMessage,
    sendMessageHandler,
    getChatMessages,
    getMessagesHandler
};