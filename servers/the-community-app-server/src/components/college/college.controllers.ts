import { Request, Response, NextFunction } from "express";

export { };
const db = require('./college.db');

const getCollegeList = async (req: Request, res: Response, next: NextFunction) => {
  let colleges = await db.getCollegeList();
  return res.status(200).json({ success: true, data: colleges.rows });
}

module.exports = {
  getCollegeList: getCollegeList,
}