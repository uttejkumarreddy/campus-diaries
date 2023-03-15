const environmentToRunCleanMigrateOn = process.argv[2];

require('dotenv').config();
const dbconfig = require('../configurations/database.json')[environmentToRunCleanMigrateOn];
const { Pool } = require('pg');
const pool = new Pool(dbconfig);

const isEnvironmentDevelopmentOrTest = () => {
  if (environmentToRunCleanMigrateOn !== 'development' && environmentToRunCleanMigrateOn !== 'test') {
    return false;
  }
  return true;
};

const dropAndReconfigureDatabase = async (dbconfig) => {
  const tasksToRunInOrder = {
    DROP_SCHEMAS: [
      'DROP SCHEMA IF EXISTS public CASCADE;',
    ],
    RECREATE_SCHEMAS: [
      'CREATE SCHEMA public;',
    ],
    GRANT_USER_PERMISSIONS: [
      'GRANT ALL ON SCHEMA public TO ' + dbconfig.user + ';',
    ],
    CONFIGURE_USER_CREDENTIALS: [
      'ALTER USER ' + dbconfig.user + ' WITH PASSWORD \'' + dbconfig.password + '\';',
    ],
  };

  for (let task of Object.keys(tasksToRunInOrder)) {
    for (let taskScript of tasksToRunInOrder[task]) {
      await pool.query(taskScript);
      console.log('SUCCESSFUL: ' + task);
    }
  }
};

const applyScripts = async (file) => {
  const filePath = './' + file;
  const queries = require(filePath);
  let task;
  let taskScript;
  for (let queryObj of Object.entries(queries)) {
    task = queryObj[0];
    taskScript = queryObj[1];
    await pool.query(taskScript);
    console.log('SUCCESSFUL: ' + task);
  }
};

const cleanMigrate = (async () => {
  if (!isEnvironmentDevelopmentOrTest()) {
    console.log('Invalid environment. clean-migrate can be run only against development or test environment.');
    console.log('Enter either "npm run clean-migrate -- development" (or) "npm run clean-migrate -- test"');
    return;
  }

  try {
    await dropAndReconfigureDatabase(dbconfig);
    await applyScripts('Extensions');
    await applyScripts('Tables');
    await applyScripts('TableReferences');
    await applyScripts('TriggerFunctions');
    await applyScripts('Triggers');
  } catch (err) {
    console.log('clean-migrate failed due to following errors.');
    console.log(err);
    process.exit(0);
  }
})();

