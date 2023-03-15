const router = require('express').Router();

router.use('/college', require('./college'));
router.use('/register', require('./registration'));
router.use('/login', require('./login'));
router.use('/user', require('./user'));

module.exports = router;
