import { HttpStatus } from "../constants/httpStatus";
import { WalletRepository } from "../repositories/wallet.repository";
import { AppError } from "../utils/AppError";

export class WalletService {
  constructor(
    private walletRepository = new WalletRepository()
  ) {}

  // Get user's wallet
  async getWallet(userId: string) {
    const wallet =
      await this.walletRepository.findWalletByUserId(
        userId
      );

    if (!wallet) {
      throw new AppError(
        "Wallet not found",
        HttpStatus.NOT_FOUND
      );
    }

    return wallet;
  }

  // Get wallet transaction history
  async getTransactionHistory(userId: string) {
    const wallet =
      await this.walletRepository.findWalletByUserId(
        userId
      );

    if (!wallet) {
      throw new AppError(
        "Wallet not found",
        HttpStatus.NOT_FOUND
      );
    }

    const transactions =
      await this.walletRepository.findTransactionsByWalletId(
        wallet.id
      );

    return transactions;
  }
}