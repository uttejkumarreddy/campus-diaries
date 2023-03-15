const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const helmet = require('helmet')
const path = require('path')
const morgan = require('morgan')

const mongoose = require('./configurations/database')
const winston = require('./configurations/winston')
const errorHandler = require('./lib/error-handler')

require('dotenv').config()

const app = express()

app.use(cors())
app.use(helmet())

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

app.use(morgan('combined', { stream: winston.stream }))

// require('./models/College');
// require('./models/Roles');
// require('./models/User');
// require('./models');

app.use(require('./routes'))
app.use((req, res, next) => {
    // TODO: log
    const error = new Error()
    error.message = 'Requested url not found'
    error.name = 'PageNotFoundError'
    next(error)
})
app.use(errorHandler)

const server = app.listen(process.env.PORT || 3000, () => {
    // TODO: log
    console.log('Listening on port ' + server.address().port)
})
