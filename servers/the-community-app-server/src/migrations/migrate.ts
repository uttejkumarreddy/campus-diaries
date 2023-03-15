export {};
require('../config');
const pool = require('../loaders/database').pool;
const tableQueries = require('./db_data');
const databaseUtility = require('../utils/db_utils');
const logger = require('../loaders/logger');
const constants = require('../app_constants');

let client: any;
const schemaName = tableQueries.databaseDictionary.schemaName;
const databaseTables = tableQueries.databaseDictionary.tableNames;

// Main function, initialize the database connection and returns the Client
async function main() {
    client = await pool.connect();
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
main().then(async res => {
    logger.info('Connected to ' + process.env.NODE_ENV + ' database: ' + res.rows[0].now);
    const commandLineArgs = process.argv;
    if (commandLineArgs) {
        const cleanMigrate: boolean = commandLineArgs.findIndex(itr => itr.includes('clean')) > -1;
        if (commandLineArgs.includes('up')) {
            await up(cleanMigrate);
        } else if (commandLineArgs.includes('down')) {
            await down();
        } else if (cleanMigrate) {
           await clean();
        }
    }
    client.end();
    if (commandLineArgs.includes('seed')) {
        require('../seeders/seeder');
    }
});

// Function to be able to clean and create tables
async function up(cleanMigrate: boolean) {
    try {
        if (cleanMigrate) {
            await clean();
        }
        await createExtensions();
        await createSchemaTables();
        await alterTablesToAddDefaultColumns();
    } catch (error) {
        logger.error('Failed UP Migration: ' + error);
        client.end();
    }
}

// Function to create specified extension if not exists
async function createExtensions() {
    const extensions = tableQueries.databaseDictionary.extensions;
    for (const extensionName of extensions) {
        const extensionQuery = `CREATE EXTENSION IF NOT EXISTS ${extensionName}`;
        const createExtensionRes = await databaseUtility.create(client, extensionQuery);
        if (createExtensionRes) {
            logger.info('Created Extension - ' + extensionName);
        }
    }
}

// Function to create schema and tables if not exists
async function createSchemaTables() {

    const schemaCreationQuery = `CREATE SCHEMA IF NOT EXISTS ${schemaName}`;
    const schemaCreateRes = await databaseUtility.create(client, schemaCreationQuery)
    if (schemaCreateRes) {
        logger.info('Created Schema - ' + schemaName);
    }

    for (const tableName of databaseTables) {
        const tableCreateQuery = tableQueries.databaseTablesInfo[tableName].createQuery;
        const tableDefaultColumns = tableName !== constants.COLLEGE_TABLE? tableQueries.databaseDictionary.defaultColumns: '';
        const schemaTableName = schemaName + "." + tableName;
        if (!tableQueries.databaseTablesInfo[tableName].tableCreated) {
            const createQuery = `CREATE TABLE IF NOT EXISTS ${schemaTableName} (
                             ${tableCreateQuery}
                             ${tableDefaultColumns} )`;
            const triggersArray = tableQueries.databaseTablesInfo[tableName].triggers;
            const tableCreateRes = await databaseUtility.create(client, createQuery);
            if (tableCreateRes) {
                tableQueries.databaseTablesInfo[tableName].tableCreated = true;
                logger.info('Created Table - ' + tableName);
                await createTriggers(triggersArray, tableName, schemaTableName);
            }
        }
    }
}

async function createTriggers(triggersArray?: string[], ...args: string[]) {
    if (triggersArray?.length) {
        for (const trigger of triggersArray) {
            const formattedTrigger = trigger.replace(/{(\d+)}/g, function(match, number) {
                return typeof args[number] != 'undefined'
                    ? args[number]
                    : match
                    ;
            });
            try {
                const triggerRes = await databaseUtility.create(client, formattedTrigger);
                if (triggerRes) {
                    logger.info('Created Trigger- ' + formattedTrigger);
                }
            } catch (error) {
                logger.error('Failed to Create Trigger - ' + formattedTrigger + '\n' + error);
            }
        }
    }
}

// Function to alter and add the references for default columns across all the Tables
async function alterTablesToAddDefaultColumns() {
    for (const tableName of databaseTables) {
        if (tableName !== constants.COLLEGE_TABLE) {
            const schemaTableName = schemaName + "." + tableName;
            const alterUpdatedByQuery = `ALTER TABLE ${schemaTableName} ADD FOREIGN KEY (updated_by) REFERENCES ${schemaName}.users(_id)`;
            const alterUpdatedByRes = await databaseUtility.alter(client, alterUpdatedByQuery);
            if (alterUpdatedByRes) {
                logger.info('Altered Table: ' + tableName + ', column \'updated_by\' to refer Users Table');
            }

            const alterCreatedByQuery = `ALTER TABLE ${schemaTableName} ADD FOREIGN KEY (created_by) REFERENCES ${schemaName}.users(_id)`;
            const alterCreatedByRes = await databaseUtility.alter(client, alterCreatedByQuery);
            if (alterCreatedByRes) {
                logger.info('Altered Table: ' + tableName + ', column \'created_by\' to refer Users Table');
            }
        }
    }
}

function down() {
    try {
    } catch (error) {
        logger.error('Failed Down Migration: ' + error);
        client.end();
    }
}

// Function to clean the existing database schema
async function clean() {
    try {
        const dropSchemaQuery = `DROP SCHEMA IF EXISTS ${schemaName} CASCADE`;
        const dropSchemaRes = await databaseUtility.drop(client, dropSchemaQuery);
        if (dropSchemaRes) {
            logger.info('Cleaned Schema- ' + tableQueries.databaseDictionary.schemaName);
        }
    } catch(error) {
        logger.error('Failed Clean Migration: ' + error);
        client.end();
    }
}