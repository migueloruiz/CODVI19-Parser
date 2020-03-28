// Dependences
// ==========================
const path = require('path')
const http = require('http')
const express = require('express')

// Server Setup
// ==========================

var app = express()
app.set('port', 4000)
app.use(function (req, res, next) {
    res.header('Content-Type','application/json')
    next()
})

var server = http.createServer(app)
app.use(require('./routes'))
app.listen(app.get('port'), () => {
    let port = app.get('port')
    let message = `Running ${port}`
    console.log(message)
})