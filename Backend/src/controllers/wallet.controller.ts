import { Request, Response, NextFunction } from "express";
import { WalletService } from "../services/wallet.service";
import { ApiResponse } from "../utils/apiResponse";

export class WalletController {
  constructor(
    private walletService = new WalletService()
  ) {}

  // GET /api/v1/wallet
  getWallet = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user!.id;

      const wallet =
        await this.walletService.getWallet(userId);
 return res.status(200).json(
      new ApiResponse(
        200,
        wallet,
        "Wallet fetched successfully"
      )
    );

    } catch (error) {
      next(error);
    }
  };

  // GET /api/v1/wallet/transactions
  getTransactionHistory = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user!.id;

      const transactions =
        await this.walletService.getTransactionHistory(
          userId
        );

return res.status(200).json(
  new ApiResponse(
    200,
    transactions,
    "Transaction history fetched successfully"
  )
);
    } catch (error) {
      next(error);
    }
  };
}