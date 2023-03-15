const userController = require('./user.controllers');
const router = require('express').Router();

router.post('/login', userController.loginUser);

module.exports = router;