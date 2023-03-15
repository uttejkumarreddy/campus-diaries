import { Request, Response, NextFunction } from "express";
import { newItem, dbCategoryID, categoryStatus } from './storeitem.interfaces';

export { };
const db = require('./storeitem.db');
const Constants = require('./storeitem.constants');
const Services = require('./storeitem.services');
const SignedUrl = require('../../services/SignedUrl');

const getInitialItemStatus = async (req: Request, res: Response, next: NextFunction) => {
  let initialItemStatus = await db.getInitialItemStatus();
  return res.status(200).json({ success: true, data: initialItemStatus.rows });
}

const getItemCategories = async (req: Request, res: Response, next: NextFunction) => {
  let itemCategories = await db.getVerifiedCategories();
  return res.status(200).json({ success: true, data: itemCategories.rows });
}

const createItem = async (req: Request, res: Response, next: NextFunction) => {
  // @ts-ignore
  const userID: string = req.user._id;
  const item: newItem = req.body.item;
  let newItemID: string | null = await db.createNewStoreItem(item, userID);
  if (!newItemID) { return res.status(500).json({ success: false, message: Constants.STORE_ITEM_CREATION_FAILED }); }

  res.status(201).json({ success: true, message: Constants.STORE_ITEM_CREATION_PASSED });
  // Further processing
  // Categories processing
  if (item.categories && item.categories.length > 0) {
    // Get all categories available in DB
    var categoriesIDInDB: dbCategoryID[] = (await db.getAllCategoriesID()).rows;
    var categoriesID: string[] = Services.extractCategoryIDs(categoriesIDInDB);
    // Validate categories
    var categoryStatus: categoryStatus = Services.getCategoriesStatus(categoriesID, item.categories);
    let itemHasCategories: string[] = categoryStatus.matchedCategories;
    // Associate item with all the categories relevant to it
    for (let i = 0; i < itemHasCategories.length; i++) {
      db.insertItemHasCategory(newItemID, itemHasCategories[i], userID);
    }
  }
  // Image processing
  if (item.image) {
    if (SignedUrl.isValidUrl(item.image)) {
      db.insertImageForItem(newItemID, item.image, userID, userID);
    }
  }
}

const getHomePageItems = async (req: Request, res: Response, next: NextFunction) => {
  let items = await db.getHomePageItems(0);
  return res.status(200).json({ success: true, data: items.rows });
}

module.exports = {
  getInitialItemStatus: getInitialItemStatus,
  getItemCategories: getItemCategories,
  createItem: createItem,
  getHomePageItems: getHomePageItems,
}