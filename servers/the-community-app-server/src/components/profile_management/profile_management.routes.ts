export { };
const router = require('express').Router();
const middlewares = require('../../middlewares');
const profileManagementController = require('./profile_management.controllers');

router.post('/', middlewares.validateBody(), profileManagementController.updateUserProfile);
router.post('/report-user', middlewares.validateBody(), profileManagementController.reportUser);

module.exports = router;