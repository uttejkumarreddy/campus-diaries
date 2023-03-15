var testStudentData = 
    {
        college: 'your_college_name',
        email: 'your_email', // Make sure this is a legit email under your control
        name: 'your_name',
        password: 'your_password',
        rollnumber: 'your_rollnumber', // This should be in the college format
        username: 'your_username'
    }

var testResendEmail = {
    email: 'your_email'
}

var testStudentLogin = {
    email: 'your_email',
    password: 'your_password'
}

var testStudentInvalidEmail = {
    email: 'wrong_email',
    password: 'correct_password'
}

var testStudentInvalidPassword = {
    email: 'correct_email',
    password: 'wrong_password'
}

var testStudentInvalidLoginCreds = {
    email: 'wrong_email',
    password: 'wrong_password'
}

module.exports = {
    testStudentData: testStudentData,
    testResendEmail: testResendEmail,
    testStudentLogin: testStudentLogin,
    testStudentInvalidEmail: testStudentInvalidEmail,
    testStudentInvalidPassword: testStudentInvalidPassword,
    testStudentInvalidLoginCreds: testStudentInvalidLoginCreds
}