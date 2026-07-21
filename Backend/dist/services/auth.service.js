"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const httpStatus_1 = require("../constants/httpStatus");
const auth_repository_1 = require("../repositories/auth.repository");
const AppError_1 = require("../utils/AppError");
const password_1 = require("../utils/password");
const jwt_1 = require("../utils/jwt");
class AuthService {
    constructor(authRepository = new auth_repository_1.AuthRepository()) {
        this.authRepository = authRepository;
    }
    async register(data) {
        const existingUser = await this.authRepository.findUserByEmail(data.email);
        if (existingUser) {
            throw new AppError_1.AppError("Email already exists", httpStatus_1.HttpStatus.CONFLICT);
        }
        const hashedPassword = await (0, password_1.hashPassword)(data.password);
        const user = await this.authRepository.createUser({
            name: data.name,
            email: data.email,
            password: hashedPassword,
        });
        // Remove password before returning
        const { password, ...safeUser } = user;
        return safeUser;
    }
    async login(data) {
        const existingUser = await this.authRepository.findUserByEmail(data.email);
        if (!existingUser) {
            throw new AppError_1.AppError("Invalid email or password", httpStatus_1.HttpStatus.UNAUTHORIZED);
        }
        const isPasswordValid = await (0, password_1.comparePassword)(data.password, existingUser.password);
        if (!isPasswordValid) {
            throw new AppError_1.AppError("Invalid email or password", httpStatus_1.HttpStatus.UNAUTHORIZED);
        }
        const accessToken = (0, jwt_1.generateAccessToken)(existingUser.id);
        const refreshToken = (0, jwt_1.generateRefreshToken)(existingUser.id);
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);
        await this.authRepository.saveRefreshToken(refreshToken, existingUser.id, expiresAt);
        await this.authRepository.updateLastLogin(existingUser.id);
        // Remove password before returning
        const { password, ...user } = existingUser;
        return {
            user,
            accessToken,
            refreshToken,
        };
    }
    async refresh(refreshToken) {
        const decoded = (0, jwt_1.verifyRefreshToken)(refreshToken);
        const storedToken = await this.authRepository.findRefreshToken(refreshToken);
        if (!storedToken) {
            throw new AppError_1.AppError("Invalid refresh token", httpStatus_1.HttpStatus.UNAUTHORIZED);
        }
        const user = await this.authRepository.findUserById(decoded.userId);
        if (!user) {
            throw new AppError_1.AppError("User not found", httpStatus_1.HttpStatus.UNAUTHORIZED);
        }
        const accessToken = (0, jwt_1.generateAccessToken)(user.id);
        return {
            accessToken,
        };
    }
    async me(userId) {
        const user = await this.authRepository.findUserById(userId);
        if (!user) {
            throw new AppError_1.AppError("User not found", httpStatus_1.HttpStatus.NOT_FOUND);
        }
        const { password, ...safeUser } = user;
        return safeUser;
    }
    async logout(refreshToken) {
        const storedToken = await this.authRepository.findRefreshToken(refreshToken);
        if (!storedToken) {
            throw new AppError_1.AppError("Invalid refresh token", httpStatus_1.HttpStatus.UNAUTHORIZED);
        }
        await this.authRepository.deleteRefreshToken(refreshToken);
        return;
    }
}
exports.AuthService = AuthService;
