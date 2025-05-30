const express = require('express');
const router = express.Router();
const adsService = require('../service/ads');
const { upload } = require('../middlewares/multerMiddleware');
const passport = require('passport');


router.post('/advertisements', passport.authenticate('jwt', { session: false }), upload.array('images', 5), adsService.createAd);


module.exports = router;