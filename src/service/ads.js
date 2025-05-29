// const AdsModel = require('../models/adsModel');
//
// const adsView = async (req, res) => {
//     const {shortText, description, userId, tags} = req.body;
//     try {
//         // const ads = await AdsModel.find(params);
//     } catch (error) {
//         res.status(400).json({error});
//     }
// }
//
// const createAd = async (req, res) => {
//     const {shortTitle, description} = req.body;
//     try {
//         const data = {
//             shortTitle,
//             description,
//         }
//         const newAd = await AdsModel.create(data);
//     } catch (error) {
//         res.status(400).json({error});
//     }
// }
//
// module.exports = {
//     adsView
// };