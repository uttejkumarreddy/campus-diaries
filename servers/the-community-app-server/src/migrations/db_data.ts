export {};
const dbTableQueries = require('./db_table_queries');
const seederData = require('../seeders/seed_data');
const constants = require('../app_constants');

const dbSchemaName = constants.SCHEMA_NAME;

// Maintains data about entire DB
const databaseDictionary = {
    extensions: ['pgcrypto'],
    schemaName: dbSchemaName,
    tableNames: [constants.COLLEGE_TABLE, constants.USERS_TABLE, constants.USER_REPORTS_TABLE, 'role', 'user_has_role',
        'store_item', 'store_item_category', 'store_item_has_category', 'store_item_attachments',
        'choice', 'store_user_item_cart', 'store_item_transaction', 'store_item_request', 'user_suggestions',],
    defaultColumns: "created_by uuid NOT NULL," +
        "created_at timestamp DEFAULT NOW() NOT NULL," +
        "updated_by uuid NOT NULL," +
        "updated_at timestamp DEFAULT NOW() NOT NULL," +
        "_id UUID PRIMARY KEY DEFAULT gen_random_uuid()"
}

// Maintains data about individual tables such as creation queries
const databaseTablesInfo = {
    college: {
        createQuery: dbTableQueries.createCollegeTable,
        triggers: [dbTableQueries.setUpdatedAtTrigger],
        tableCreated: false,
        seedDataAvailable: true,
        seedData: seederData.seedCollegeTableData
    },
    users: {
        createQuery: dbTableQueries.createUsersTable,
        triggers: [dbTableQueries.setUpdatedAtTrigger, dbTableQueries.setUpdatedAndCreatedByTrigger],
        tableCreated: false,
        seedDataAvailable: true,
        seedData: seederData.seedUsersTableData
    },
    user_reports: {
        createQuery: dbTableQueries.creatUsersReportsTable,
        triggers: [dbTableQueries.setUpdatedAtTrigger,
            dbTableQueries.setUpdatedAndCreatedByForUserReportsTableTrigger],
        tableCreated: false,
        seedDataAvailable: false
    },
    role: {
        createQuery: dbTableQueries.createRoleTable,
        triggers: [dbTableQueries.setUpdatedAtTrigger],
        tableCreated: false,
        seedDataAvailable: true,
        seedData: seederData.seedRoleTableData
    },
    user_has_role: {
        createQuery: dbTableQueries.createUserHasRoleTable,
        triggers: [dbTableQueries.setUpdatedAtTrigger],
        tableCreated: false,
        seedDataAvailable: true,
        seedData: seederData.seedUserHasRoleTableData
    },
    store_item: {
        createQuery: dbTableQueries.createStoreItemTable,
        triggers: [dbTableQueries.setUpdatedAtTrigger],
        tableCreated: false,
        seedDataAvailable: true,
        seedData: seederData.seedStoreItemTableData
    },
    store_item_category: {
        createQuery: dbTableQueries.createStoreItemCategoryTable,
        triggers: [dbTableQueries.setUpdatedAtTrigger],
        tableCreated: false,
        seedDataAvailable: true,
        seedData: seederData.seedStoreItemCategoryTableData
    },
    store_item_has_category: {
        createQuery: dbTableQueries.createStoreItemHasCategoryTable,
        triggers: [dbTableQueries.setUpdatedAtTrigger],
        tableCreated: false,
        seedDataAvailable: true,
        seedData: seederData.seedStoreItemHasCategoryTableData
    },
    store_item_attachments: {
        createQuery: dbTableQueries.createStoreItemAttachmentsTable,
        triggers: [dbTableQueries.setUpdatedAtTrigger],
        tableCreated: false,
        seedDataAvailable: false
    },
    choice: {
        createQuery: dbTableQueries.createChoiceTable,
        triggers: [dbTableQueries.setUpdatedAtTrigger],
        tableCreated: false,
        seedDataAvailable: true,
        seedData: seederData.seedChoiceTableData
    },
    user_suggestions: {
        createQuery: dbTableQueries.createUserSuggestionsTable,
        triggers: [dbTableQueries.setUpdatedAtTrigger],
        tableCreated: false,
        seedDataAvailable: true,
        seedData: seederData.seedUserSuggestionsTableData
    },
    store_user_item_cart: {
        createQuery: dbTableQueries.createStoreUserItemCartTable,
        triggers: [dbTableQueries.setUpdatedAtTrigger],
        tableCreated: false,
        seedDataAvailable: false
    },
    store_item_transaction: {
        createQuery: dbTableQueries.createStoreItemTransactionTable,
        triggers: [dbTableQueries.setUpdatedAtTrigger],
        tableCreated: false,
        seedDataAvailable: false
    },
    store_item_request: {
        createQuery: dbTableQueries.createStoreItemRequestTable,
        triggers: [dbTableQueries.setUpdatedAtTrigger],
        tableCreated: false,
        seedDataAvailable: false
    }
};

module.exports.databaseTablesInfo = databaseTablesInfo;
module.exports.databaseDictionary = databaseDictionary;