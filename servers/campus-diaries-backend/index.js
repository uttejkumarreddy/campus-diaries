const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');

const mongoose = require('./config/database');

const app = express();

app.use(cors());
app.use(helmet());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

/* Models */
require('./models/User');

/* Routes */
app.use(require('./routes'));

/* Invalid url */
app.use((req, res, next) => {
    //TODO: log here
    let err = new Error('Requested url not found');
    err.status = 404;
    next(err);
});

/* Internal server error */
app.use((err, req, res, next) => {
    //TODO: log here
    console.log(err.stack);
    res.status(err.status || 500);
    res.json({
        'errors': {
            message: err.message,
            error: err
        }
    });
});

let server = app.listen(process.env.PORT || 3000, () => {
    console.log('Listening on port ' + server.address().port);
});