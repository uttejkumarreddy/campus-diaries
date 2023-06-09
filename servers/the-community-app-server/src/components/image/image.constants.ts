export { };
const SUPPORTED_FILE_EXT = [
  'jpg',
  'jpeg',
  'png',
];

const SUPPORTED_FILE_EXT_MIME_MAPPING = {
  'jpeg': 'image/jpeg',
  'jpg': 'image/jpeg',
  'png': 'image/png',
};

const VERIFICATION_DOCUMENT_BUCKET = process.env.VERIFICATION_DOCUMENT_BUCKET;

const FILE_TYPE_NOT_SUPPORTED = 'File type not supported.';

module.exports = {
  SUPPORTED_FILE_EXT: SUPPORTED_FILE_EXT,
  SUPPORTED_FILE_EXT_MIME_MAPPING: SUPPORTED_FILE_EXT_MIME_MAPPING,
  VERIFICATION_DOCUMENT_BUCKET: VERIFICATION_DOCUMENT_BUCKET,
  FILE_TYPE_NOT_SUPPORTED: FILE_TYPE_NOT_SUPPORTED,
}