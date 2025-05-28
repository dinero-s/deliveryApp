const userControllers = require('./user')

const controller = (app) => {
    app.use('/app', userControllers)
}

module.exports = controller