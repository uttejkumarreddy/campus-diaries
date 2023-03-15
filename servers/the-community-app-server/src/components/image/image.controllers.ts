
export { };
const { v4: uuidv4 } = require('uuid');
const SignedUrlService = require('../../services/SignedUrl');
const { extractFileConfigurations } = require('./image.services');
const Constants = require('./image.constants');
import { Request, Response, NextFunction } from "express";

const getUploadSignedUrlForVerificationDocument = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let requestedFilename = req.query.filename;
    let requestedFileConfig = extractFileConfigurations(requestedFilename);
    
    if (!requestedFileConfig)
      return next(Constants.FILE_TYPE_NOT_SUPPORTED);

    let uniqueFileID = uuidv4();
    let filename = uniqueFileID + '.' + requestedFileConfig.extension;
    let signedUrl = await SignedUrlService.generateUploadSignedUrl(Constants.VERIFICATION_DOCUMENT_BUCKET, filename, requestedFileConfig.mimetype);
    return res.status(200).json({ success: true, data: { id: uniqueFileID, uploadUrl: signedUrl } });
  } catch (err) {
    next(err);
  }
};

const getUploadSignedUrlForItemImage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let requestedFilename = req.query.filename;
    let requestedFileConfig = extractFileConfigurations(requestedFilename);
    
    if (!requestedFileConfig)
      return next(Constants.FILE_TYPE_NOT_SUPPORTED);

    let uniqueFileID = uuidv4();
    let filename = uniqueFileID + '.' + requestedFileConfig.extension;
    let signedUrl = await SignedUrlService.generateUploadSignedUrl(Constants.VERIFICATION_DOCUMENT_BUCKET, filename, requestedFileConfig.mimetype);
    return res.status(200).json({ success: true, data: { id: uniqueFileID, uploadUrl: signedUrl } });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getUploadSignedUrlForVerificationDocument: getUploadSignedUrlForVerificationDocument,
  getUploadSignedUrlForItemImage: getUploadSignedUrlForItemImage,
};