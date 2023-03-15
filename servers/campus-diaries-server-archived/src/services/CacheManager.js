const client = require('../loaders/cache').client;

const collegesController = require('../controllers/college');

const refreshCollegeList = async () => {
	let collegesList = await collegesController.getColleges();
	client.set('collegesList', JSON.stringify(collegesList));
};

module.exports = {
	refreshCollegeList
}