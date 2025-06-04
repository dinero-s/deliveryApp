const AdsModel = require('../models/adsModel');
const UserModel = require('../models/userModel');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');

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
        const newAdDB = {
            data: {
                id: newAd._id,
                shortTitle: newAd.shortTitle,
                description: newAd.description,
                images: images.map(img => img.path),
                user: {
                    id: req.user.id,
                    name: req.user.user,
                },
                createdAt: newAd.createdAt,
            },
            status: 'ok'
        }
        res.status(201).json(newAdDB);
    } catch (error) {
        console.error("Ошибка при создании объявления:", error);
    }
}


const findAdById = async (req, res) => {
    const {id} = req.params;

    try {
        const ad = await AdsModel.findById(id)

        if (!ad) {
            return res.status(404).json({error: 'Объявление не найдено'});
        }
        const userDB = await UserModel.findById(ad.userID.toString())
        const newAdDB = {
            data: {
                id: ad._id,
                shortTitle: ad.shortTitle,
                description: ad.description,
                images: ad.images || [],
                user: {
                    id: ad.userID,
                    name: userDB.name,
                },
                createdAt: ad.createdAt,
            },
            status: 'ok'
        }
        res.status(200).json(newAdDB)
    } catch (error) {
        return res.status(500).json({error});
    }
}

const getAllAds = async (req, res) => {
    try {
        const ads = await AdsModel.find({})
        res.status(200).json(ads)
    } catch (error) {
        return res.status(500).json({error});
    }

}

const deleteAdById = async (req, res) => {
    const {id} = req.params;
    const userId = req.user.id

    try {
        const ad = await AdsModel.findById(id)
        if (!ad) {
            return res.status(404).json({ error: "Объявление с таким ID не найдено" });
        }

        if (ad.userID.toString() !== userId.toString()) {
            return res.status(403).json({ error: "Вы не можете удалить чужое объявление" });
        }

        if (ad.images && ad.images.length > 0) {
            await Promise.all(ad.images.map(async (imagePath) => {
                try {
                    // Строим абсолютный путь к файлу
                    const fullPath = path.join(__dirname, '..', 'public', imagePath);

                    // Проверяем существует ли файл (не обязательно, unlink и так не падает если файла нет)
                    await fs.access(fullPath);

                    // Удаляем файл
                    await fs.unlink(fullPath);
                    console.log(`Файл удалён: ${fullPath}`);
                } catch (err) {
                    // Если файла нет - это не ошибка, просто пропускаем
                    if (err.code !== 'ENOENT') {
                        console.error(`Ошибка при удалении файла ${imagePath}:`, err);
                    }
                }
            }));
        }

        await AdsModel.deleteOne({ _id: ad._id })
        res.status(200).json(`Объявление с ID: ${ad._id} было удалено`)
    } catch (error) {
        return res.status(500).json({error});
    }
}

const findAdByParams = async (req, res) => {
    const {shortTitle, description, userID, tags} = req.body
    const query = {};

    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ error: "Тело запроса не может быть пустым" });
    }
    if (shortTitle) {
        query.shortTitle = { $regex: shortTitle, $options: 'i' };
    }
    if (description) {
        query.description = { $regex: description, $options: 'i' };
    }
    if (userID) {
        query.userID = userID;
    }
    if (tags && tags.length > 0) {
        query.tags = { $all: tags };
    }

    const adDB = await AdsModel.find(query);
    res.status(200).json({ data: adDB });
}

module.exports = {
    createAd,
    findAdById,
    getAllAds,
    deleteAdById,
    findAdByParams
};