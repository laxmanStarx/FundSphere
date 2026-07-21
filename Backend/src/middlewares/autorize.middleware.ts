import { Request, Response, NextFunction } from "express";
import { Role } from "@prisma/client";

import { AppError } from "../utils/AppError";
import { HttpStatus } from "../constants/httpStatus";

export const authorize =
  (...roles: Role[]) =>
  (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {

    if (!req.user) {
      throw new AppError(
        "Unauthorized",
        HttpStatus.UNAUTHORIZED
      );
    }

    if (!roles.includes(req.user.role)) {
      throw new AppError(
        "Forbidden",
        HttpStatus.FORBIDDEN
      );
    }

    next();
  };