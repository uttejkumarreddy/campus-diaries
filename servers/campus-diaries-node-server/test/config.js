const expect            = require('expect');
const mysql             = require('mysql');
const mongoose          = require('mongoose');
const {mySqlConnection} = require('../config/configurations');

mongoose.Promise = global.Promise;

var testconnection = mysql.createConnection({
    host: mySqlConnection.host,
    user: mySqlConnection.user,
    password: mySqlConnection.password,
    database: mySqlConnection.testdatabase
});

var BASE_URL = 'http://localhost:3000/api/';

var apis = {
    registerNewStudent: 'newuser/register',
    activateAccount: 'newuser/activate',
    resendActivationMail: 'newuser/resendactivationlink',
    login:  'auth/login',
    forgotpassword: 'forgotpassword'
}

before((done) => {
    mongoose.connect('mongodb://localhost:27017/campusdiariestest', { useNewUrlParser: true })
        .then((success) => {
            done();
        })
        .catch((error) => {
            console.warn('Warning', error);
            done(error);
        });
});

before((done) => {
    testconnection.connect(function(err) {
        if (err) {
            console.warn('Warning', err);
            done(err);
        }
    });
    done();
});

before((done) => {
    testconnection.query('truncate student', function(err, results, fields) {
        if(err) throw err;
    });
    done();
});

describe('Clear records in all tables', () => {
    it('should empty student', (done) => {
        testconnection.query('select * from student', function(err, results, fields) {
            if(err) done(err);
            expect(results.length).toEqual(0);
            done();
        });
    });
});

module.exports = {
    mongoose: mongoose,
    testconnection: testconnection,
    BASE_URL: BASE_URL,
    apis: apis
} 