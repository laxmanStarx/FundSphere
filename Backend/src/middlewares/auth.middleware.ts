import { Request, Response, NextFunction } from "express";

import { AppError } from "../utils/AppError";
import { HttpStatus } from "../constants/httpStatus";

import prisma from "../config/prisma";

import { verifyAccessToken } from "../utils/jwt";
import { JwtPayload } from "../interfaces/jwt-payload.interface";

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new AppError(
      "Authorization header missing",
      HttpStatus.UNAUTHORIZED
    );
  }

  if (!authHeader.startsWith("Bearer ")) {
    throw new AppError(
      "Invalid authorization format",
      HttpStatus.UNAUTHORIZED
    );
  }

  const token = authHeader.split(" ")[1];

  const decoded = verifyAccessToken(token) as JwtPayload;

  const user = await prisma.user.findUnique({
    where: {
      id: decoded.userId,
    },
  });

  if (!user) {
    throw new AppError(
      "User not found",
      HttpStatus.UNAUTHORIZED
    );
  }

  req.user = user;

  next();
};