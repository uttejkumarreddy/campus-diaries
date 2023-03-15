var router              = require('express').Router();
var { connectionPool }  = require('../config/databases');
var { encryptPassword } = require('./api/email-helper');
var { validatePassword }= require('../validations/new-user-validation');

router.get('/', function(req, res, next) {
    var studentid = req.query.id;
    var resetlink = req.query.resetlink;
    if(studentid && resetlink) {
        connectionPool.query(
            'SELECT * from student where rollnumber = ? and resetlink = ? LIMIT 1', [studentid, resetlink], function(err, results, fields) {
                if(err) {
                    return res.status(500).render('message.html', {
                        'message': 'Something went wrong on our side. Try again.'
                    });
                }
                if(results.length == 1) {
                    return res.status(200).render('forgot-password.html');
                } else {
                    return res.status(404).render('404.html');
                }
            }
        )
    } else {
        return res.status(404).render('404.html');
    }
});

router.post('/', function(req, res, next) {
    var studentid = req.query.id;
    var resetlink = req.query.resetlink;
    if(studentid && resetlink) {
        var password1 = req.body.inputPassword1;
        var password2 = req.body.inputPassword2;
        if(password1 === password2) {
            if(!validatePassword(password1)) {
                return res.status(400).render('message.html', {
                    'message': 'Password must contain atleast one capital letter, one small letter and a number.'
                })
            }
            connectionPool.query(
                'SELECT * from student where rollnumber = ? and resetlink = ? LIMIT 1', [studentid, resetlink], function(err, results, fields) {
                    if(err) {
                        return res.status(500).render('message.html', {
                            'message': 'Something went wrong on our side. Try again.'
                        });
                    }
                    if(results.length == 1) {
                        encryptPassword(password1, function(result) {
                            if(result == null) {
                                return res.status(500).render('message.html', {
                                    'message': 'Something went wrong on our side. Try again.'
                                });
                            } else {
                                connectionPool.query(
                                    'UPDATE student set password = ?, resetlink = ? where rollnumber = ?', [result, null, studentid], function(err, results, fields) {
                                        if(err) {
                                            return res.status(500).render('message.html', {
                                                'message': 'Something went wrong on our side. Try again.' + JSON.stringify(err)
                                            });
                                        }
                                        return res.status(200).render('message.html', {
                                            'message': 'Password successfully changed!'
                                        });
                                    }
                                )
                            }
                        })
                    } else {
                        return res.status(404).render('404.html');
                    }
                }
            )
        } else {
            return res.status(400).render('message.html', {
                'message': 'Passwords do not match! Try again.'
            })
        }
    } else {
        return res.status(404).render('404.html');
    }
});

module.exports = router;