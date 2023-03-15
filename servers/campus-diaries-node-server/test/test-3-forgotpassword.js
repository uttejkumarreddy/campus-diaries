var expect              = require('expect');
var request             = require('request');
var bcrypt              = require('bcrypt');
var {testconnection}    = require('./config');
var {BASE_URL}          = require('./config');
var {apis}              = require('./config');

describe('Forgot Password', () => {

    it('should generate reset hash on api hit', (done) => {

        var options = {
            method: 'post',
            body:
        }
    })
})