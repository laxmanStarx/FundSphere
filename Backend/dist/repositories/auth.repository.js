"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRepository = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
class AuthRepository {
    async findUserByEmail(email) {
        return prisma_1.default.user.findUnique({
            where: {
                email,
            },
        });
    }
    async findRefreshToken(token) {
        return prisma_1.default.refreshToken.findUnique({
            where: {
                token,
            },
        });
    }
    async createUser(data) {
        return prisma_1.default.user.create({
            data,
        });
    }
    async findUserById(id) {
        return prisma_1.default.user.findUnique({
            where: { id },
        });
    }
    async createWallet(userId) {
        return prisma_1.default.wallet.create({
            data: {
                userId,
            },
        });
    }
    async saveRefreshToken(token, userId, expiresAt) {
        return prisma_1.default.refreshToken.create({
            data: {
                token,
                userId,
                expiresAt,
            }
        });
    }
    async updateLastLogin(userId) {
        return prisma_1.default.user.update({
            where: {
                id: userId,
            },
            data: {
                lastLoginAt: new Date(),
            },
        });
    }
    async deleteRefreshToken(token) {
        return prisma_1.default.refreshToken.delete({
            where: {
                token,
            },
        });
    }
}
exports.AuthRepository = AuthRepository;
