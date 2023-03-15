const router = require('express').Router();

const middlewares = require('../../middlewares');
const registrationController = require('../../../controllers').Registration;

router.post('/', middlewares.validateRequest(), async (req, res, next) => {
	try {
		await registrationController.registerUser(req.body.user);
		return res.status(201).json({ 'success': true, 'msg': 'An activation email has been sent to the email provided.' });
	} catch (err) {
		return next(err);
	}
});

module.exports = router;