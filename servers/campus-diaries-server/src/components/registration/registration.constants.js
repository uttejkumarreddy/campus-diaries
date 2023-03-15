const EMAIL = process.env.EMAIL_ADDRESS;

const USER_WITH_ROLL_NUMBER_IN_COLLEGE_EXISTS =
  'A user is already registered with this roll number.'
  + ' If this roll number belongs to you,'
  + ' drop an email to ' + EMAIL
  + ' with the subject "Registration Issue: Roll number already taken"'
  + ' and with your roll number and verification document'
  + ' (College ID, Marks memo, anything which ties you to the roll number)'
  + ' and we will get back to you within 24 hours.';

const USER_WITH_EMAIL_EXISTS =
  'A user is already registered with this email.'
  + ' If this email belongs to you,'
  + ' drop an email to ' + EMAIL
  + ' via your email with the subject "Registration Issue: Email already taken"'
  + ' and we will get back to you within 24 hours.';

const REGISTRATION_ERROR =
  'A problem occured while creating your account.'
  + ' We have been notified and are working on fixing this.'
  + ' Please try again in some time.';

const REGISTRATION_SUCCESS =
  'We have successfully registered your account. An activation link has been sent to your email.';

const SEND_ACTIVATION_LINK =
  'An activation link will be sent shortly if the provided email is registered with us.';

const ACTIVATION_SUCCESS =
  'Thanks for verifying your email. Your account has been successfully activated.';

const INVALID_INPUT =
  'Inputs did not meet the required standards.';

const INVALID_ACTIVATION_INPUTS =
  'Invalid link or this activation link might have expired.';

module.exports = {
  USER_WITH_ROLL_NUMBER_IN_COLLEGE_EXISTS: USER_WITH_ROLL_NUMBER_IN_COLLEGE_EXISTS,
  USER_WITH_EMAIL_EXISTS: USER_WITH_EMAIL_EXISTS,
  REGISTRATION_SUCCESS: REGISTRATION_SUCCESS,
  REGISTRATION_ERROR: REGISTRATION_ERROR,
  SEND_ACTIVATION_LINK: SEND_ACTIVATION_LINK,
  ACTIVATION_SUCCESS: ACTIVATION_SUCCESS,
  INVALID_INPUT: INVALID_INPUT,
  INVALID_ACTIVATION_INPUTS: INVALID_ACTIVATION_INPUTS,
}