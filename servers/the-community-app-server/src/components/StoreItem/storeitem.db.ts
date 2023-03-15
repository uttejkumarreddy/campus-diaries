export { };
const pool = require('../../loaders/database').pool;
const Logger = require('../../loaders/logger');
const constants = require('../../app_constants');
import { newItem } from './storeitem.interfaces';

const getInitialItemStatus = async () => {
  let res = await pool.query(`
    SELECT description
    FROM ${constants.SCHEMA_NAME}.${constants.CHOICE_TABLE}
    WHERE table_name = $1 AND field = $2`, ['store_item', 'status']);
  return res;
}

const getVerifiedCategories = async () => {
  let res = await pool.query(`
    SELECT ${constants.ID}, name
    FROM ${constants.SCHEMA_NAME}.${constants.STORE_ITEM_CATEGORY_TABLE}
    WHERE verified = true`);
  return res;
}

const createNewStoreItem = async (item: newItem, userID: string) => {
  let newRecordID: string | null = null;
  try {
    let res = await pool.query(
      `
        INSERT INTO ${constants.SCHEMA_NAME}.${constants.STORE_ITEM_TABLE}
        (name, description, status, price, expiration_period, owner_id, possessor_id, created_by, updated_by)
        VALUES
        ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING ${constants.ID}
      `, [item.name, item.description, item.status, item.price, item.expiration_period, userID, userID, userID, userID]);
    newRecordID = res.rows[0]._id;
  } catch (err) {
    Logger.error('ITEM: NEW: ' + JSON.stringify(err));
  }
  return newRecordID;
}

const getAllCategoriesID = async () => {
  let res = await pool.query(`
    SELECT ${constants.ID}
    FROM ${constants.SCHEMA_NAME}.${constants.STORE_ITEM_CATEGORY_TABLE}`);
  return res;
}

const insertUnverifiedCategory = async (name: string, userID: string) => {
  let newCategoryID: string | null = null;
  try {
    let res = await pool.query(
      `
      INSERT INTO ${constants.SCHEMA_NAME}.${constants.STORE_ITEM_CATEGORY_TABLE}
      (name, created_by, updated_by)
      VALUES
      ($1, $2, $3)
      RETURNING ${constants.ID}
    `, [name, userID, userID]);
    newCategoryID = res.rows[0]._id;
  } catch (err) {
    Logger.error('ITEM CATEGORY: NEW: ' + JSON.stringify(err));
  }
  return newCategoryID;
}

const insertItemHasCategory = async (itemID: string, categoryID: string, userID: string) => {
  try {
    await pool.query(
      `
      INSERT INTO ${constants.SCHEMA_NAME}.${constants.STORE_ITEM_HAS_CATEGORY_TABLE}
      (item_id, category_id, created_by, updated_by)
      VALUES
      ($1, $2, $3, $4)
    `, [itemID, categoryID, userID, userID]);
  } catch (err) {
    Logger.error('ITEM HAS CATEGORY: NEW: ' + JSON.stringify(err));
  }
}

const insertImageForItem = async (itemID: string, imageUrl: string, userID: string) => {
  try {
    await pool.query(
      `
      INSERT INTO ${constants.SCHEMA_NAME}.${constants.STORE_ITEM_ATTACHMENTS_TABLE}
      (item_id, item_url, created_by, updated_by)
      VALUES
      ($1, $2, $3, $4)
    `, [itemID, imageUrl, userID, userID]);
  } catch (err) {
    Logger.error('ITEM IMAGE: NEW: ' + JSON.stringify(err));
  }
}

const getHomePageItems = async (offset: number) => {
  let res = await pool.query(`
    SELECT item._id, item.name, item.price, item.status, attachment.item_url
    FROM ${constants.SCHEMA_NAME}.${constants.STORE_ITEM_TABLE} as item
    LEFT JOIN ${constants.SCHEMA_NAME}.${constants.STORE_ITEM_ATTACHMENTS_TABLE} as attachment
    ON attachment._id =
    (
      SELECT _id
      FROM ${constants.SCHEMA_NAME}.${constants.STORE_ITEM_ATTACHMENTS_TABLE} as attachment
      WHERE item._id = attachment.item_id
      LIMIT 1
    )
    WHERE item.status IN ('Available to Borrow', 'Available for Sale')
    AND item.restricted=FALSE
    ORDER BY posted_date
    LIMIT 20
    OFFSET $1`, [offset]);
  return res;
}

module.exports = {
  getInitialItemStatus: getInitialItemStatus,
  getVerifiedCategories: getVerifiedCategories,
  getAllCategoriesID: getAllCategoriesID,
  createNewStoreItem: createNewStoreItem,
  insertUnverifiedCategory: insertUnverifiedCategory,
  insertItemHasCategory: insertItemHasCategory,
  insertImageForItem: insertImageForItem,
  getHomePageItems: getHomePageItems,
}