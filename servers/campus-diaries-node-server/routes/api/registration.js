var router              = require('express').Router();
var {connectionPool}    = require('../../config/databases');
var randomstring        = require('randomstring');
var registrationHelper  = require('./email-helper');
var logger              = require('../../config/winston');
var { validateNewUser } = require('../../validations/new-user-validation');

router.post('/register', function(req, res, next) {

    var newUserData = {
        username: req.body.username,
        name: req.body.name,
        password: req.body.password,
        email: req.body.email,
        college: req.body.college,
        rollnumber: req.body.rollnumber,
        activationlink: randomstring.generate({ length: 40 })
    };

    let errorMessage = validateNewUser (
        newUserData.name, 
        newUserData.password, 
        newUserData.college, 
        newUserData.rollnumber
    )

    if(errorMessage) {
        return res.status(400).json({errors: {
            "error": errorMessage,
            "message": errorMessage
        }});
    }

    registrationHelper.encryptPassword(newUserData.password, function(result) {
        if(result == null) {
            return res.status(500).json({errors: {
                "error": "Could not encrypt password.",
                "message": "Oops! Something went wrong on our side."
            }});
        }
        else {
            newUserData.password = result;

            connectionPool.query(
                "INSERT INTO student SET ?", newUserData, function(err, results, fields) {
                    if(err) {
                        if(err.errno == 1062) {
                            if(err.sqlMessage.toString().indexOf('username') > -1) {
                                return res.status(400).json({errors: {
                                    "error": "Duplicate entry",
                                    "message": "Username already exists"
                                }});
                            }
                            if(err.sqlMessage.toString().indexOf('rollnumber') > -1) {
                                return res.status(400).json({errors: {
                                    "error": "Duplicate entry",
                                    "message": "RollNumber already exists"
                                }});
                            }
                            if(err.sqlMessage.toString().indexOf('email') > -1) {
                                return res.status(400).json({errors: {
                                    "error": "Duplicate entry",
                                    "message": "Email already exists"
                                }});
                            }
                        }
                        else {
                            //TODO: send mail to devs
                            logger.error(err.toString());
                            return res.status(500).json({errors: {
                                "error": "Error saving to DB",
                                "message": "Server Error. Please try again later."
                            }});
                        }
                    }

                    registrationHelper.sendVerificationEmail(newUserData);
                    
                    return res.status(200).json({data: {
                        "success": true,
                        "message": "User Registration successful."
                    }});
                }
            )
        }
    });
});

router.get('/activate/:rollnumber/:activationlink', function(req, res, next) {
    connectionPool.query(
        'SELECT * from student where rollnumber = ?', req.params.rollnumber, function(err, results, fields) {            
            if(err) {
                logger.error(err.toString());
                return res.status(500).json({errors: {
                    "error": "Error retrieving data.",
                    "message": "Server Error. Please try again later."
                }});
            }
            else if(results.length == 0) {
                return res.status(400).json({errors: {
                    "error": "Bad Request.",
                    "message": "This is not a valid request."
                }});
            }
            else if(results.length > 1) {
                //TODO: send mail to devs
                logger.error('Duplicate rollnumbers exist in database');
                return res.status(500).json({errors: {
                    "error": "Duplicate accounts.",
                    "message": "Something went wrong on our side."
                }});
            }
            else if(results[0].activationlink == req.params.activationlink) {
                connectionPool.query(
                    'UPDATE student SET activated = ?, activationlink = null WHERE rollnumber = ?', [1, req.params.rollnumber], function(err, results, fields) {
                        if(err) {
                            //TODO: send mail to devs
                            logger.error(err.toString());
                            return res.status(500).json({errors: {
                                "error": "Error activating the account",
                                "message": "Server Error. Please try again later."
                            }});
                        }
                        else{
                            //TODO: check if client is mobile gmail or webbrowser and redirect/respond accordingly
                            return res.status(200).json({data: {
                                "success": true,
                                "message": "User Account Activated."
                            }});
                        }
                    }
                )
            }
            else{
                return res.status(400).json({errors: {
                    "error": "Bad Request",
                    "message": "This is not a valid request."
                }});
            }
        })
})

router.post('/resendactivationlink', function(req, res, next) {
    // var sendTo = req.body.email;
    // rollnumber = null;
    // connectionPool.query(
    //     'SELECT rollnumber, activated FROM student WHERE email = ? LIMIT 1', sendTo, function(err, results, fields) {
    //         if(err) {
    //             //TODO: send mail to devs
    //             logger.error(err.toString());
    //             return res.status(500).json({errors: {
    //                 "error": "Error retrieving data.",
    //                 "message": "Server Error. Please try again later."
    //             }});
    //         }
    //         else if(results.length == 1) {
    //             if(results[0].activated == 1) {
    //                 return res.status(200).json({data: {
    //                     "success": true,
    //                     "message": "Your account has been activated."
    //                 }});
    //             }
    //             rollnumber = results[0].rollnumber;
    //             var newActivationKey = randomstring.generate({ length: 40});
    //             connectionPool.query(
    //                 'UPDATE student set activationlink = ? where rollnumber = ?', [newActivationKey, results[0].rollnumber], function(err, results, fields) {
    //                     if(err) {
    //                         //TODO: send mail to devs
    //                         return res.status(500).json({errors: {
    //                             "error": "Error updating activation link.",
    //                             "message": "Server Error. Please try again later."
    //                         }});
    //                     }

    //                     var user = {
    //                         email: sendTo,
    //                         rollnumber: rollnumber,
    //                         activationlink: newActivationKey
    //                     };

    //                     registrationHelper.sendVerificationEmail(user);

    //                     return res.status(200).json({data: {
    //                         "success": true,
    //                         "message": "An activation link has been sent to " + req.body.email
    //                     }});
    //                 }
    //             )
    //         }
    //         else {
    //             return res.status(400).json({errors: {
    //                 "error": "Could not find email.",
    //                 "message": "Oops! This email is not registered with us."
    //             }});
    //         }
    //     }
    // )


    var user = {
      email: 'uttej60@gmail.com',
      rollnumber: '1602-15-733-114',
      activationlink: 'helloworld'
  };

  registrationHelper.sendVerificationEmail(user);

  return res.status(200).json({data: {
      "success": true,
      "message": "An activation link has been sent to " + req.body.email
  }});
})

module.exports = router;
