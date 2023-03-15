const router = require('express').Router();

const middlewares = require('../../middlewares');
const loginController = require('../../../controllers').Login;

router.post('/', middlewares.validateRequest(), async (req, res, next) => {
	try {
		let payload = await loginController.loginUser(req.body.user);

		if (!payload.token)
			return res.status(200).json({ 'success': false, 'msg': payload.msg });

		return res.status(200).json({ 'success': true, 'token': payload.token });
	} catch (err) {
		return next(err);
	}
});

module.exports = router;