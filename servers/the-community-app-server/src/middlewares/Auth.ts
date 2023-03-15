import { Request, Response, NextFunction } from "express";

export { };
const expressJwt = require('express-jwt');

const authorize = (roles = []) => {
  if (typeof roles === 'string') {
    roles = [roles];
  }

  return [
    // Authenticates JWT token and attaches user to request object (req.user)
    expressJwt({ secret: process.env.JWT_SECRET }),

    // Authorize based on user role
    (req: Request, res: Response, next: NextFunction) => {
      // @ts-ignore
      if (roles.length && !roles.includes(req.user.role)) {
        next('Insufficient permissions');
      }

      next();
    }
  ];
}

module.exports = authorize;