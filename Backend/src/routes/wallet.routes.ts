import { Router } from "express";
import { WalletController } from "../controllers/wallet.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

const walletController = new WalletController();

router.get(
  "/",
  authenticate,
  walletController.getWallet
);

router.get(
  "/transactions",
  authenticate,
  walletController.getTransactionHistory
);

export default router;