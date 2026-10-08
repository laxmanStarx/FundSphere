import { body } from "express-validator";

export const createDonationValidator = [
  body("campaignId")
    .notEmpty()
    .withMessage("Campaign ID is required")
    .isUUID()
    .withMessage("Invalid campaign ID"),

  body("amount")
    .notEmpty()
    .withMessage("Amount is required")
    .isFloat({ gt: 0 })
    .withMessage("Amount must be greater than 0"),

  body("anonymous")
    .optional()
    .isBoolean()
    .withMessage("Anonymous must be a boolean value"),

  body("message")
    .optional()
    .isString()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Message cannot exceed 500 characters"),
];
