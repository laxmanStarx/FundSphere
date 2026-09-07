import prisma from "../config/prisma";

export class WalletRepository {

  // Find wallet by user ID
  async findWalletByUserId(userId: string) {
    return prisma.wallet.findUnique({
      where: {
        userId,
      },
    });
  }

  // Get wallet transaction history
  async findTransactionsByWalletId(walletId: string) {
    return prisma.walletTransaction.findMany({
      where: {
        walletId,
      },

      orderBy: {
        createdAt: "desc",
      },
    });
  }
}