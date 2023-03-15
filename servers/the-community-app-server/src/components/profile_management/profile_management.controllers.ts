import {NextFunction, Request, Response} from "express";
import {reportUser, userProfileUpdate} from "./profile_management.interface";

const db = require('./profile_management.db');
const constants = require('./profile_management.constants');
const logger = require('../../loaders/logger');

const updateUserProfile = async (req: Request, res: Response, next: NextFunction) => {
    let updateUserProfileParams: userProfileUpdate = req.body.user;
    const userName = updateUserProfileParams.user_name;
    delete updateUserProfileParams.user_name;
    let updateUserProfile =
        await db.updateUserDetails(updateUserProfileParams, userName);
    if (!(updateUserProfile && updateUserProfile.rowCount)) {
        logger.error(constants.UPDATING_ERROR);
        return res.status(500).json({ success: false, message: constants.UPDATING_ERROR })
    }
    return res.status(200).json({ message: constants.PROFILE_UPDATE_SUCCESS });
};

const reportUser = async (req: Request, res: Response, next: NextFunction) => {
    const reportedUserBodyParams = req.body;
    let reportUser: reportUser = {
        reported_reason: reportedUserBodyParams.reported_reason,
        reported_by: '',
        reportee: ''
    };
    let dbResponse = await db.getUUIDFromUserName(reportedUserBodyParams.reported_by);
    if (dbResponse.rowCount === 1) {
        reportUser.reported_by = dbResponse.rows[0].userid;
    } else {
        return res.status(403)
            .json({success: false, message: constants.INVALID_REPORTED_BY_USER_NAME});
    }
    dbResponse = await db.getUUIDFromUserName(reportedUserBodyParams.reportee);
    if (dbResponse.rowCount === 1) {
        reportUser.reportee = dbResponse.rows[0].userid;
    } else {
        return res.status(403)
            .json({success: false, message: constants.INVALID_REPORTEE_USER_NAME});
    }
    dbResponse = await db.insertNewReport(reportUser);
    if (!dbResponse.inserted) {
        if (dbResponse.errorCode === '23503') {
            return res.status(403)
                .json({ success: false, message: constants.INVALID_INPUT });
        }
        logger.error(constants.REPORTING_ERROR);
        return res.status(500)
            .json({ success: false, message: constants.REPORTING_ERROR });
    }
    return res.status(200)
        .json({ success: true, message: constants.REPORTING_SUCCESS })
};

module.exports = {
    updateUserProfile: updateUserProfile,
    reportUser: reportUser,
}