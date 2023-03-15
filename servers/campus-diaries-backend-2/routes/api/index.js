const router = require('express').Router()

router.use('/colleges', require('./college'))
router.use('/uploads', require('./upload'))

module.exports = router
