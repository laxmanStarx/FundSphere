"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletRepository = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
class WalletRepository {
    // Find wallet by user ID
    async findWalletByUserId(userId) {
        return prisma_1.default.wallet.findUnique({
            where: {
                userId,
            },
        });
    }
    // Get wallet transaction history
    async findTransactionsByWalletId(walletId) {
        return prisma_1.default.walletTransaction.findMany({
            where: {
                walletId,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }
}
exports.WalletRepository = WalletRepository;
