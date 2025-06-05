const { Types } = require('mongoose');
const ChatModel = require('../models/chatModel');

const validateUsers = (users) => {
    if (!Array.isArray(users) || users.length !== 2) {
        throw new Error(users.length !== 2
            ? 'В чате должно быть 2 пользователя'
            : 'Пользователи должны быть массивом');
    }

    const isValid = users.every(Types.ObjectId.isValid);
    if (!isValid) throw new Error('ID всех пользователей должны быть типом ObjectId');

    return users.map(id => new Types.ObjectId(id)).sort();
};

const findChatBetweenUsers = async users => {
    try {
        const sortedUsers = validateUsers(users);
        return await ChatModel.findOne({ users: sortedUsers });
    } catch (error) {
        throw new Error(`Ошибка поиска чата: ${error.message}`);
    }
};

const createChat = async (req, res) => {
    try {
        const { users } = req.body;

        if (!Array.isArray(users) || users.length !== 2) {
            throw new Error(users.length !== 2
                ? 'В чате должно быть 2 пользователя'
                : 'Пользователи должны быть массивом');
        }

        if (!users.every(Types.ObjectId.isValid)) {
            throw new Error('ID всех пользователей должны быть типом ObjectId');
        }

        const validatedUsers = users.map(id => new Types.ObjectId(id)).sort();

        const chat = await ChatModel.create({ users: validatedUsers });
        res.status(201).json(chat);

    } catch (error) {
        res.status(400).json({
            error: error.message.startsWith('Не удалось создать чат:')
                ? error.message
                : `Не удалось создать чат: ${error.message}`
        });
    }
};

const getChatById = async (chatId) => {
    try {
        return await ChatModel.findById(chatId);
    } catch (error) {
        throw new Error(`Ошибка поиска чата: ${error.message}`);
    }
};

const sendMessage = async (chatId, authorId, text) => {
    try {
        const chat = await getChatById(chatId);
        if (!chat) {
            throw new Error('Чат не найден');
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
    sendMessage,
    sendMessageHandler,
    getChatMessages,
    getMessagesHandler
};