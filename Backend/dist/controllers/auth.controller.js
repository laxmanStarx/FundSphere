"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_1 = require("../services/auth.service");
const httpStatus_1 = require("../constants/httpStatus");
class AuthController {
    constructor(authService = new auth_service_1.AuthService()) {
        this.authService = authService;
    }
    async register(req, res) {
        const user = await this.authService.register(req.body);
        return res.status(httpStatus_1.HttpStatus.CREATED).json({
            success: true,
            message: "User registered successfully",
            data: user,
        });
    }
    async login(req, res) {
        const result = await this.authService.login(req.body);
        return res.status(httpStatus_1.HttpStatus.OK).json({
            success: true,
            message: "Login successful",
            data: result,
        });
    }
    async logout(req, res) {
        const { refreshToken } = req.body;
        await this.authService.logout(refreshToken);
        return res.status(httpStatus_1.HttpStatus.OK).json({
            success: true,
            message: "Logout successful",
        });
    }
    async refresh(req, res) {
        const { refreshToken } = req.body;
        const result = await this.authService.refresh(refreshToken);
        return res.status(httpStatus_1.HttpStatus.OK).json({
            success: true,
            message: "Access token refreshed successfully",
            data: result,
        });
    }
    async me(req, res) {
        const user = await this.authService.me(req.user.id);
        return res.status(httpStatus_1.HttpStatus.OK).json({
            success: true,
            data: user,
        });
    }
}
exports.AuthController = AuthController;
