const passport = require("passport");

const userMiddleWare = (req, res, next) => {

    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            const errorMessage = info?.message || 'Неверный email или пароль';
            return res.status(401).json({ message: errorMessage });
        }
        req.logIn(user, (err) => {
            if (err) {
                return next(err);
            }
            return next();
        });
    })(req, res, next);
};

module.exports = userMiddleWare;