const bcrypt = require('bcrypt');
const UserModel = require('../models/userModel');
const passport = require('passport');
const {compare} = require("bcrypt");
const LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy( {
        usernameField: 'email',
        passwordField: 'password'
    },
    async (email, password, done) => {

        try {
            const user = await UserModel.findOne({ email });
            if (!user) return done(null, false);
            const isPasswordValid = await user.verifyPassword(password);
            if (!isPasswordValid) return done(null, false);

            return done(null, user);
        } catch (err) {
            return done(err);
        }
    }
));

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await UserModel.findById({_id: id});
        done(null, user);
    } catch (err) {
        done(err);
    }
});

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