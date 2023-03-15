export { };
const router = require('express').Router();
const userController = require('./user.controllers');

router.get('/:college/:rollnumber', userController.isRollnumberRegisteredInCollege);

module.exports = router;