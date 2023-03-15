"use strict";
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/campusdiaries', {
    useNewUrlParser: true,
    useCreateIndex: true
})
    .then(() => {
    console.log('Connected to mongodb');
})
    .catch((err) => {
    console.log('Error while connecting to mongodb: ' + err);
});
module.exports = mongoose;
