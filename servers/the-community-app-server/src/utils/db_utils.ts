export {};
const logger = require('../loaders/logger')

const create = async (client: any, createQuery: string) => {
    try {
        const result = await client.query(createQuery);
        return result;
    } catch (error) {
        logger.error('Failed to CREATE: ' + createQuery + '\n' + error);
    }
};

const drop = async (client: any, dropQuery: string) => {
    try {
        const result = await client.query(dropQuery);
        return result;
    } catch (error) {
        logger.error('Failed to DROP: ' + dropQuery + '\n' + error);
    }
};

const alter = async (client: any, alterQuery: string) => {
    try {
        const result = await client.query(alterQuery);
        return result;
    } catch (error) {
        logger.error('Failed to ALTER: ' + alterQuery + '\n' + error);
    }
};

const insertIntoTable = async (client: any, insertIntoQuery: string, values: any[]) => {
    try {
        const result = await client.query(insertIntoQuery, values);
        return result;
    } catch (error) {
        logger.error('Failed to INSERT: ' + insertIntoQuery + '\n' + error);
    }
};

const deleteFrom = async (client: any, deleteFromQuery: string) => {
    try {
        const result = await client.query(deleteFromQuery);
        return result;
    } catch (error) {
        logger.error('Failed to DELETE: ' + deleteFromQuery + '\n' + error);
    }
};

const truncateTable = async (client: any, tableName: string, schemaName: string) => {
    try {
        const truncateTableQuery = 'TRUNCATE TABLE ' + schemaName + "." + tableName + ' CASCADE;'
        const result = await client.query(truncateTableQuery);
        return result;
    } catch (error) {
        logger.error('Failed to TRUNCATE Table: ' + tableName + '\n' + error);
    }
};

const checkIfExists = async (client: any, tableName: string, schemaName: string) => {
    try {
        const truncateTableQuery = 'Select * from ' + schemaName + "." + tableName+ ';'
        const result = await client.query(truncateTableQuery);
        return result;
    } catch (error) {
        logger.error('Failed to Execute/Fetch details of : ' + tableName + '\n' + error);
    }
};

module.exports = {
    create,
    drop,
    alter,
    insertIntoTable,
    deleteFrom,
    truncateTable,
    checkIfExists
};