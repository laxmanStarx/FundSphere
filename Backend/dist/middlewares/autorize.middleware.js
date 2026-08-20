"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = void 0;
const AppError_1 = require("../utils/AppError");
const httpStatus_1 = require("../constants/httpStatus");
const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            throw new AppError_1.AppError("Authentication required", httpStatus_1.HttpStatus.UNAUTHORIZED);
        }
        if (!allowedRoles.includes(req.user.role)) {
            throw new AppError_1.AppError("You are not authorized to perform this action", httpStatus_1.HttpStatus.FORBIDDEN);
        }
        next();
    };
};
exports.authorize = authorize;
