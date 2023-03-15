const expect = require('expect');
const seedColleges = require('../../../seeders/college').college;

const { TEST_POOL, BASE_URL, API, AXIOS } = require('../../init');

describe('User registration', () => {
	it('should return list of colleges with identifier', async () => {
		let resp = await AXIOS.get(BASE_URL + API.getCollege);
		let colleges = resp.data.colleges;

		expect(colleges).toBeTruthy();
		expect(colleges.length).toBe(seedColleges.length);

		for (let i = 0; i < colleges.length; i++) {
			expect(colleges[i].name).toBe(seedColleges[i].name);
			expect(colleges[i].onboard_number).toBe(seedColleges[i].customer);
		}
	});

	it('should check if entered email exists', async () => {
		let resp = await AXIOS.get(BASE_URL + API.getUser + '?email=uttejkumarreddy@gmail.com');
		expect(resp.data.success).toBeTruthy();
		expect(resp.data.isUnique).toBeTruthy();

		resp = await AXIOS.get(BASE_URL + API.getUser + '?email=uttej60@gmail.com');
		expect(resp.data.success).toBeTruthy();
		expect(resp.data.isUnique).toBeFalsy();
	});

	it('should check if rollnumber exists', async () => {
		let resp = await AXIOS.get(BASE_URL + API.getUser + '?roll_number=1602-15-733-113&college=1');
		expect(resp.data.success).toBeTruthy();
		expect(resp.data.isUnique).toBeTruthy();

		resp = await AXIOS.get(BASE_URL + API.getUser + '?roll_number=1602-15-733-114&college=1');
		expect(resp.data.success).toBeTruthy();
		expect(resp.data.isUnique).toBeFalsy();
	});

	it('should check if username is unique', async () => {
		let resp = await AXIOS.get(BASE_URL + API.getUser + '?user_name=uttejkumar.reddy&college=1');
		expect(resp.data.success).toBeTruthy();
		expect(resp.data.isUnique).toBeTruthy();

		resp = await AXIOS.get(BASE_URL + API.getUser + '?user_name=uttej.kumar&college=1');
		expect(resp.data.success).toBeTruthy();
		expect(resp.data.isUnique).toBeFalsy();
	});

	it('should register a student', async () => {
		let postConfig = {
			method: 'post',
			url: BASE_URL + API.register,
			data: {
				user: {
					college: 1,
					roll_number: '1602-15-733-113',
					email: 'uttejkumarreddy@gmail.com',
					first_name: 'uttejkumar',
					last_name: 'reddy',
					user_name: 'uttejkumar.reddy',
					password: 'aGVsbG93b3JsZA=='
				}
			}
		};

		let resp = await AXIOS.request(postConfig);
		expect(resp.status).toBe(201);
		expect(resp.data.success).toBeTruthy();
		expect(resp.data.msg).toBe('An activation email has been sent to the email provided.');
	});
});