const generarPDF = require('../components/generarPDF/network')

const routes = (app) => {
    app.use('/generarPDF', generarPDF)
}

module.exports = routes
