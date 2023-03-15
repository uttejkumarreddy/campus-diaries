var router = require('express').Router();

router.use('/newuser', require('./registration'));
router.use('/auth', require('./auth'));
router.use('/forgotpassword', require('./forgot-password'));

module.exports = router;