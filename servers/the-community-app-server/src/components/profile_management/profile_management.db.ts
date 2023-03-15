import {reportUser, userProfileUpdate} from "./profile_management.interface";

const pool = require('../../loaders/database').pool;
const logger = require('../../loaders/logger');
const constants = require('../../app_constants');

const insertNewReport = async (report: reportUser) => {
    let response: {
        inserted: boolean | null,
        errorCode: string | null,
        constraint: string | null
    } = {inserted: null, errorCode: null, constraint: null};
    try {
        await pool.query(
            `INSERT INTO ${constants.SCHEMA_NAME}.${constants.USER_REPORTS_TABLE}
            (reported_by, reported_reason, reportee)
            VALUES 
            ($1, $2, $3)`,
            [report.reported_by, report.reported_reason, report.reportee]
        );
        response.inserted = true;
        logger.info(`REPORT USER: SUCCESS: Account with user name ${report.reportee} has been reported.`);
    } catch (err) {
        response.inserted = false;
        if (err.code === '23503') { // Foreign key violation
            response.errorCode = '23503';
            response.constraint = err.constraint;
        } else { // Catch all
            logger.error('REPORT USER: ERROR: ' + JSON.stringify(err));
        }
    }
    return response;
};

const updateUserDetails = async (userDetails: userProfileUpdate, userName: string) => {
    try {
        // Preparing update query from the dynamic object
        const columnNames = Object.keys(userDetails);
        const updateRecordDataArray = Object.values(userDetails);
        const paramValues: string[] = [];

        updateRecordDataArray.forEach((column: any, index: any) => paramValues.push(
            columnNames[index] + '=$' + (index + 1))); // Preparing set statement

        const updateValues = paramValues.toString();
        const userNameIndex = columnNames.length + 1;
        updateRecordDataArray.push(userName);

        const updateQuery = `UPDATE ${constants.SCHEMA_NAME}.${constants.USERS_TABLE}
            SET ${updateValues}
            WHERE user_name = $${userNameIndex}`;
        return await pool.query(updateQuery, updateRecordDataArray);
    } catch (error) {
        logger.error("Update Profile: Error: " + JSON.stringify(error));
    }
};

const getUUIDFromUserName = async (userName: string) => {
    return await pool.query(`SELECT ${constants.ID} AS userid 
    fROM ${constants.SCHEMA_NAME}.${constants.USERS_TABLE}
    WHERE user_name = $1 LIMIT 1`, [userName]);
};

module.exports = {
    insertNewReport: insertNewReport,
    getUUIDFromUserName: getUUIDFromUserName,
    updateUserDetails: updateUserDetails
}