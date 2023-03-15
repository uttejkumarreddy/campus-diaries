export { };
import { dbCategoryID, categoryStatus } from './storeitem.interfaces';

const extractCategoryIDs = (dbCategoriesID: dbCategoryID[]) => {
  var categoriesID: string[] = [];
  for (let i = 0; i < dbCategoriesID.length; i++) {
    categoriesID.push(dbCategoriesID[i]._id);
  }
  return categoriesID;
}

const getCategoriesStatus = (availableCategories: string[], itemCategories: string[]) => {
  var response: categoryStatus = { matchedCategories: [], unmatchedCategories: [] };
  for (var i = 0; i < itemCategories.length; i++) {
    if (!availableCategories.includes(itemCategories[i])) {
      response.unmatchedCategories.push(itemCategories[i])
    } else {
      response.matchedCategories.push(itemCategories[i]);
    }
  }
  return response;
}

module.exports = {
  extractCategoryIDs: extractCategoryIDs,
  getCategoriesStatus: getCategoriesStatus,
}