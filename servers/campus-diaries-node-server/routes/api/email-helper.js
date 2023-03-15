var nodemailer  = require('nodemailer');
var bcrypt      = require('bcrypt');

var credentials = require('../../config/email-creds');
var logger      = require('../../config/winston');

const salt_rounds = 10;

function getTransporter() {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: credentials.email,
            pass: credentials.password
        }
    });
    return transporter;
}

function sendVerificationEmail(user) {

    var transporter = getTransporter();

    var mailOptions = {
        from    : credentials.email,
        to      : user.email,
        subject : 'Verification link for your Campus Diaries Account',
        html    : '<h3>Please click on the below link to verify your account.' + '</br>' + 
                  '<a href = "' + 'http://localhost:3000' + '/api/newuser/activate/' + user.rollnumber + '/' + user.activationlink + '">Click Here</a>'
    }

    transporter.sendMail(mailOptions)
        .then((res) => {
            //TODO: maintain internal logs of successes and failures
        })
        .catch((err) => {
            logger.error(err.toString());
        });
}

function sendPasswordResetLink(forgotPasswordOf, studentid, resetLink) {
    var transporter = getTransporter();

    var mailOptions = {
        from    : credentials.email,
        to      : forgotPasswordOf,
        subject : 'Password Reset link for your Campus Diaries Account',
        html    : '<h3>Please click on the below link to reset your password.' + '</br>' + 
                  '<a href = "' + 'http://localhost:3000' + '/forgotpassword/?id=' + studentid + '&resetlink=' + resetLink + '">Click Here</a>' + '</br>' +
                  'Please ignore if this was not requested by you.'
    }

    transporter.sendMail(mailOptions)
        .then((res) => {
            //TODO: maintain internal logs of successes and failures
        })
        .catch((err) => {
            logger.error(err.toString());
        });
}

function encryptPassword(password, done) {
    bcrypt.hash(password, salt_rounds)
            .then((hash) => {
                done(hash);
            })
            .catch((err) => {
                done(null);
            });
}

exports.sendVerificationEmail = sendVerificationEmail;
exports.sendPasswordResetLink = sendPasswordResetLink;
exports.encryptPassword = encryptPassword;