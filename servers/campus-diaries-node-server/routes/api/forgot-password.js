var router                  = require('express').Router();
var {connectionPool}        = require('../../config/databases');
var logger                  = require('../../config/winston');
var randomstring            = require('randomstring');
var {sendPasswordResetLink} = require('./email-helper');

router.post('/', function(req, res, next) {

    var forgotPasswordOf = req.body.email;

    if(!forgotPasswordOf) {
        return res.status(400).json({errors: {
            "error": 'Bad request',
            "message": 'No email present.'
        }});
    }

    connectionPool.query(
        "SELECT * from student where email = ? LIMIT 1", forgotPasswordOf, function(err, results, fields) {
            if(err) {
                logger.error(err.toString());
                return res.status(500).json({errors: {
                    "error": "Error retrieving data.",
                    "message": "Server Error. Please try again later."
                }});
            } else if(results.length == 0) {
                return res.status(400).json({errors: {
                    "error": "Bad Request.",
                    "message": "The email is not registered with us."
                }});
            } else if(results.length == 1) {
                var resetlink = randomstring.generate({ length: 40 });
                var studentid = results[0].rollnumber;
                connectionPool.query(
                    'UPDATE student SET resetlink = ? WHERE email = ?', [resetlink, forgotPasswordOf], function(err, results, fields) {
                        if(err) {
                            logger.error(err.toString());
                            return res.status(500).json({errors: {
                                "error": "Error updating reset link.",
                                "message": "Server Error. Please try again later."
                            }});
                        }

                        sendPasswordResetLink(forgotPasswordOf, studentid, resetlink);

                        return res.status(200).json({data: {
                            "success": true,
                            "message": "A password reset email has been sent to your email."
                        }})
                        
                    }
                )
            }
        }
    )
});

router.post('/newpassword', function(req, res, next) {
    
});

module.exports = router;
