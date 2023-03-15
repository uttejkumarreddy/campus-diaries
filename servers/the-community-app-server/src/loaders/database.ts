const env: string = String(process.env.NODE_ENV);
import configs from '../config/databaseConfig.json';

const databaseConfig = (<any>configs)[env];
const { Pool } = require('pg');
const pool = new Pool(databaseConfig);

module.exports = {
  pool
};