export { };
const router = require('express').Router();
const middlewares = require('../../middlewares');
const loginController = require('./login.controllers');

router.post('/', middlewares.validateBody(), loginController.tryBasicLogin);
router.post('/forgot-password', middlewares.validateBody(), loginController.sendPasswordResetLink);
router.get('/reset-password/:collegeID/:rollnumber/:passwordResetKey', loginController.sendPasswordResetPage);
router.post('/reset-password/:collegeID/:rollnumber/:passwordResetKey', loginController.acceptPasswordResetPage);

module.exports = router;