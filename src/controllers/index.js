const userControllers = require('./user')
const adsControllers = require('./ads')
const chatControllers = require('./chat')

const controller = (app) => {
    app.use('/api', userControllers)
    app.use('/api', adsControllers)
    app.use('/api', chatControllers)
}

module.exports = controller