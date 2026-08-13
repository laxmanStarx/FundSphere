import { Router } from "express";

import { AuthController } from "../controllers/auth.controller";

import {
  registerValidator,
  loginValidator,
} from "../validators/auth.validator";

import { validateRequest } from "../middlewares/validation.middleware";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

const authController = new AuthController();

router.post(
  "/register",
  registerValidator,
  validateRequest,
  authController.register.bind(authController)
);

router.post(
  "/login",
  loginValidator,
  validateRequest,
  authController.login.bind(authController)
);




router.post(
  "/logout",
  authController.logout.bind(authController)
);


router.post(
  "/refresh",
  authController.refresh.bind(authController)
);






router.get(
  "/me",
  authenticate,
  authController.me.bind(authController)
);


















export default router;