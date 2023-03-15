const mongoose = require('mongoose');
const router = require('express').Router();
const User = mongoose.model('User');
const randomString = require('crypto-random-string');
const AWS = require('aws-sdk');
const uuid = require('uuid/v1');
const keys = require('../../config/dev-keys');

let {
    sendSuccessMessage
} = require('../../utils/responses/responses');
let {
    sendErrorMessage
} = require('../../utils/responses/responses');

const userIdsS3 = new AWS.S3({
    accessKeyId: keys.s3_user_ids_access_key,
    secretAccessKey: keys.s3_user_ids_secret_key
})

/* Creating a new user */
router.post('/user/new', (req, res, next) => {
    let user = new User();
    req = req.body;
    try {
        user.name = req.user.name;
        user.username = req.user.username;
        user.email = req.user.email;
        user.password = req.user.password;
        user.setPassword(user.password, (err, hash) => {
            if (err) throw '500' + JSON.stringify(err);
            user.password = hash;
            user.activationKey = randomString({
                length: 72,
                type: 'url-safe'
            });
            user.save()
                .then(() => sendSuccessMessage(res, 201, 'An activation link has been sent to your mail.'))
                .catch(next);
        })
    } catch (err) {
        console.log(err);
        // if (err.substring(0, 3) == '500')
            // sendErrorMessage(res, 500, 'Internal server error. Please try again.', err);
        // else 
            // sendErrorMessage(res, 400, 'Bad request', err);
    }
})

router.get('/user/id', (req, res, next) => {
    const key = `${uuid()}.jpeg`;
    userIdsS3.getSignedUrl('putObject', {
        Bucket: 'cd-users-ids',
        ContentType: 'jpeg',
        Key: key
    }, (err, url) => res.send({ key, url }))
})

module.exports = router;