export { };
const storage = require('./CloudStorage');

const generateUploadSignedUrl = async (bucketName: string, filename: string, mimeType: string) => {
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

const isValidUrl = (url: string) => {
  if (url) { return true };
}

module.exports = {
  generateUploadSignedUrl: generateUploadSignedUrl,
  isValidUrl: isValidUrl,
}