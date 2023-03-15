var expect          = require('expect');
var request         = require('request');
var {testconnection}= require('./config');
var {BASE_URL}      = require('./config');
var {apis}          = require('./config');
var studentData     = require('./test-data');
var jwt             = require('jsonwebtoken');
var {secret}        = require('../config/configurations');

describe('Student login', () => {

     it('should tell user to activate account, if it is not', (done) => {

        testconnection.query(
            'UPDATE student set activated = ? where email = ?', [0, studentData.testStudentLogin.email], function(err, results, fields) {
                if(err) done(err);

                var options = {
                    method: 'post',
                    body: studentData.testStudentLogin,
                    json: true,
                    url: BASE_URL + apis.login
                  }
                
                request(options, function(err, res, body) {
                    if(err) done(err);

                    expect(res.statusCode).toBe(403);
                    expect(res.body.errors.error).toBe('Account not activated.');
                    expect(res.body.errors.message).toBe('Please verify your account to login.');

                    testconnection.query(
                        'UPDATE student set activated = ? where email = ?', [1, studentData.testStudentLogin.email], function(err, results, fields) {
                            if(err) done(err);
    
                            done();
                        }
                    )

                });
            }
        )
    })

    it('should return error on invalid credentials', (done) => {

        var options = {
            method: 'post',
            body: studentData.testStudentInvalidEmail,
            json: true,
            url: BASE_URL + apis.login
          }

        request(options, function(err, res, body) {
            if(err) {
                console.warn(err);
                done(err);
            }

            expect(res.statusCode).toBe(400);
            expect(res.body.errors.error).toBe('Invalid login credentials.');
            expect(res.body.errors.message).toBe('Invalid login credentials.');

            options.body = studentData.testStudentInvalidPassword;

            request(options, function(err, res, body) {
                if(err) {
                    console.warn(err);
                    done(err);
                }

                expect(res.statusCode).toBe(400);
                expect(res.body.errors.error).toBe('Invalid login credentials.');
                expect(res.body.errors.message).toBe('Invalid login credentials.');

                options.body = studentData.testStudentInvalidLoginCreds;

                request(options, function(err, res, body) {
                    if(err) {
                        console.warn(err);
                        done(err);
                    }
        
                    expect(res.statusCode).toBe(400);
                    expect(res.body.errors.error).toBe('Invalid login credentials.');
                    expect(res.body.errors.message).toBe('Invalid login credentials.');
        
                    done();
                });
            });
        });
    });

    it('should return token with payload on valid credentials', (done) => {
        
        var options = {
            method: 'post',
            body: studentData.testStudentLogin,
            json: true,
            url: BASE_URL + apis.login
          }
          
        request(options, function(err, res, body) {
            if(err) {
                console.warn(err);
                done(err);
            }
            
            expect(res.statusCode).toBe(200);
            expect(res.body.data.success).toBeTruthy();
            expect(res.body.data.message).toBe('Login Successful.');

            jwt.verify(res.body.data.token, secret.key, function(err, decoded) {
                if(err) done(err);

                expect(decoded.rollnumber).toBe(studentData.testStudentData.rollnumber);
                expect(decoded.username).toBe(studentData.testStudentData.username);

                done();
            })
        });
    });
})

