const bcrypt = require('bcrypt');
const UserModel = require('../models/userModel');
const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async (email, password, done) => {
    try {
        const user = await UserModel.findOne({ email });
        if (!user) return done(null, false, { message: 'Пользователь не найден' });

        const isMatch = await bcrypt.compare(password, user.hashPassword);
        if (!isMatch) return done(null, false, { message: 'Неверный пароль' });

        return done(null, user);
    } catch (err) {
        return done(err);
    }
}));

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
};

passport.use(new JwtStrategy(jwtOptions, async (payload, done) => {
    try {
        const user = await UserModel.findById(payload.id);
        if (user) return done(null, user);
        return done(null, false);
    } catch (err) {
        return done(err, false);
    }
}));

const createUser = async (req, res) => {
    const {email, password, name, contactPhone} = req.body;
    try {
        const hashPassword = await bcrypt.hash(password, 10);
        const data = {
            email,
            hashPassword,
            name,
            contactPhone,
        }
        const user = await UserModel.create(data);
        res.json(user);
    } catch (error) {
        return res.status(400).json({error});
    }
}

const authUser = async (req, res) => {
    const {email} = req.body;
    const user = await UserModel.findOne({email});
    try {
        const loginDataOk = {
            data: {
                id: user._id,
                email: user.email,
                name: user.name,
                contactPhone: user.contactPhone,
            },
            status: 'ok'
        }

        res.json(loginDataOk);
    } catch (error) {
        return res.status(400).json({error});
    }

}

const getUserByEmail = async (req, res) => {
    const {email} = req.body;
    try {
        if(!email) {
            res.send(null)
        }
        const user = await UserModel.findOne({email});
        res.json(user);
    } catch (error) {
        return res.status(400).json({error});
    }
}

module.exports = {
    createUser,
    authUser,
    getUserByEmail
};