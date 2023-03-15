// Express Router to direct requests
var router = require('express').Router();

router.use('/api', require('./api'));
router.use('/forgotpassword', require('./forgot-password'));

module.exports = router;