const express = require('express')
const http = require('http')
const cors = require('cors')
const routes = require('./network/routes')
var app = express()

const port = 3000

app.use(express.json())
app.use(cors())
app.use(express.urlencoded({ extended: false }))

routes(app)
var httpServer = http.createServer(app)
httpServer.listen(port)
console.log(`La aplicación esta escuchando en http://localhost:${port}`)
