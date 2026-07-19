"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginValidator = exports.registerValidator = void 0;
const express_validator_1 = require("express-validator");
exports.registerValidator = [
    (0, express_validator_1.body)("name")
        .trim()
        .notEmpty()
        .withMessage("Name is required"),
    (0, express_validator_1.body)("email")
        .trim()
        .isEmail()
        .withMessage("Invalid email address")
        .normalizeEmail(),
    (0, express_validator_1.body)("password")
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters long"),
];
exports.loginValidator = [
    (0, express_validator_1.body)("email")
        .trim()
        .isEmail()
        .withMessage("Invalid email address")
        .normalizeEmail(),
    (0, express_validator_1.body)("password")
        .notEmpty()
        .withMessage("Password is required"),
];
