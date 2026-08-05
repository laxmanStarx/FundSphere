"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCampaignValidator = void 0;
const express_validator_1 = require("express-validator");
exports.createCampaignValidator = [
    (0, express_validator_1.body)("title")
        .trim()
        .notEmpty()
        .withMessage("Title is required")
        .isLength({ min: 5, max: 100 })
        .withMessage("Title must be between 5 and 100 characters"),
    (0, express_validator_1.body)("description")
        .trim()
        .notEmpty()
        .withMessage("Description is required")
        .isLength({ min: 50 })
        .withMessage("Description must be at least 50 characters"),
    (0, express_validator_1.body)("goalAmount")
        .isFloat({ gt: 0 })
        .withMessage("Goal amount must be greater than 0"),
    (0, express_validator_1.body)("categoryId")
        .isUUID()
        .withMessage("Invalid category"),
    (0, express_validator_1.body)("deadline")
        .isISO8601()
        .withMessage("Invalid deadline"),
];
