const AdsModel = require('../models/adsModel');
const jwt = require('jsonwebtoken');

const createAd = async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Токен не предоставлен' });
    }

    const token = authHeader.split(' ')[1];
    const {shortTitle, description} = req.body;
    const images = req.files?.map(file => ({
        path: file.path,
        originalName: file.originalname,
    })) || []
    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET);
        if (!req.body.shortTitle) {
            return res.status(400).json({ error: "Поле shortTitle обязательно" });
        }
        const data = {
            shortTitle,
            description,
            images: images.map(img => img.path),
            userID: req.user.id,
            createdAt: new Date(),
            updatedAt: new Date(),
            isDeleted: false
        }
        const newAd = await AdsModel.create(data);
        res.status(201).json(newAd);
    } catch (error) {
        console.error("Ошибка при создании объявления:", error);
    }
}

module.exports = {
    createAd
};