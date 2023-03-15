const router = require('express').Router();

router.use('/login', require('./Login/routes'));

module.exports = router;
