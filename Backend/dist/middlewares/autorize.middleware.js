"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = void 0;
const AppError_1 = require("../utils/AppError");
const httpStatus_1 = require("../constants/httpStatus");
const authorize = (...roles) => (req, res, next) => {
    if (!req.user) {
        throw new AppError_1.AppError("Unauthorized", httpStatus_1.HttpStatus.UNAUTHORIZED);
    }
    if (!roles.includes(req.user.role)) {
        throw new AppError_1.AppError("Forbidden", httpStatus_1.HttpStatus.FORBIDDEN);
    }
    next();
};
exports.authorize = authorize;
