var expect              = require('expect');
var request             = require('request');
var bcrypt              = require('bcrypt');
var {testconnection}    = require('./config');
var {BASE_URL}          = require('./config');
var {apis}              = require('./config');
var {testStudentData}   = require('./test-data');
var {testResendEmail}   = require('./test-data');

describe('Student Registration', () => {
    it('should post student data', (done) => {

        var options = {
            method: 'post',
            body: testStudentData,
            json: true,
            url: BASE_URL + apis.registerNewStudent
          }

        request(options, function(err, res, body) {
            if(err) {
                console.warn(err);
                done(err);
            }

            expect(res.statusCode).toBe(200);
            expect(body.data.success).toBeTruthy();
            expect(body.data.message).toEqual('User Registration successful.');

            testconnection.query('SELECT * FROM student', function(err, result, fields) {
                expect(err).toBe(null);
    
                if(err) done(err);
        
                expect(result.length).toBe(1);
                expect(result[0].username).toEqual(testStudentData.username);
                expect(result[0].name).toEqual(testStudentData.name);
                expect(result[0].rollnumber).toEqual(testStudentData.rollnumber);
                expect(bcrypt.compareSync(testStudentData.password, result[0].password)).toBe(true);
                expect(result[0].college).toEqual(testStudentData.college);
                expect(result[0].email).toEqual(testStudentData.email);
                expect(result[0].activationlink.length).toBe(40);
                expect(result[0].activated).toBe(0);

                done();
            });
        });
    });

    it('should activate an account', (done) => {

        testconnection.query('SELECT * FROM student', function(err, result, fields) {
            expect(err).toBe(null);

            if(err) done(err);

            var activationKey = result[0].activationlink;
            var rollnumber = result[0].rollnumber;

            expect(activationKey.length).toBe(40);
            expect(rollnumber).toBe(testStudentData.rollnumber);

            var options = {
                method: 'get',
                url: BASE_URL + apis.activateAccount + '/' + rollnumber + '/' + activationKey
            }

            request(options, function(err, res, body) {
                if(err) {
                    console.warn(err);
                    done(err);
                }

                expect(res.statusCode).toBe(200);

                testconnection.query(
                    'SELECT * from student where rollnumber = ?', testStudentData.rollnumber, function(err, results, fields) {
                        if(err) done(err);

                        expect(results.length).toBe(1);
                        expect(results[0].activated).toBe(1);
                        expect(results[0].activationlink).toBe(null);

                        done();
                    }
                )
            })    
        })
    })

    it('should say account is already activated', (done) => {

        var options = {
            method: 'post',
            body: testResendEmail,
            json: true,
            url: BASE_URL + apis.resendActivationMail
          }

        request(options, function(err, res, body) {
            if(err) {
                console.warn(err);
                done(err);
            }

            expect(res.statusCode).toBe(200);
            expect(body.data.success).toBeTruthy();
            expect(body.data.message).toEqual('Your account has been activated.');

            done();
        })
    })

    it('should resend verification link', (done) => {

        testconnection.query('UPDATE student set activated = ? WHERE rollnumber = ?', [0, testStudentData.rollnumber], function(err, results, fields) {
            expect(err).toBe(null);

            var options = {
                method: 'post',
                body: testResendEmail,
                json: true,
                url: BASE_URL + apis.resendActivationMail
              }
    
              request(options, function(err, res, body) {
                if(err) {
                    console.warn(err);
                    done(err);
                }
    
                expect(res.statusCode).toBe(200);
                expect(body.data.success).toBeTruthy();
                expect(body.data.message).toEqual('An activation link has been sent to ' + testResendEmail.email);

                testconnection.query('SELECT * from student where email = ? LIMIT 1', [testResendEmail.email], function(err, results, fields) {
                    expect(err).toBe(null);
        
                    expect(results.length).toBe(1);
                    expect(results[0].activationlink.length).toBe(40);
                    expect(results[0].activated).toBe(0);

                    done();
                });
            });
        });
    })
});
