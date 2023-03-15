const environmentToSeed = process.argv[2];

require('dotenv').config();
const dbconfig = require('../configurations/database.json')[environmentToSeed];
const { Pool } = require('pg');
const pool = new Pool(dbconfig);

const isEnvironmentDevelopmentOrTest = () => {
  if (environmentToSeed !== 'development' && environmentToSeed !== 'test') {
    return false;
  }
  return true;
};

const constructColumnsPart = (columns) => {
  let query = '(';
  for (let column of columns) {
    query += column + ',';
  }
  query = query.substring(0, query.length - 1);
  query += ')';

  return query;
}

const constructSingleValuePart = (row, columns) => {
  let query = '(';
  for (let column of columns) {
    query += "'" + row[column] + "',";
  }
  query = query.substring(0, query.length - 1);
  query += ')';

  return query;
}

const constructMultiInsertQuery = (schema, table, columns, rows) => {
  let query = 'INSERT INTO ' + schema + '.' + table + ' ';

  query += constructColumnsPart(columns);
  query += ' VALUES ';

  let data;
  for (let row of rows) {
    data = constructSingleValuePart(row, columns);
    query += data + ',';
  }

  query = query.substring(0, query.length - 1);
  query += ';';

  return query;
}

const truncate = async (table) => {
  await pool.query('TRUNCATE ' + table + ' CASCADE;');
}

const seedTable = async (table, deleteAllRows = false) => {
  const filePath = './' + table;
  const schema = require(filePath)['SCHEMA'];
  const rows = require(filePath)[table];

  if (deleteAllRows) {
    await truncate(table);
  }

  const multiInsertQuery = constructMultiInsertQuery('public', table, schema, rows);
  const result = await pool.query(multiInsertQuery);

  const numberOfRowsToBeInserted = rows.length;
  const numberOfRowsInserted = result.rowCount;

  if (numberOfRowsInserted !== numberOfRowsToBeInserted) {
    console.warn('WARN: Number of rows inserted for ' + table
      + ' is ' + numberOfRowsInserted + ' but should have been ' + numberOfRowsToBeInserted);
    return;
  }

  console.log('SUCCESSFUL: ' + numberOfRowsInserted + ' rows inserted in ' + table);
}

const cleanSeed = (async () => {
  if (!isEnvironmentDevelopmentOrTest()) {
    console.log('Invalid environment. clean-seed can be run only against development or test environment.');
    console.log('Enter either "npm run clean-seed -- development" (or) "npm run clean-seed -- test"');
    return;
  }

  try {
    await seedTable('COLLEGE', true);
    await seedTable('USERS', true);
  } catch (err) {
    console.log('clean-seed failed due to following errors.');
    console.log(err);
    process.exit(0);
  }
})();