export { };
const router = require('express').Router();
const collegeController = require('./college.controllers');

router.get('/', collegeController.getCollegeList);

module.exports = router;