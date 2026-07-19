import { HttpStatus } from "../constants/httpStatus";
import { AuthRepository } from "../repositories/auth.repository";

import { AppError } from "../utils/AppError";

import {
  comparePassword,
  hashPassword,
} from "../utils/password";

import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/jwt";

export class AuthService {
  constructor(
    private authRepository = new AuthRepository()
  ) {}

  async register(data: {
    name: string;
    email: string;
    password: string;
  }) {
    const existingUser =
      await this.authRepository.findUserByEmail(data.email);

    if (existingUser) {
      throw new AppError(
        "Email already exists",
        HttpStatus.CONFLICT
      );
    }

    const hashedPassword = await hashPassword(data.password);

    const user = await this.authRepository.createUser({
      name: data.name,
      email: data.email,
      password: hashedPassword,
    });

    // Remove password before returning
    const { password, ...safeUser } = user;

    return safeUser;
  }

  async login(data: {
    email: string;
    password: string;
  }) {
    const existingUser =
      await this.authRepository.findUserByEmail(data.email);

    if (!existingUser) {
      throw new AppError(
        "Invalid email or password",
        HttpStatus.UNAUTHORIZED
      );
    }

    const isPasswordValid = await comparePassword(
      data.password,
      existingUser.password
    );

    if (!isPasswordValid) {
      throw new AppError(
        "Invalid email or password",
        HttpStatus.UNAUTHORIZED
      );
    }

    const accessToken = generateAccessToken(existingUser.id);

    const refreshToken = generateRefreshToken(existingUser.id);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.authRepository.saveRefreshToken(
      refreshToken,
      existingUser.id,
      expiresAt
    );

    await this.authRepository.updateLastLogin(existingUser.id);

    // Remove password before returning
    const { password, ...user } = existingUser;

    return {
      user,
      accessToken,
      refreshToken,
    };
  }

  async me(userId: string) {
    const user = await this.authRepository.findUserById(userId);

    if (!user) {
      throw new AppError(
        "User not found",
        HttpStatus.NOT_FOUND
      );
    }

    const { password, ...safeUser } = user;

    return safeUser;
  }
}