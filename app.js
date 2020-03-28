// Dependences
// ==========================
const path = require('path')
const http = require('http')
const express = require('express')
const env = require('./config')


// Server Setup
// ==========================

var app = express()
app.set('port', env.PORT)
app.use(function (req, res, next) {
    res.header('Content-Type','application/json')
    next()
})

var server = http.createServer(app)
app.use(require('./routes'))
app.listen(app.get('port'), () => {
    let mode = env.IS_DEV ? 'Dev' : 'Prod'
    let port = app.get('port')
    let message = `Running ${env.PROJECT} in ${mode} Mode at ${env.HOST}:${port}`
    console.log(message)
})