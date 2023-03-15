const router = require('express').Router();

router.use('/user', require('../components/user/user.routes'));
router.use('/post', require('../components/post/post.routes'));
router.use('/login', require('../components/login/login.routes'));
router.use('/register', require('../components/registration/registration.routes'));

module.exports = router;