const express = require('express')
const router = express.Router()
const controller = require('./controller')
const response = require('../../network/response')

router.post('/', (req, res) => {
    controller.generarPDF(req.body)
        .then((data) => {
            response.success(res, 200, 'Éxito', data)
        }).catch(err => {
            response.error(res, 400, err)
        })
})

module.exports = router