import { Router } from "express";

import { AuthController } from "../controllers/auth.controller";

import {
  registerValidator,
  loginValidator,
} from "../validators/auth.validator";

import { validate } from "../middlewares/validation.middleware";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

const authController = new AuthController();

router.post(
  "/register",
  registerValidator,
  validate,
  authController.register.bind(authController)
);

router.post(
  "/login",
  loginValidator,
  validate,
  authController.login.bind(authController)
);

router.get(
  "/me",
  authenticate,
  authController.me.bind(authController)
);

export default router;