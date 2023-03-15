export interface newItem {
  name: string;
  description?: string;
  status: string;
  price?: number;
  expiration_period: string;
  categories?: string[];
  image?: string;
}

export interface dbCategoryID {
  _id: string;
}

export interface categoryStatus {
  matchedCategories: string[];
  unmatchedCategories: string[];
}