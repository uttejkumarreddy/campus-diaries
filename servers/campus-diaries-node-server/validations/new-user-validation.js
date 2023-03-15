validateRollnumber = (rollnumber) => {
    // TODO: change rollnumber validation based on college
    if (rollnumber.length != 12) return false;
    if (parseInt(rollnumber) == NaN) return false;
    let collegeId = parseInt(rollnumber.substr(0, 4));
    let academicYear = parseInt(rollnumber.substr(4, 2));
    let branchId = parseInt(rollnumber.substr(6, 3));
    let id = parseInt(rollnumber.substr(9, 3));
    if (collegeId !== 1602) return false;
    let currentYear = parseInt(new Date().getFullYear().toString().substr(2,2));
    if (academicYear < currentYear - 4 || academicYear > currentYear) return false;
    let branches = [731, 732, 733, 734, 735, 736, 737];
    if (branches.indexOf(branchId) == -1) return false;
    if (id < 1 || id > 120) {
      if ( id < 301 || id > 324) return false;
    }
    return true;
}

validateCollege = (college) => {
    if(college !== 'Vasavi College of Engineering') return false;
    return true;
}

validateName = (name) => {
    if(name.length < 3) return false;
    let re = /^\w+( \w+)+$/;
    if(!re.test(name)) {
        return false;
    }
    return true;
}

validatePassword = (password) => {
    if (
        /[A-Z]/.test(password) &&
        /[a-z]/.test(password) &&
        /[0-9]/.test(password)
    ) return true;
    return false;
}

validateNewUser = (name, password, college, rollnumber) => {
    if(!validateName(name)) {
        return 'Invalid username.';
    }
    if(!validatePassword(password)) {
        return 'Password must be at least 8 characters in length and must ' + 
               'contain at least one lowercase, one uppercase and one number.'
    }
    if(!validateCollege(college)) {
        return 'No such college exists.';
    }
    if(!validateRollnumber(rollnumber)) {
        return 'Invalid rollnumber.';
    }
}

module.exports = {
    validateNewUser: validateNewUser,
    validatePassword: validatePassword
}