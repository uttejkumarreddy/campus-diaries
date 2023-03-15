export { };
const db = require('./user.db');
import { Request, Response, NextFunction } from "express";

const isRollnumberRegisteredInCollege = async (req: Request, res: Response, next: NextFunction) => {
  let isRollnumberRegisteredInCollege = await db.isRollnumberRegisteredInCollege(req.params.college, req.params.rollnumber);
  return res.status(200).json({ success: true, data: { isRollnumberAvailable: !isRollnumberRegisteredInCollege } });
}

module.exports = {
  isRollnumberRegisteredInCollege: isRollnumberRegisteredInCollege,
}