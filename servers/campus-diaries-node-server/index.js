// Express Framework
const express = require('express');
// To parse incoming data in request body
const bodyParser = require('body-parser');
// To allow apps to access the server
const cors = require('cors');
// Logging with Morgan and Winston
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const logger = require('./config/winston');

// Connecting to Db
const {connectionPool} = require('./config/databases');
const {mongoose} = require('./config/databases');

// Initialising Express Application
var app = express();

// Configuring Express Application
app.use(cors());

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

var accessLogStream = fs.createWriteStream(path.join(__dirname, path.join('logs', 'accessLog.log')), { flags: 'a' });
app.use(morgan('combined', { accessLogStream }));

// A public folder to store open assets
app.use(express.static(__dirname + '/public'));

// View Engine
var nunjucks = require('nunjucks');
nunjucks.configure('views', {
    autoescape: true,
    express: app
});

// Models 
// NO MODELS YET

// Routes
app.use(require('./routes'));

// If Invalid Route
app.use(function(req, res, next) {
    var err = new Error('Requested url not found');
    err.status = 404;
    next(err);
});

app.use(function(err, req, res, next) {
    res.status(err.status || 500);

    logger.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

    res.json({'errors': {
        message: err.message,
        error: err
    }});
});

// Start server
var server = app.listen( process.env.PORT || 3000, function(){
    console.log('Listening on port ' + server.address().port);
  });
  
