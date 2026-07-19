import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";
import { HttpStatus } from "../constants/httpStatus";

export const errorMiddleware = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
): void => {

    if (err instanceof AppError) {
        res.status(err.statusCode).json({
            success: false,
            message: err.message,
        });
        return;
    }

    console.error(err);

    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Internal Server Error",
    });
};