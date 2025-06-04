const express = require('express');
const router = express.Router();
const adsService = require('../service/ads');
const { upload } = require('../middlewares/multerMiddleware');
const passport = require('passport');


router.post('/advertisements', passport.authenticate('jwt', { session: false }), upload.array('images', 5), adsService.createAd);
router.get('/advertisements/:id', adsService.findAdById)
router.get('/advertisements', adsService.getAllAds)
router.delete('/advertisements/:id', passport.authenticate('jwt', { session: false }), adsService.deleteAdById)
router.post('/getAdByParams', adsService.findAdByParams)


module.exports = router;