const router = require('express').Router();

const userController = require('../../../controllers').User;

router.get('/', async (req, res, next) => {
	try {
		let alreadyExists;
		let msg = '';

		if (req.query.roll_number && req.query.college) {
			alreadyExists = await userController.userInACollegeHas('roll_number', req.query.roll_number, req.query.college);
			if (alreadyExists)
				msg = 'A user is registered with the provided roll number. If you are the rightful owner, please contact the admin.'; 
		} else if (req.query.email) {
			alreadyExists = await userController.userExistsWith('email', req.query.email);
			if (alreadyExists)
				msg = 'A user is registered with the provided email. If you are the rightful owner, please contact the admin.';
		} else if (req.query.user_name && req.query.college) {
			alreadyExists = await userController.userInACollegeHas('user_name', req.query.user_name, req.query.college);
			if (alreadyExists)
				msg = 'Another user exists in your college with the same username.' + 
					'In order to be identified uniquely, please provide any details you may have missed in your names.' 
		} else {
			throw 'Bad Request';
		}

		return res.status(200).json({ success: true, isUnique: !alreadyExists, msg: msg });
	} catch (err) {
		return next(err);
	}
});

module.exports = router;