const storage = require('./CloudStorage');

const generateV4UploadSignedUrl = async (bucketName, filename, mimeType) => {
  const options = {
    version: 'v4',
    action: 'write',
    expires: Date.now() + 5 * 60 * 1000, // 5 minutes
    contentType: mimeType,
  };

  // Get a v4 signed URL for uploading file
  const [url] = await storage
    .bucket(bucketName)
    .file(filename)
    .getSignedUrl(options);

  return url;
}

module.exports = {
  generateV4UploadSignedUrl: generateV4UploadSignedUrl,
}