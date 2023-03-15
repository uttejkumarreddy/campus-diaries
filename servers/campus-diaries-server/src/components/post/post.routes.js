const postController = require('./post.controllers');
const router = require('express').Router();

router.get('/get-upload-signed-url', postController.getV4UploadSignedUrlForPost);

module.exports = router;