const router = require('express').Router();
const middlewares = require('../../middlewares');
const registrationController = require('./registration.controllers');

router.post('/', middlewares.validateBody(), registrationController.register);
router.get('/activate/:rollnumber/:activationlink', registrationController.activateAccount);
router.post('/send-activation-link', middlewares.validateBody(), registrationController.sendActivationLink);

module.exports = router;