export { };
const imageController = require('./image.controllers');
const middlewares = require('../../middlewares');
const router = require('express').Router();

router.get('/upload-verification-document', imageController.getUploadSignedUrlForVerificationDocument);
router.get('/upload-item-image', middlewares.isAuth(), imageController.getUploadSignedUrlForItemImage)

module.exports = router;