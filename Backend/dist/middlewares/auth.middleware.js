"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const AppError_1 = require("../utils/AppError");
const httpStatus_1 = require("../constants/httpStatus");
const prisma_1 = __importDefault(require("../config/prisma"));
const jwt_1 = require("../utils/jwt");
const authenticate = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        throw new AppError_1.AppError("Authorization header missing", httpStatus_1.HttpStatus.UNAUTHORIZED);
    }
    if (!authHeader.startsWith("Bearer ")) {
        throw new AppError_1.AppError("Invalid authorization format", httpStatus_1.HttpStatus.UNAUTHORIZED);
    }
    const token = authHeader.split(" ")[1];
    const decoded = (0, jwt_1.verifyAccessToken)(token);
    const user = await prisma_1.default.user.findUnique({
        where: {
            id: decoded.userId,
        },
    });
    if (!user) {
        throw new AppError_1.AppError("User not found", httpStatus_1.HttpStatus.UNAUTHORIZED);
    }
    req.user = user;
    next();
};
exports.authenticate = authenticate;
