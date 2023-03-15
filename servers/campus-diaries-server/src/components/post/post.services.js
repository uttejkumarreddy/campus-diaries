const { SUPPORTED_FILE_EXT, SUPPORTED_FILE_EXT_MIME_MAPPING } = require('./post.constants');

exports.extractFileConfigurations = (filename) => {
  if (!filename) {
    return false;
  }

  let extension = filename.split('.').pop();
  if (!SUPPORTED_FILE_EXT.includes(extension)) {
    return false;
  };

  let mimetype = SUPPORTED_FILE_EXT_MIME_MAPPING[extension];

  return {
    extension: extension,
    mimetype: mimetype,
  };
}