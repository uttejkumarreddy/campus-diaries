export { };
const router = require('express').Router();

router.use('/college', require('../components/college/college.routes'));
router.use('/register', require('../components/registration/registration.routes'));
router.use('/user', require('../components/user/user.routes'));
router.use('/login', require('../components/login/login.routes'));
router.use('/image', require('../components/image/image.routes'));
router.use('/profile', require('../components/profile_management/profile_management.routes'));
router.use('/item', require('../components/StoreItem/storeitem.routes'));

module.exports = router;
