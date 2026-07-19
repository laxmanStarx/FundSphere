"use strict";
// import jwt, { Secret, SignOptions } from "jsonwebtoken";
// import { Role } from "@prisma/client";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyRefreshToken = exports.verifyAccessToken = exports.generateRefreshToken = exports.generateAccessToken = void 0;
// export interface JwtPayload {
//   userId: string;
//   role: Role;
// }
// const ACCESS_SECRET: Secret = process.env.JWT_ACCESS_SECRET!;
// const REFRESH_SECRET: Secret = process.env.JWT_REFRESH_SECRET!;
// const ACCESS_EXPIRES = process.env.JWT_ACCESS_EXPIRES_IN || "15m";
// const REFRESH_EXPIRES = process.env.JWT_REFRESH_EXPIRES_IN || "7d";
// export const generateAccessToken = (payload: JwtPayload): string => {
//   return jwt.sign(payload, ACCESS_SECRET, {
//     expiresIn: ACCESS_EXPIRES,
//   } as SignOptions);
// };
// export const generateRefreshToken = (payload: JwtPayload): string => {
//   return jwt.sign(payload, REFRESH_SECRET, {
//     expiresIn: REFRESH_EXPIRES,
//   } as SignOptions);
// };
// export const verifyAccessToken = (token: string): JwtPayload => {
//   return jwt.verify(token, ACCESS_SECRET) as JwtPayload;
// };
// export const verifyRefreshToken = (token: string): JwtPayload => {
//   return jwt.verify(token, REFRESH_SECRET) as JwtPayload;
// };
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
function generateAccessToken(userId) {
    return jsonwebtoken_1.default.sign({ userId }, env_1.env.JWT_ACCESS_SECRET, {
        expiresIn: "15m",
    });
}
exports.generateAccessToken = generateAccessToken;
function generateRefreshToken(userId) {
    return jsonwebtoken_1.default.sign({ userId }, env_1.env.JWT_REFRESH_SECRET, {
        expiresIn: "7d",
    });
}
exports.generateRefreshToken = generateRefreshToken;
function verifyAccessToken(token) {
    return jsonwebtoken_1.default.verify(token, env_1.env.JWT_ACCESS_SECRET);
}
exports.verifyAccessToken = verifyAccessToken;
function verifyRefreshToken(token) {
    return jsonwebtoken_1.default.verify(token, env_1.env.JWT_REFRESH_SECRET);
}
exports.verifyRefreshToken = verifyRefreshToken;
