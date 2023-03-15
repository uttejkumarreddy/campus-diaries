const path = require('path')
const { Storage } = require('@google-cloud/storage');

const serviceKey = path.join(__dirname + '../../../configurations/google-cloud-key.json')

const storage = new Storage({
  keyFilename: serviceKey,
  projectId: process.env.PROJECT_ID,
});

module.exports = storage;