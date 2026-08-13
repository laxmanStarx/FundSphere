import { Request, Response, NextFunction } from "express";
import { Role } from "@prisma/client";
import { AppError } from "../utils/AppError";
import { HttpStatus } from "../constants/httpStatus";

export const authorize = (...allowedRoles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AppError(
        "Authentication required",
        HttpStatus.UNAUTHORIZED
      );
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw new AppError(
        "You are not authorized to perform this action",
        HttpStatus.FORBIDDEN
      );
    }

    next();
  };
};