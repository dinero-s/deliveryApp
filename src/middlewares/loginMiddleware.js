const passport = require("passport");
const jwt = require('jsonwebtoken')
require('dotenv').config();

const userMiddleWare = (req, res, next) => {
    passport.authenticate('local',
        {
            usernameField: 'email',
            passwordField: 'password',
            session: false
        },
        (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            const errorMessage = info?.message || 'Неверный email или пароль';
            return res.status(401).json({ message: errorMessage });
        }
        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        console.log(token)
        next();
    })(req, res, next);
};

module.exports = userMiddleWare;