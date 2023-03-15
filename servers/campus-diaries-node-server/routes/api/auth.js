var router              = require('express').Router();
var bcrypt              = require('bcrypt');
var {connectionPool}    = require('../../config/databases');
var jwt                 = require('jsonwebtoken');
var {secret}            = require('../../config/configurations');
var logger              = require('../../config/winston');

router.post('/login', function(req, res, next) {
    connectionPool.query(
        'SELECT * from student where email = ? LIMIT 1', req.body.email, function(err, results, fields) {
            if(err) {
                //TODO: send mail to devs
                logger.error(err.toString());
                return res.status(500).json({errors: {
                    "error": "Could not retrieve user information.",
                    "message": "Oops! Something went wrong on our side."
                }});
            }
            else if(results.length == 0) {
                return res.status(400).json({errors: {
                    "error": "Invalid login credentials.",
                    "message": "Invalid login credentials."
                }});
            }
            else if(results[0].activated == 0) {
                return res.status(403).json({errors: {
                    "error": "Account not activated.",
                    "message": "Please verify your account to login."
                }});
            }
            else if(results.length == 1) {
                bcrypt.compare(req.body.password, results[0].password)
                    .then(isEqual => {
                        if(!isEqual) {
                            return res.status(400).json({errors: {
                                "error": "Invalid login credentials.",
                                "message": "Invalid login credentials."
                            }});
                        }
                        else if(isEqual) {
                            payload = {
                                "rollnumber": results[0].rollnumber,
                                "username": results[0].username
                            }
                            jwt.sign(payload, secret.key, { expiresIn: '7d' }, function(err, token) {
                                if(err) {
                                    logger.error(err.toString());
                                    return res.status(500).json({errors: {
                                        "error": 'Error while generating token.',
                                        "message": "Oops! Something went wrong on our side."
                                    }});
                                }
                                return res.status(200).json({data: {
                                    "success": true,
                                    "message": "Login Successful.",
                                    "token": token
                                }});
                            })
                        }
                    })
                    .catch(err => {
                        logger.error(err.toString());
                        return res.status(500).json({errors: {
                            "error": 'Error while comparing passwords.',
                            "message": "Oops! Something went wrong on our side."
                        }});
                    })
            }
            else {
                return res.status(400).json({errors: {
                    "error": " Bad Request.",
                    "message": "Oops! Something went wrong on our side."
                }});
            }
        }
    )
})

module.exports = router;