const userControllers = require('./user')
const adsControllers = require('./ads')
const chatControllers = require('./chat')

const controller = (app) => {
    app.use('/app', userControllers)
    app.use('/app', adsControllers)
    app.use('/app', chatControllers)
}

module.exports = controller