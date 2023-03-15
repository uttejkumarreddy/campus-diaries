const { v4: uuidv4 } = require('uuid');

const SignedUrlService = require('../../services/SignedUrl');
const { extractFileConfigurations } = require('./post.services');
const { POSTS_BUCKET } = require('./post.constants');

const getV4UploadSignedUrlForPost = async (req, res, next) => {
  try {
    let requestedFilename = req.query.filename;

    let requestedFileConfig = extractFileConfigurations(requestedFilename);
    if (!requestedFileConfig) {
      return next('File type not supported.');
    }

    let uniqueFileID = uuidv4();
    let filename = uniqueFileID + '.' + requestedFileConfig.extension;
    let signedUrl = await SignedUrlService.generateV4UploadSignedUrl(POSTS_BUCKET, filename, requestedFileConfig.mimetype);

    return res.status(200).json({ success: true, data: { id: uniqueFileID, uploadUrl: signedUrl } });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getV4UploadSignedUrlForPost: getV4UploadSignedUrlForPost,
};