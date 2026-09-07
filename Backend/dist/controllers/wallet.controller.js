"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletController = void 0;
const wallet_service_1 = require("../services/wallet.service");
const apiResponse_1 = require("../utils/apiResponse");
class WalletController {
    constructor(walletService = new wallet_service_1.WalletService()) {
        this.walletService = walletService;
        // GET /api/v1/wallet
        this.getWallet = async (req, res, next) => {
            try {
                const userId = req.user.id;
                const wallet = await this.walletService.getWallet(userId);
                return res.status(200).json(new apiResponse_1.ApiResponse(200, wallet, "Wallet fetched successfully"));
            }
            catch (error) {
                next(error);
            }
        };
        // GET /api/v1/wallet/transactions
        this.getTransactionHistory = async (req, res, next) => {
            try {
                const userId = req.user.id;
                const transactions = await this.walletService.getTransactionHistory(userId);
                return res.status(200).json(new apiResponse_1.ApiResponse(200, transactions, "Transaction history fetched successfully"));
            }
            catch (error) {
                next(error);
            }
        };
    }
}
exports.WalletController = WalletController;
