const router = require("express").Router();

const middlewares = require('../../middlewares');

const Roles = require('../../../services/AuthorizationService').roles;

const collegesController = require('../../../controllers').College;

router.get("/", async (req, res, next) => {
	let collegesList;
	try {
		collegesList = await collegesController.getColleges();
		return res.status(200).json({ success: true, colleges: collegesList });
	} catch (err) {
		return next(err);
	}
});

router.post("/", middlewares.isAuth(Roles.Admin), middlewares.validateRequest(), async (req, res, next) => {
	let newCollege;
	try {
		newCollege = await collegesController.createCollege(req.body.college);
		return res.status(201).json({ success: true, college: newCollege });
	} catch (err) {
		return next(err);
	}
});

module.exports = router;