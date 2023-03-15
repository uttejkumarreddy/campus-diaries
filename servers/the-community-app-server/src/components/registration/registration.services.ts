export {};

const Logger = require('../../loaders/logger');
const {setActivationLink} = require('./registration.db');
const emailUtils = require('../../utils/email_utils');

const generateUsername = ({first_name, last_name}: { first_name: string, last_name: string }) => {
    return (first_name.toLowerCase().replace(' ', '') + '.' + last_name.toLowerCase().replace(' ', '')).substring(0, 20);
};

const sendActivationLink = async ({email, user_name}: { email: string, user_name: string }) => {
    let activationLink = emailUtils.generateActivationLink();
    await setActivationLink(email, activationLink);

    let transporter = emailUtils.sendActivationLink({email, user_name, activationLink});
    transporter
        .then((res: any) => {
            Logger.info('ACTIVATION LINK: SUCCESS: Message ID: ' + res.messageId + ' EMAIL: ' + email);
        })
        .catch((err: Error) => {
            // TODO: Alert dev
            Logger.error('ACTIVATION LINK: FAILURE: ' + JSON.stringify(err) + ' EMAIL: ' + email);
        })
}

module.exports = {
    sendActivationLink: sendActivationLink,
    generateUsername: generateUsername,
}