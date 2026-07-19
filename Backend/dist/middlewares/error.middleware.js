"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = void 0;
const AppError_1 = require("../utils/AppError");
const httpStatus_1 = require("../constants/httpStatus");
const errorMiddleware = (err, req, res, next) => {
    if (err instanceof AppError_1.AppError) {
        res.status(err.statusCode).json({
            success: false,
            message: err.message,
        });
        return;
    }
    console.error(err);
    res.status(httpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Internal Server Error",
    });
};
exports.errorMiddleware = errorMiddleware;
