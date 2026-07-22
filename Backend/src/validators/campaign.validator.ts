import { body } from "express-validator";

export const createCampaignValidator = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 5, max: 100 })
    .withMessage("Title must be between 5 and 100 characters"),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ min: 50 })
    .withMessage("Description must be at least 50 characters"),

  body("goalAmount")
    .isFloat({ gt: 0 })
    .withMessage("Goal amount must be greater than 0"),

  body("categoryId")
    .isUUID()
    .withMessage("Invalid category"),

  body("deadline")
    .isISO8601()
    .withMessage("Invalid deadline"),
];