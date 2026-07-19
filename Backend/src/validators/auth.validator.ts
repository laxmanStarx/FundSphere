import { body } from "express-validator";

export const registerValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required"),

  body("email")
    .trim()
    .isEmail()
    .withMessage("Invalid email address")
    .normalizeEmail(),

  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
];

export const loginValidator = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Invalid email address")
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage("Password is required"),
];