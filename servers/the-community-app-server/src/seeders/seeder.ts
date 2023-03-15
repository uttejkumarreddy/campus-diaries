export {};
require('../config');
const dbPool = require('../loaders/database').pool;
const logger = require('../loaders/logger');
const dbTableData = require('../migrations/db_data');
const databaseUtil = require('../utils/db_utils');

let client: any;
const schemaName = dbTableData.databaseDictionary.schemaName;
const databaseTables = dbTableData.databaseDictionary.tableNames;

// Main function, initialize the database connection and returns the Client
async function seed() {
    client = await dbPool.connect();
    client.on('end', () => {
        logger.info('Connection terminated:  ' + process.env.NODE_ENV + ' database');
    });
    const res = await client.query('SELECT NOW()');
    if (res.rowCount != 1) {
        logger.error('Failed to connect to database.');
        process.exit(1);
        client.end();
    }
    return res;
}

// Reading command line arguments and calling functions accordingly
seed().then(async res => {
    logger.info('Connected to ' + process.env.NODE_ENV + ' database: ' + res.rows[0].now);
    await seedData();
    client.end();
});

// Function to seed tables for which data is as of now hard-coded
async function seedData() {
    for (const tableName of databaseTables) {
        const schemaTableName = schemaName + "." + tableName;
        const tableData = dbTableData.databaseTablesInfo[tableName];
        const tableExists = dbTableData.databaseTablesInfo[tableName].tableCreated ||
                            await databaseUtil.checkIfExists(client, tableName, schemaName);
        if (tableExists) {
            if (tableData.seedDataAvailable) {
                try {
                    for (const seedRecord of tableData.seedData) {
                        const columnNames = Object.keys(seedRecord).join();
                        const insertRecordData = Object.values(seedRecord);
                        const paramValues: string[] = [];
                        insertRecordData.forEach((column: any, index: any) => paramValues.push('$' + (index + 1)));
                        const insertQuery = `INSERT INTO ${schemaTableName} (${columnNames}) 
                                    VALUES (${paramValues.toString()}) RETURNING _id`;
                        const insertIntoTable = await databaseUtil.insertIntoTable(client, insertQuery, insertRecordData);
                        if (insertIntoTable) {
                            logger.info('Inserted into Table - ' + tableName + ', Values - ' + insertRecordData);
                        }
                    }
                } catch (error) {
                    logger.error('Failed Seeding data for ' + schemaTableName + ' - ' + error);
                }
            }
        }
    }
}