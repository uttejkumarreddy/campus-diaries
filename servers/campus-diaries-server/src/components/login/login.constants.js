const EMAIL = process.env.EMAIL_ADDRESS;

const INVALID_CREDENTIALS =
  'Invalid Credentials';

const ACCOUNT_LOCKED_OUT =
  'Your account has been locked out.'
  + ' Please try again after some time.';

const ACCOUNT_DEACTIVATED =
  'Your account has been deactivated.'
  + ' If you wish to activate it again,'
  + ' drop a mail to ' + EMAIL
  + ' with the subject "Activate existing account"'
  + ' and we will get back to you within 24 hours.';

const PASSWORD_RESET_LINK =
  'A password reset link will be sent shortly if the email is registered with us.';

const INVALID_PASSWORD_RESET_LINK =
  'This link is no longer valid. Please request for a new password reset link.';

const INVALID_NEW_PASSWORD_SUBMISSION =
  'Failure. Please confirm that both the passwords match and that the length is between 8 and 15 characters.';

const SUCCESSFUL_PASSWORD_CHANGE =
  'Your password has been reset successfully.';

const PASSWORD_CHANGE_FAILED =
  'There was an internal error while changing your password. We have been notified. Please try again in some time.'

module.exports = {
  INVALID_CREDENTIALS: INVALID_CREDENTIALS,
  ACCOUNT_LOCKED_OUT: ACCOUNT_LOCKED_OUT,
  ACCOUNT_DEACTIVATED: ACCOUNT_DEACTIVATED,
  PASSWORD_RESET_LINK: PASSWORD_RESET_LINK,
  INVALID_PASSWORD_RESET_LINK: INVALID_PASSWORD_RESET_LINK,
  INVALID_NEW_PASSWORD_SUBMISSION: INVALID_NEW_PASSWORD_SUBMISSION,
  SUCCESSFUL_PASSWORD_CHANGE: SUCCESSFUL_PASSWORD_CHANGE,
  PASSWORD_CHANGE_FAILED: PASSWORD_CHANGE_FAILED,
}