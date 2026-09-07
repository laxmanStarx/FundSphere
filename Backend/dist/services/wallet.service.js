"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletService = void 0;
const httpStatus_1 = require("../constants/httpStatus");
const wallet_repository_1 = require("../repositories/wallet.repository");
const AppError_1 = require("../utils/AppError");
class WalletService {
    constructor(walletRepository = new wallet_repository_1.WalletRepository()) {
        this.walletRepository = walletRepository;
    }
    // Get user's wallet
    async getWallet(userId) {
        const wallet = await this.walletRepository.findWalletByUserId(userId);
        if (!wallet) {
            throw new AppError_1.AppError("Wallet not found", httpStatus_1.HttpStatus.NOT_FOUND);
        }
        return wallet;
    }
    // Get wallet transaction history
    async getTransactionHistory(userId) {
        const wallet = await this.walletRepository.findWalletByUserId(userId);
        if (!wallet) {
            throw new AppError_1.AppError("Wallet not found", httpStatus_1.HttpStatus.NOT_FOUND);
        }
        const transactions = await this.walletRepository.findTransactionsByWalletId(wallet.id);
        return transactions;
    }
}
exports.WalletService = WalletService;
