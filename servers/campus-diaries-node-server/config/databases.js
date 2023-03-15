// Connecting to a RDBMS
const mysql = require('mysql');
// Connecting to a NoSQL
const mongoose = require('mongoose');
// Importing configuration values
const {mySqlConnection} = require('./configurations');

// RDBMS Connection Pool
var connectionPool = mysql.createPool({
    connectionLimit: 100,
    host: mySqlConnection.host,
    user: mySqlConnection.user,
    password: mySqlConnection.password,
    database: mySqlConnection.testdatabase
});

// NoSQL Connection
mongoose.Promise = global.Promise;

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/campusdiaries', { useNewUrlParser: true })
  .then(success => {
      console.log('Connected to MongoDB.');
  })
  .catch(err => {
    console.log('Error while connecting to Mongo: ' + Date.now() + ' Error: ' + err);
  });

module.exports = {
    connectionPool: connectionPool,
    mongoose: mongoose
};

